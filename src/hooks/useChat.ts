import { useReducer, useCallback } from 'react';
import { conversationFlow as generalAmigoFlow } from '@/data/conversationFlow';
import type { ConversationStep, ConversationFlow } from '@/types';import { smartShopperFlow } from '@/data/smartShopperFlow';
import { valueShopperFlow } from '@/data/valueShopperFlow';
import { vistaFlow } from '@/data/vistaFlow';
import { maxCRFlow } from '@/data/maxCRFlow';
import { contactAgentFlow } from '@/data/contactAgentFlow';
import { endConversationFlow } from '@/data/endConversationFlow';
import { lookupSerialNumber, determineFlowFromModel, ProductInfo } from '@/services/serialNumberService';

// --- TYPE DEFINITIONS ---

export type FlowType = 'general' | 'smartShopper' | 'valueShopper' | 'vista' | 'maxCR' | 'contactAgent' | 'endConversation';

export type ChatUIState = 'hidden' | 'horizontal' | 'modal' | 'sidebar';

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

// The single, unified state for the entire chat application
export interface ChatState {
  uiState: ChatUIState;
  history: ConversationMessage[];
  inputValue: string;
  isTyping: boolean;
  productInfo: ProductInfo | null;
  
  activeFlow: ConversationFlow | null;
  currentStepId: string | null;
}

// All possible state transitions are defined as actions
export type ChatAction =
  | { type: 'OPEN_WIDGET' }
  | { type: 'CLOSE_WIDGET' }
  | { type: 'SET_UI_STATE'; payload: ChatUIState }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SUBMIT_INPUT' }
  | { type: 'SELECT_OPTION'; payload: { text: string; nextStepId: string } }
  | { type: 'START_FLOW'; payload: { flowType: FlowType, initialMessage?: string } }
  | { type: 'START_SERIAL_LOOKUP' }
  | { type: 'SERIAL_LOOKUP_SUCCESS'; payload: { productInfo: ProductInfo, flowType: FlowType } }
  | { type: 'SERIAL_LOOKUP_FAILURE' }
  | { type: 'ADD_MESSAGE'; payload: Omit<ConversationMessage, 'id' | 'timestamp'> };

// --- FLOW MAPPING ---

const flowMap: Record<FlowType, ConversationFlow> = {
  general: generalAmigoFlow,
  smartShopper: smartShopperFlow,
  valueShopper: valueShopperFlow,
  vista: vistaFlow,
  maxCR: maxCRFlow,
  contactAgent: contactAgentFlow,
  endConversation: endConversationFlow,
};

// --- INITIAL STATE ---

const initialState: ChatState = {
  uiState: 'horizontal',
  history: [],
  inputValue: '',
  isTyping: false,
  productInfo: null,
  activeFlow: null,
  currentStepId: null,
};

// --- REDUCER (The Brains of the Operation) ---

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'OPEN_WIDGET':
      return {
        ...state,
        uiState: 'modal',
        history: state.history.length === 0 ? [{ id: 'init', sender: 'agent', text: "Hello, I'm Amigo Mobility's virtual assistant. To best help you, please provide your product's serial number or select an option below.", timestamp: new Date() }] : state.history,
      };

    case 'CLOSE_WIDGET':
      return { ...initialState }; // Reset on close

    case 'SET_UI_STATE':
      return { ...state, uiState: action.payload };
      
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };

    case 'ADD_MESSAGE': {
      const newMessage: ConversationMessage = {
        ...action.payload,
        id: `${Date.now()}`,
        timestamp: new Date(),
      };
      return { ...state, history: [...state.history, newMessage] };
    }
    
    case 'SUBMIT_INPUT': {
        if (!state.inputValue.trim()) return state;
        
        const userMessage: ConversationMessage = {
            id: `${Date.now()}`,
            text: state.inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        // If we are expecting text input for a flow step (e.g., contact info)
        if (state.activeFlow && state.currentStepId && state.activeFlow[state.currentStepId]?.allowTextInput) {
             const nextStepId = state.activeFlow[state.currentStepId].userOptions[0]?.nextStep || 'contact_info_received';
             const nextStep = state.activeFlow[nextStepId];
             const botMessage: ConversationMessage = {
                 id: `${Date.now() + 1}`,
                 text: Array.isArray(nextStep.botMessage) ? nextStep.botMessage.join('\n') : nextStep.botMessage,
                 sender: 'agent',
                 timestamp: new Date()
             };
             return {
                 ...state,
                 inputValue: '',
                 history: [...state.history, userMessage, botMessage],
                 currentStepId: nextStepId,
             };
        }

        // Default to serial number lookup
        return {
            ...state,
            inputValue: '',
            history: [...state.history, userMessage],
            isTyping: true, // Start typing indicator for lookup
        };
    }
    
    case 'SELECT_OPTION': {
      const { text, nextStepId } = action.payload;
      const userMessage: ConversationMessage = {
          id: `${Date.now()}`,
          sender: 'user',
          text: text,
          timestamp: new Date()
      };
      
      if (!state.activeFlow) return state; // Should not happen

      const nextStep = state.activeFlow[nextStepId];
      if (!nextStep) {
          console.error(`Step "${nextStepId}" not found in flow.`);
          return state; // Or handle error state
      }

      const botMessage: ConversationMessage = {
          id: `${Date.now() + 1}`,
          sender: 'agent',
          text: Array.isArray(nextStep.botMessage) ? nextStep.botMessage.join('\n') : nextStep.botMessage,
          timestamp: new Date()
      };

      return {
          ...state,
          history: [...state.history, userMessage, botMessage],
          currentStepId: nextStepId,
      };
    }

    case 'START_FLOW': {
      const { flowType, initialMessage } = action.payload;
      const flow = flowMap[flowType];
      if (!flow) return state;
      const greetingStep = flow.greeting;
      const firstMessageText = initialMessage || (Array.isArray(greetingStep.botMessage) ? greetingStep.botMessage.join('\n') : greetingStep.botMessage);

      const botMessage: ConversationMessage = {
        id: `${Date.now()}`,
        sender: 'agent',
        text: firstMessageText,
        timestamp: new Date()
      };
      
      return {
        ...state,
        activeFlow: flow,
        currentStepId: 'greeting',
        history: [...state.history, botMessage],
        isTyping: false
      };
    }
    
    case 'START_SERIAL_LOOKUP':
      return { ...state, isTyping: true };

    case 'SERIAL_LOOKUP_SUCCESS': {
      const { productInfo, flowType } = action.payload;
      const flow = flowMap[flowType];
      const greetingStep = flow.greeting;
      const successMessage: ConversationMessage = {
        id: `${Date.now()}`,
        sender: 'agent',
        text: `Thank you! I've identified your product as an Amigo ${productInfo.model}. Let's begin troubleshooting. \n\n${Array.isArray(greetingStep.botMessage) ? greetingStep.botMessage.join('\n') : greetingStep.botMessage}`,
        timestamp: new Date(),
      };
      return {
        ...state,
        productInfo,
        activeFlow: flow,
        currentStepId: 'greeting',
        isTyping: false,
        history: [...state.history, successMessage],
      };
    }

    case 'SERIAL_LOOKUP_FAILURE':
      const failureMessage: ConversationMessage = {
        id: `${Date.now()}`,
        sender: 'agent',
        text: "I'm sorry, I couldn't find that serial number. Please double-check the number and try again. You can also tell me the model name, like 'Vista' or 'SmartShopper'.",
        timestamp: new Date(),
      };
      return {
        ...state,
        isTyping: false,
        history: [...state.history, failureMessage],
      };

    default:
      return state;
  }
};

// --- THE UNIFIED HOOK ---

export const useChat = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Memoized actions to prevent unnecessary re-renders
  const openWidget = useCallback(() => dispatch({ type: 'OPEN_WIDGET' }), []);
  const closeWidget = useCallback(() => dispatch({ type: 'CLOSE_WIDGET' }), []);
  const setUiState = useCallback((uiState: ChatUIState) => dispatch({ type: 'SET_UI_STATE', payload: uiState }), []);
  const setInputValue = useCallback((value: string) => dispatch({ type: 'SET_INPUT_VALUE', payload: value }), []);
  
  const sendMessage = useCallback(async () => {
      const userInput = state.inputValue;
      if (!userInput.trim()) return;

      // Optimistically add user message and trigger reducer to handle it
      dispatch({ type: 'SUBMIT_INPUT' });
      
      // If we're not in a flow that's asking for text, assume it's a serial number/model lookup
      const currentStep = state.activeFlow ? state.activeFlow[state.currentStepId!] : null;
      if (!currentStep || !currentStep.allowTextInput) {
          try {
              const productData = await lookupSerialNumber(userInput);
              if (productData && productData.model) {
                  const flowType = determineFlowFromModel(productData.model);
                  dispatch({ type: 'SERIAL_LOOKUP_SUCCESS', payload: { productInfo: productData, flowType } });
              } else {
                  dispatch({ type: 'SERIAL_LOOKUP_FAILURE' });
              }
          } catch (error) {
              console.error("Lookup failed:", error);
              dispatch({ type: 'SERIAL_LOOKUP_FAILURE' });
          }
      }
  }, [state.inputValue, state.activeFlow, state.currentStepId]);

  const selectOption = useCallback((text: string, nextStepId: string) => {
    // This is now a simple action dispatcher. The reducer handles all the logic.
    dispatch({ type: 'SELECT_OPTION', payload: { text, nextStepId } });
  }, []);
  
  // Expose state and actions in a structured way
  return {
    state,
    actions: {
      openWidget,
      closeWidget,
      setUiState,
      setInputValue,
      sendMessage,
      selectOption
    }
  };
};
