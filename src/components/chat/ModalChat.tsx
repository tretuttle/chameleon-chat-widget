
import React from 'react';
import { MessageCircle, X, Minimize2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationMessage } from '@/hooks/useConversationFlow';
import { ConversationStep } from '@/data/conversationFlow';

interface ModalChatProps {
  conversationHistory: ConversationMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onModalToSidebar: () => void;
  isInFlow?: boolean;
  currentStep?: ConversationStep | null;
  onFlowChoice?: (choice: string, nextStep: string) => void;
  onTextInput?: (text: string) => void;
  inputError?: string | null;
  isProcessingInput?: boolean;
  clearInputError?: () => void;
}

const ModalChat = ({
  conversationHistory,
  inputValue,
  setInputValue,
  sendMessage,
  onClose,
  onModalToSidebar,
  isInFlow = false,
  currentStep = null,
  onFlowChoice,
  onTextInput,
  inputError,
  isProcessingInput = false,
  clearInputError
}: ModalChatProps) => {
  const hasButtons = isInFlow && currentStep && currentStep.userOptions && currentStep.userOptions.length > 0;
  const expectsTextInput = isInFlow && currentStep && currentStep.expectsTextInput?.enabled;
  const isInputEnabled = expectsTextInput || !isInFlow;
  const isLoading = conversationHistory.some(msg => msg.text.includes("Looking up") || msg.text.includes("loading")) || isProcessingInput;

  const getInputPlaceholder = () => {
    if (!isInputEnabled) {
      return "Please select an option above";
    }
    if (expectsTextInput && currentStep?.expectsTextInput?.placeholder) {
      return currentStep.expectsTextInput.placeholder;
    }
    return "Type your message here...";
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    
    if (expectsTextInput && onTextInput) {
      onTextInput(inputValue.trim());
      setInputValue('');
    } else {
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (inputError && clearInputError) {
      clearInputError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img 
              src="/chameleon-chat-widget/lovable-uploads/b12f4efb-0fa0-4019-ba3b-e5cffcf2ef22.png" 
              alt="Amigo Virtual Assistant" 
              className="h-8 object-contain"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onModalToSidebar}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Title Section */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            How can <span className="text-blue-600">Amigo</span> help?
          </h2>
          <p className="text-gray-600 text-sm">
            Amigo Support joined • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {conversationHistory.slice(-10).map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'agent' ? 'bg-white border border-gray-200' : 'bg-gray-500'
                }`}>
                  {message.sender === 'agent' ? (
                    <img 
                      src="/chameleon-chat-widget/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" 
                      alt="Amigo" 
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-gray-100 text-gray-900 rounded-tl-sm border'
                }`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/chameleon-chat-widget/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" 
                    alt="Amigo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="bg-gray-100 border rounded-lg rounded-tl-sm px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isInFlow && currentStep && currentStep.userOptions && currentStep.userOptions.length > 0 && onFlowChoice && (
            <div className="space-y-2 mt-4">
              {currentStep.userOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => onFlowChoice(option.text, option.nextStep)}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 whitespace-normal break-words leading-relaxed"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Input Section - Always visible */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={getInputPlaceholder()}
                  disabled={!isInputEnabled}
                  className={`w-full pr-12 ${
                    !isInputEnabled 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                      : inputError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                />
                <Button
                  onClick={handleInputSubmit}
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0"
                  disabled={!inputValue.trim() || !isInputEnabled || !!inputError}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Error Message */}
            {inputError && (
              <div className="text-red-600 text-sm">
                {inputError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChat;
