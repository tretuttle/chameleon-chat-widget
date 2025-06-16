import { useState } from 'react';
import { conversationFlow, ConversationStep } from '@/data/conversationFlow';
import { smartShopperFlow } from '@/data/smartShopperFlow';
import { valueShopperFlow } from '@/data/valueShopperFlow';
import { vistaFlow } from '@/data/vistaFlow';
import { maxCRFlow } from '@/data/maxCRFlow';
import { contactAgentFlow } from '@/data/contactAgentFlow';
import { endConversationFlow } from '@/data/endConversationFlow';
import { lookupSerialNumber } from '@/services/serialNumberService';

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isFlowMessage?: boolean;
}

export type FlowType = 'general' | 'smartShopper' | 'valueShopper' | 'vista' | 'maxCR' | 'contactAgent' | 'endConversation';

const flowMap = {
  general: conversationFlow,
  smartShopper: smartShopperFlow,
  valueShopper: valueShopperFlow,
  vista: vistaFlow,
  maxCR: maxCRFlow,
  contactAgent: contactAgentFlow,
  endConversation: endConversationFlow
};

export const useConversationFlow = () => {
  const [currentStep, setCurrentStep] = useState<string>('greeting');
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isInFlow, setIsInFlow] = useState(false);
  const [activeFlow, setActiveFlow] = useState<FlowType>('general');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isProcessingInput, setIsProcessingInput] = useState(false);

  const getCurrentStep = (): ConversationStep | null => {
    const flow = flowMap[activeFlow];
    return flow[currentStep] || null;
  };

  const startFlow = (flowType: FlowType = 'general') => {
    setActiveFlow(flowType);
    setIsInFlow(true);
    setCurrentStep('greeting');
    const flow = flowMap[flowType];
    const greetingStep = flow.greeting;
    
    // Combine bot messages into a single message
    const botMessageText = Array.isArray(greetingStep.botMessage) 
      ? greetingStep.botMessage.join('\n\n')
      : greetingStep.botMessage;
    
    const newMessage: ConversationMessage = {
      id: `bot-${Date.now()}`,
      text: botMessageText,
      sender: 'agent' as const,
      timestamp: new Date(),
      isFlowMessage: true
    };

    setConversationHistory([newMessage]);
  };

  const handleUserChoice = (choice: string, nextStep: string) => {
    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      text: choice,
      sender: 'user',
      timestamp: new Date(),
      isFlowMessage: true
    };

    setConversationHistory(prev => [...prev, userMessage]);

    // Move to next step
    setCurrentStep(nextStep);
    
    // Add bot response after a short delay
    setTimeout(() => {
      const flow = flowMap[activeFlow];
      const nextStepData = flow[nextStep];
      if (nextStepData) {
        // Combine bot messages into a single message
        const botMessageText = Array.isArray(nextStepData.botMessage) 
          ? nextStepData.botMessage.join('\n\n')
          : nextStepData.botMessage;
        
        const newBotMessage: ConversationMessage = {
          id: `bot-${Date.now()}`,
          text: botMessageText,
          sender: 'agent' as const,
          timestamp: new Date(),
          isFlowMessage: true
        };

        setConversationHistory(prev => [...prev, newBotMessage]);
      }
    }, 500);
  };

  const resetFlow = () => {
    setIsInFlow(false);
    setCurrentStep('greeting');
    setConversationHistory([]);
    setActiveFlow('general');
  };

  const handleTextInput = async (text: string) => {
    const currentStepData = getCurrentStep();
    if (!currentStepData?.expectsTextInput?.enabled) return;

    // Clear previous error
    setInputError(null);
    setIsProcessingInput(true);

    try {
      // Validate input
      const validation = currentStepData.expectsTextInput.validation;
      if (validation && !validation.pattern.test(text)) {
        setInputError(validation.errorMessage);
        setIsProcessingInput(false);
        return;
      }

      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        text: text,
        sender: 'user',
        timestamp: new Date(),
        isFlowMessage: true
      };

      setConversationHistory(prev => [...prev, userMessage]);

      // Handle special cases based on input type
      if (currentStepData.expectsTextInput.type === 'serial_number') {
        await handleSerialNumberInput(text, currentStepData.expectsTextInput.nextStep);
      } else {
        // Standard flow progression for other input types
        moveToNextStep(currentStepData.expectsTextInput.nextStep);
      }
    } catch (error) {
      setInputError('An error occurred processing your input. Please try again.');
    } finally {
      setIsProcessingInput(false);
    }
  };

  const handleSerialNumberInput = async (serialNumber: string, nextStep: string) => {
    try {
      // Format serial number (add AMI prefix if not present)
      const formattedSerial = serialNumber.toUpperCase().startsWith('AMI') 
        ? serialNumber.toUpperCase() 
        : `AMI${serialNumber.toUpperCase()}`;

      // Lookup serial number in NetSuite
      const productInfo = await lookupSerialNumber(formattedSerial);
      
      if (productInfo) {
        // Add success message with product info
        const successMessage: ConversationMessage = {
          id: `bot-${Date.now()}`,
          text: `Found your ${productInfo.model} (${productInfo.itemDescription || productInfo.serialNumber}) purchased on ${productInfo.purchaseDate}.`,
          sender: 'agent',
          timestamp: new Date(),
          isFlowMessage: true
        };
        
        setConversationHistory(prev => [...prev, successMessage]);
        
        // Determine appropriate flow based on model
        const modelFlow = determineFlowFromModel(productInfo.model);
        if (modelFlow !== activeFlow) {
          setActiveFlow(modelFlow);
        }
      } else {
        // Add message for invalid serial number but continue
        const warningMessage: ConversationMessage = {
          id: `bot-${Date.now()}`,
          text: `I couldn't find that serial number in our system, but I can still help you troubleshoot your Amigo cart.`,
          sender: 'agent',
          timestamp: new Date(),
          isFlowMessage: true
        };
        
        setConversationHistory(prev => [...prev, warningMessage]);
      }

      // Move to next step regardless of lookup result
      moveToNextStep(nextStep);
    } catch (error) {
      // Add error message but continue flow
      const errorMessage: ConversationMessage = {
        id: `bot-${Date.now()}`,
        text: `I'm having trouble looking up that serial number right now, but I can still help you troubleshoot your Amigo cart.`,
        sender: 'agent',
        timestamp: new Date(),
        isFlowMessage: true
      };
      
      setConversationHistory(prev => [...prev, errorMessage]);
      moveToNextStep(nextStep);
    }
  };

  const determineFlowFromModel = (model: string): FlowType => {
    const modelLower = model.toLowerCase();
    if (modelLower.includes('smart shopper') || modelLower.includes('smartshopper')) {
      return 'smartShopper';
    } else if (modelLower.includes('value shopper') || modelLower.includes('valueshopper')) {
      return 'valueShopper';
    } else if (modelLower.includes('vista')) {
      return 'vista';
    } else if (modelLower.includes('max cr') || modelLower.includes('maxcr')) {
      return 'maxCR';
    }
    return 'general';
  };

  const moveToNextStep = (nextStep: string) => {
    setCurrentStep(nextStep);
    
    // Add bot response after a short delay
    setTimeout(() => {
      const flow = flowMap[activeFlow];
      const nextStepData = flow[nextStep];
      if (nextStepData) {
        // Combine bot messages into a single message
        const botMessageText = Array.isArray(nextStepData.botMessage) 
          ? nextStepData.botMessage.join('\n\n')
          : nextStepData.botMessage;
        
        const newBotMessage: ConversationMessage = {
          id: `bot-${Date.now()}`,
          text: botMessageText,
          sender: 'agent' as const,
          timestamp: new Date(),
          isFlowMessage: true
        };

        setConversationHistory(prev => [...prev, newBotMessage]);
      }
    }, 500);
  };

  const clearInputError = () => {
    setInputError(null);
  };

  const addRegularMessage = (message: ConversationMessage) => {
    setConversationHistory(prev => [...prev, message]);
  };

  return {
    currentStep: getCurrentStep(),
    conversationHistory,
    isInFlow,
    activeFlow,
    inputError,
    isProcessingInput,
    startFlow,
    handleUserChoice,
    handleTextInput,
    resetFlow,
    addRegularMessage,
    clearInputError
  };
};
