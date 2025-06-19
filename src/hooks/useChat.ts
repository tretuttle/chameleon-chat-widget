import { useReducer, useCallback } from 'react';
import { conversationFlow as generalAmigoFlow } from '@/data/conversationFlow';
import type { ConversationStep, ConversationFlow, ConversationMessage } from '@/types';
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
  | { type: 'SUBMIT_INPUT' }  | { type: 'START_FLOW'; payload: { flowType: FlowType, initialMessage?: string } }
  | { type: 'START_SERIAL_LOOKUP' }
  | { type: 'SERIAL_LOOKUP_SUCCESS'; payload: { productInfo: ProductInfo, flowType: FlowType } }
  | { type: 'SERIAL_LOOKUP_FAILURE' }
  | { type: 'ADD_MESSAGE'; payload: Omit<ConversationMessage, 'id' | 'timestamp'> }
  // *** MODIFIED AND ADDED ACTIONS FOR ANIMATION LOGIC ***
  | { type: 'SELECT_OPTION'; payload: { text: string } }
  | { type: 'PROCESS_BOT_RESPONSE'; payload: { nextStepId: string } }
  | { type: 'START_FLOW_FROM_SUGGESTION'; payload: { text: string } }
  | { type: 'PROCESS_SUGGESTION_RESPONSE'; payload: { flowType: FlowType; text: string } };

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
      return { ...initialState };

    case 'SET_UI_STATE':
      return { ...state, uiState: action.payload };
      
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };

    case 'ADD_MESSAGE': {
      const newMessage: ConversationMessage = { ...action.payload, id: `${Date.now()}`, timestamp: new Date() };
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

      const { activeFlow, currentStepId } = state;

      // Check if the current step is a designated text input step
      if (activeFlow && currentStepId && activeFlow[currentStepId]?.allowTextInput) {
        
        // **NEW LOGIC**: Check if this is for a serial number or model name
        if (currentStepId === 'ask_for_serial_number' || currentStepId === 'ask_for_model_name') {
          // If it is, we simply add the user's message and start the 'typing' state.
          // The async API call is handled by the sendMessage function outside the reducer.
          return {
            ...state,
            inputValue: '',
            history: [...state.history, userMessage],
            isTyping: true,
          };
        }        // This is the old logic, now correctly used only for other text inputs like contact info.
        const nextStepId = activeFlow[currentStepId].userOptions[0]?.nextStep || 'contact_info_received';
        let nextStep = activeFlow[nextStepId];
        let currentActiveFlow = activeFlow;

        // *** ADD THIS BLOCK ***
        if (!nextStep) {
          if (contactAgentFlow[nextStepId]) {
            console.log(`Switching to contactAgentFlow`);
            currentActiveFlow = contactAgentFlow;
            nextStep = currentActiveFlow[nextStepId];
          } else if (endConversationFlow[nextStepId]) {
            console.log(`Switching to endConversationFlow`);
            currentActiveFlow = endConversationFlow;
            nextStep = currentActiveFlow[nextStepId];
          }
        }

        if (!nextStep) {
          console.error(`Next step "${nextStepId}" not found in flow.`);
          return state; // Prevent crash
        }

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

      // This is the default case if text is submitted outside of a defined flow step
      return {
        ...state,
        inputValue: '',
        history: [...state.history, userMessage],
        isTyping: true,
      };
    }
    
    // *** MODIFIED for animation: Only adds user message and starts typing. ***
    case 'SELECT_OPTION': {
      const { text } = action.payload;
      const userMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'user', text: text, timestamp: new Date() };
      return { ...state, history: [...state.history, userMessage], isTyping: true };
    }    // *** ADDED for animation: Adds bot response after delay. ***
    case 'PROCESS_BOT_RESPONSE': {
      const { nextStepId } = action.payload;
      if (!state.activeFlow) return { ...state, isTyping: false };
      
      // Check if this is a cross-flow navigation step
      const crossFlowMap: Record<string, FlowType> = {
        'start_smartshopper_flow': 'smartShopper',
        'start_valueshopper_flow': 'valueShopper',
        'start_vista_flow': 'vista',
        'start_maxcr_flow': 'maxCR'
      };
      
      if (crossFlowMap[nextStepId]) {
        // Switch to the appropriate flow
        const newFlowType = crossFlowMap[nextStepId];
        const newFlow = flowMap[newFlowType];
        const nextStep = newFlow[nextStepId];
        
        if (!nextStep) {
          console.error(`Step "${nextStepId}" not found in flow: ${newFlowType}`);
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
          activeFlow: newFlow, 
          currentStepId: nextStepId, 
          history: [...state.history, botMessage], 
          isTyping: false 
        };
      }      
      // Normal same-flow navigation
      let nextStep = state.activeFlow[nextStepId];
      let activeFlow = state.activeFlow;
      
      // *** ADD FALLBACK LOGIC FOR CROSS-FLOW NAVIGATION ***
      if (!nextStep) {
        if (contactAgentFlow[nextStepId]) {
          console.log(`Switching to contactAgentFlow`);
          activeFlow = contactAgentFlow;
          nextStep = activeFlow[nextStepId];
        } else if (endConversationFlow[nextStepId]) {
          console.log(`Switching to endConversationFlow`);
          activeFlow = endConversationFlow;
          nextStep = activeFlow[nextStepId];
        }
      }
      
      if (!nextStep) {
        console.error(`Step "${nextStepId}" could not be found in any known flow.`);
        return { ...state, isTyping: false };
      }
      const botMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'agent', text: Array.isArray(nextStep.botMessage) ? nextStep.botMessage.join('\n') : nextStep.botMessage, timestamp: new Date() };
      return { ...state, activeFlow, history: [...state.history, botMessage], currentStepId: nextStepId, isTyping: false };
    }

    // *** ADDED for animation: Starts the flow from horizontal view. ***
    case 'START_FLOW_FROM_SUGGESTION': {
      const { text } = action.payload;
      const userMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'user', text: text, timestamp: new Date() };
      return { ...state, uiState: 'modal', history: [userMessage], isTyping: true };
    }    // *** ADDED for animation: Processes the bot response for the initial flow. ***
    case 'PROCESS_SUGGESTION_RESPONSE': {
      const { flowType, text } = action.payload;
      const flow = flowMap[flowType];
      if (!flow) return { ...state, isTyping: false };

      // *** NEW, SMARTER LOGIC TO FIND THE CORRECT STARTING STEP ***
      let startStepId: string;
      if (flowType === 'general') {
        // The repair flow starts with this custom step
        startStepId = 'start_repair_flow';
      } else if (flowType === 'contactAgent') {
        // The contact agent flow starts with this step
        startStepId = 'contact_agent';
      } else {
        // All other flows can default to 'greeting'
        startStepId = 'greeting';
      }
      
      const startStep = flow[startStepId];
      if (!startStep) {
        console.error(`Starting step "${startStepId}" not found in flow: ${flowType}`);
        return { ...state, isTyping: false };
      }

      const botMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'agent', text: Array.isArray(startStep.botMessage) ? startStep.botMessage.join('\n') : startStep.botMessage, timestamp: new Date() };

      return { ...state, activeFlow: flow, currentStepId: startStepId, history: [...state.history, botMessage], isTyping: false };
    }

    // *** RESTORED ALL PREVIOUSLY WORKING LOGIC BELOW ***
    case 'START_FLOW': {
      const { flowType, initialMessage } = action.payload;
      const flow = flowMap[flowType];
      if (!flow) return state;
      const greetingStep = flow.greeting;
      const firstMessageText = initialMessage || (Array.isArray(greetingStep.botMessage) ? greetingStep.botMessage.join('\n') : greetingStep.botMessage);
      const botMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'agent', text: firstMessageText, timestamp: new Date() };
      return { ...state, activeFlow: flow, currentStepId: 'greeting', history: [...state.history, botMessage], isTyping: false };
    }
    
    case 'START_SERIAL_LOOKUP':
      return { ...state, isTyping: true };

    case 'SERIAL_LOOKUP_SUCCESS': {
        const { productInfo, flowType } = action.payload;
        const flow = flowMap[flowType];
        const greetingStep = flow.greeting;
        const successMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'agent', text: `Thank you! I've identified your product as an Amigo ${productInfo.model}. Let's begin troubleshooting. \n\n${Array.isArray(greetingStep.botMessage) ? greetingStep.botMessage.join('\n') : greetingStep.botMessage}`, timestamp: new Date() };
        return { ...state, productInfo, activeFlow: flow, currentStepId: 'greeting', isTyping: false, history: [...state.history, successMessage] };
    }

    case 'SERIAL_LOOKUP_FAILURE': {
        const failureMessage: ConversationMessage = { id: `${Date.now()}`, sender: 'agent', text: "I'm sorry, I couldn't find that serial number. Please double-check the number and try again. You can also tell me the model name, like 'Vista' or 'SmartShopper'.", timestamp: new Date() };
        return { ...state, isTyping: false, history: [...state.history, failureMessage] };
    }

    default:
      return state;
  }
};

// --- THE UNIFIED HOOK ---
export const useChat = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const openWidget = useCallback(() => dispatch({ type: 'OPEN_WIDGET' }), []);
  const closeWidget = useCallback(() => dispatch({ type: 'CLOSE_WIDGET' }), []);
  const setUiState = useCallback((uiState: ChatUIState) => dispatch({ type: 'SET_UI_STATE', payload: uiState }), []);
  const setInputValue = useCallback((value: string) => dispatch({ type: 'SET_INPUT_VALUE', payload: value }), []);
    const sendMessage = useCallback(async () => {
    const userInput = state.inputValue;
    if (!userInput.trim()) return;

    // Capture the current state BEFORE dispatching
    const { activeFlow, currentStepId } = state;
    const currentStep = activeFlow ? activeFlow[currentStepId!] : null;

    // Dispatch this first. The reducer will add the user message to history
    // and set isTyping = true.
    dispatch({ type: 'SUBMIT_INPUT' });

    // Check if the current step is one that requires a serial number lookup.
    // We use the captured state from BEFORE the dispatch to make this decision.
    if (currentStep?.allowTextInput && (currentStepId === 'ask_for_serial_number' || currentStepId === 'ask_for_model_name')) {
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
    } else if (!currentStep || !currentStep.allowTextInput) {
      // This handles the case where we're not in a specific flow step
      // and should attempt a serial number lookup
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
  }, [state]);

  const selectOption = useCallback((text: string, nextStepId: string) => {
    dispatch({ type: 'SELECT_OPTION', payload: { text } });
    setTimeout(() => {
      dispatch({ type: 'PROCESS_BOT_RESPONSE', payload: { nextStepId } });
    }, 1200);
  }, []);
  
  const startFlow = useCallback((flowType: FlowType, initialMessage?: string) => {
    dispatch({ type: 'START_FLOW', payload: { flowType, initialMessage } });
  }, []);
  
  const startFlowFromSuggestion = useCallback((flowType: FlowType, text: string) => {
    dispatch({ type: 'START_FLOW_FROM_SUGGESTION', payload: { text } });
    setTimeout(() => {
      dispatch({ type: 'PROCESS_SUGGESTION_RESPONSE', payload: { flowType, text } });
    }, 1200);
  }, []);

  return {
    state,
    actions: {
      openWidget,
      closeWidget,
      setUiState,
      setInputValue,
      sendMessage,
      selectOption,
      startFlow,
      startFlowFromSuggestion
    }
  };
};