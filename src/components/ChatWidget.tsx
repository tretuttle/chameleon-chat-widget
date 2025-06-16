import React, { useState, useEffect } from 'react';
import { useConversationFlow, FlowType } from '@/hooks/useConversationFlow';
import { lookupSerialNumber, determineFlowFromModel, ProductInfo } from '@/services/serialNumberService';
import ChatButton from './chat/ChatButton';
import HorizontalChat from './chat/HorizontalChat';
import ModalChat from './chat/ModalChat';
import SidebarChat from './chat/SidebarChat';
import MinimizedChat from './chat/MinimizedChat';

type ChatState = 'hidden' | 'horizontal' | 'modal' | 'sidebar' | 'minimized';
interface ChatWidgetProps {
  initialState?: 'hidden' | 'horizontal' | 'modal' | 'sidebar';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  initialState = 'horizontal'
}) => {
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const [inputValue, setInputValue] = useState('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [expectingSerialNumber, setExpectingSerialNumber] = useState(false);
  const { 
    currentStep, 
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
  } = useConversationFlow();

  // Function to check if a string looks like a serial number
  const isSerialNumberFormat = (text: string): boolean => {
    // Remove spaces and convert to uppercase
    const cleanText = text.replace(/\s+/g, '').toUpperCase();
    // Check if it matches common serial number patterns (letters and numbers, typically 6+ characters)
    return /^[A-Z0-9]{6,}$/.test(cleanText) || /^\d{6,}$/.test(cleanText);
  };

  const handleSerialNumberSubmit = async (serialNumber: string) => {
    setChatState('modal');
    
    // Add user message with serial number
    const userMessage = {
      id: Date.now().toString(),
      text: `My serial number is: ${serialNumber}`,
      sender: 'user' as const,
      timestamp: new Date()
    };
    addRegularMessage(userMessage);

    // Show loading message
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      text: "Looking up your product information...",
      sender: 'agent' as const,
      timestamp: new Date()
    };
    addRegularMessage(loadingMessage);

    try {
      const productData = await lookupSerialNumber(serialNumber);
      
      if (productData) {
        setProductInfo(productData);
        
        // Determine the appropriate flow based on the model
        const flowType = determineFlowFromModel(productData.model);
        
        // Add success message with product info
        const successMessage = {
          id: (Date.now() + 2).toString(),
          text: `Found your ${productData.model}! Let me start the appropriate troubleshooting guide for you.`,
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(successMessage);
        
        // Start the appropriate flow
        setTimeout(() => {
          startFlow(flowType);
        }, 1000);
        
      } else {
        // Serial number not found
        const errorMessage = {
          id: (Date.now() + 2).toString(),
          text: "I couldn't find that serial number in our system. Please double-check the serial number or contact our support team at 1-800-692-6446 for assistance.",
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(errorMessage);
      }
    } catch (error) {
      // Error occurred during lookup
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        text: "I'm having trouble looking up that serial number right now. Please try again later or contact our support team at 1-800-692-6446.",
        sender: 'agent' as const,
        timestamp: new Date()
      };
      addRegularMessage(errorMessage);
    }
    
    setExpectingSerialNumber(false);
  };

  const handleSuggestedAction = (action: string, flowType?: FlowType) => {
    setChatState('modal');
    
    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      text: action,
      sender: 'user' as const,
      timestamp: new Date()
    };
    addRegularMessage(newMessage);

    // Handle different actions
    if (action === 'I need help with an Amigo cart repair') {
      // Ask for serial number first
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I'd be happy to help you with your Amigo cart repair! To provide the most accurate troubleshooting steps, could you please provide your cart's serial number? You can find it on a label typically located on the back or bottom of your cart.",
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(botResponse);
        setExpectingSerialNumber(true);
      }, 1000);
    } else if (action === 'I need to buy a part for an Amigo cart') {
      // Direct to parts ordering
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I can help you with ordering parts for your Amigo cart! You can order parts through several methods:\n\n• Call our parts department at 1-800-692-6446\n• Email parts@amigomobility.com\n• Visit our website at amigomobility.com/parts\n\nPlease have your cart's model number and serial number ready when ordering. Would you like help finding your serial number?",
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(botResponse);
      }, 1000);
    } else if (action === 'I have a different customer service need') {
      // Start contact agent flow
      setTimeout(() => {
        startFlow('contactAgent');
      }, 1000);
    }
  };

  const handleFlowChoice = (choice: string, nextStep: string) => {
    handleUserChoice(choice, nextStep);
  };

  const handleModalToSidebar = () => {
    setChatState('sidebar');
  };

  const handleMinimize = () => {
    setChatState('minimized');
  };

  const handleRestore = () => {
    setChatState('sidebar');
  };

  const handleClose = () => {
    setChatState('hidden');
    resetFlow();
    setProductInfo(null);
    setExpectingSerialNumber(false);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Check if we're expecting a serial number and the input looks like one
    if (expectingSerialNumber && isSerialNumberFormat(inputValue)) {
      handleSerialNumberSubmit(inputValue);
      setInputValue('');
      return;
    }
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };
    addRegularMessage(newMessage);
    setInputValue('');

    if (!isInFlow && !expectingSerialNumber) {
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I can help you troubleshoot your Amigo cart. For the most accurate assistance, could you provide your serial number? You can click 'Enter Serial #' or just tell me what issue you're experiencing.",
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(botResponse);
      }, 1000);
    } else if (expectingSerialNumber && !isSerialNumberFormat(inputValue)) {
      // User entered text that doesn't look like a serial number
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: "I didn't recognize that as a serial number. Serial numbers are typically 6 or more characters long and contain letters and numbers. Could you please double-check and enter your serial number again? You can also contact our support team at 1-800-692-6446 if you need help locating it.",
          sender: 'agent' as const,
          timestamp: new Date()
        };
        addRegularMessage(botResponse);
      }, 1000);
    }
  };

  if (chatState === 'hidden') {
    return <ChatButton onClick={() => setChatState('horizontal')} />;
  }

  if (chatState === 'horizontal') {
    return (
      <HorizontalChat
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendMessage={sendMessage}
        onClose={handleClose}
        onSuggestedAction={handleSuggestedAction}
        onSerialNumberSubmit={handleSerialNumberSubmit}
      />
    );
  }

  if (chatState === 'modal') {
    return (
      <ModalChat
        conversationHistory={conversationHistory}
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendMessage={sendMessage}
        onClose={handleClose}
        onModalToSidebar={handleModalToSidebar}
        isInFlow={isInFlow}
        currentStep={currentStep}
        onFlowChoice={handleFlowChoice}
        onTextInput={handleTextInput}
        inputError={inputError}
        isProcessingInput={isProcessingInput}
        clearInputError={clearInputError}
      />
    );
  }

  if (chatState === 'sidebar') {
    return (
      <SidebarChat
        conversationHistory={conversationHistory}
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendMessage={sendMessage}
        onClose={handleClose}
        onMinimize={handleMinimize}
        isInFlow={isInFlow}
        currentStep={currentStep}
        onFlowChoice={handleFlowChoice}
        onTextInput={handleTextInput}
        inputError={inputError}
        isProcessingInput={isProcessingInput}
        clearInputError={clearInputError}
      />
    );
  }

  if (chatState === 'minimized') {
    return (
      <MinimizedChat
        conversationHistory={conversationHistory}
        inputValue={inputValue}
        setInputValue={setInputValue}
        sendMessage={sendMessage}
        onClose={handleClose}
        onRestore={handleRestore}
      />
    );
  }

  return null;
};

export default ChatWidget;
