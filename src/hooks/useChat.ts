import { useReducer, useCallback } from 'react';
import { conversationFlow as generalAmigoFlow } from '@/data/conversationFlow';
import type { ConversationStep, ConversationFlow } from '@/types';
import { smartShopperFlow } from '@/data/smartShopperFlow';
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
  // *** NEW ACTION TYPE FOR BOT'S DELAYED RESPONSE ***
  | { type: 'PROCESS_BOT_RESPONSE'; payload: { nextStepId: string } }
  | { type: 'START_FLOW_FROM_SUGGESTION'; payload: { flowType: FlowType; text: string } }
  | { type: 'SERIAL_LOOKUP_SUCCESS'; payload: { productInfo: ProductInfo; flowType: FlowType } }
  | { type: 'SERIAL_LOOKUP_FAILURE' };

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
      // ... (no change)
      return {
        ...state,
        uiState: 'modal',
        history: state.history.length === 0 ? [{ id: 'init', sender: 'agent', text: "Hello, I'm Amigo Mobility's virtual assistant. To best help you, please provide your product's serial number or select an option below.", timestamp: new Date() }] : state.history,
      };

    case 'CLOSE_WIDGET':
      return { ...initialState };

    case 'SET_UI_STATE':
      return { ...state, uiState: action.payload };
      
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };

    case 'SUBMIT_INPUT': {
      if (!state.inputValue.trim()) return state;
      const userMessage: ConversationMessage = {
        id: `${Date.now()}`,
        text: state.inputValue,
        sender: 'user',
        timestamp: new Date()
      };
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
      return {
        ...state,
        inputValue: '',
        history: [...state.history, userMessage],
        isTyping: true,
      };
    }
    
    // *** UPDATED to only add user's message and start typing indicator ***
    case 'SELECT_OPTION': {
      const { text } = action.payload;
      const userMessage: ConversationMessage = {
          id: `${Date.now()}`,
          sender: 'user',
          text: text,
          timestamp: new Date()
      };
      return {
          ...state,
          history: [...state.history, userMessage],
          isTyping: true, // Start the animation
      };
    }

    // *** NEW CASE to handle the bot's response after a delay ***
    case 'PROCESS_BOT_RESPONSE': {
      const { nextStepId } = action.payload;
      if (!state.activeFlow) return state;

      const nextStep = state.activeFlow[nextStepId];
      if (!nextStep) {
        console.error(`Step "${nextStepId}" not found in flow.`);
        return { ...state, isTyping: false };
      }

      const botMessage: ConversationMessage = {
        id: `${Date.now()}`,
        sender: 'agent',
        text: Array.isArray(nextStep.botMessage) ? nextStep.botMessage.join('\n') : nextStep.botMessage,
        timestamp: new Date()
      };

      return {
        ...state,
        history: [...state.history, botMessage],
        currentStepId: nextStepId,
        isTyping: false, // Stop the animation
      };
    }

    // ... other cases like START_FLOW_FROM_SUGGESTION, SERIAL_LOOKUP_SUCCESS, etc.
    case 'START_FLOW_FROM_SUGGESTION': {
      // ... (no change to this case block from last time)
      const { flowType, text } = action.payload;
      const flow = flowMap[flowType];
      if (!flow) return state;

      const userMessage: ConversationMessage = {
        id: `${Date.now()}`,
        sender: 'user',
        text: text,
        timestamp: new Date()
      };
      
      const isRepairFlow = text.toLowerCase().includes('cart repair');
      const startStepId = isRepairFlow ? 'start_repair_flow' : 'greeting';
      const startStep = flow[startStepId];

      if (!startStep) {
        console.error(`Starting step "${startStepId}" not found in flow.`);
        return state;
      }

      const botMessage: ConversationMessage = {
        id: `${Date.now() + 1}`,
        sender: 'agent',
        text: Array.isArray(startStep.botMessage) ? startStep.botMessage.join('\n') : startStep.botMessage,
        timestamp: new Date()
      };

      return {
        ...state,
        uiState: 'modal',
        activeFlow: flow,
        currentStepId: startStepId,
        history: [...state.history, userMessage, botMessage],
      };
    }

    case 'SERIAL_LOOKUP_SUCCESS': {
        // ... (no change)
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

    case 'SERIAL_LOOKUP_FAILURE': {
        // ... (no change)
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
    }

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
      // ... (no change to this function)
  }, [state.inputValue, state.activeFlow, state.currentStepId]);

  // *** UPDATED to use a delay ***
  const selectOption = useCallback((text: string, nextStepId: string) => {
    // Dispatch the user's action immediately
    dispatch({ type: 'SELECT_OPTION', payload: { text, nextStepId } });

    // Wait for 1.2 seconds, then dispatch the bot's response
    setTimeout(() => {
      dispatch({ type: 'PROCESS_BOT_RESPONSE', payload: { nextStepId } });
    }, 1200);
  }, []);
  
  const startFlowFromSuggestion = useCallback((flowType: FlowType, text: string) => {
    // ... (no change to this function)
    dispatch({ type: 'START_FLOW_FROM_SUGGESTION', payload: { flowType, text } });
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
      selectOption,
      startFlowFromSuggestion
    }
  };
};