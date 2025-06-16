import React from 'react';
import { MessageCircle, X, Minimize2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationMessage } from '@/hooks/useConversationFlow';
import { ConversationStep } from '@/data/conversationFlow';
interface SidebarChatProps {
  conversationHistory: ConversationMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onMinimize: () => void;
  isInFlow: boolean;
  currentStep: ConversationStep | null;
  onFlowChoice: (choice: string, nextStep: string) => void;
  onTextInput?: (text: string) => void;
  inputError?: string | null;
  isProcessingInput?: boolean;
  clearInputError?: () => void;
}
const SidebarChat = ({
  conversationHistory,
  inputValue,
  setInputValue,
  sendMessage,
  onClose,
  onMinimize,
  isInFlow,
  currentStep,
  onFlowChoice,
  onTextInput,
  inputError,
  isProcessingInput = false,
  clearInputError
}: SidebarChatProps) => {
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
  return <div className="fixed right-0 top-0 bottom-0 w-96 shadow-2xl z-50 animate-slide-in-right border-l border-gray-200 flex flex-col bg-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 bg-slate-500">
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/4b9131f2-ab48-4c5a-951f-e24f1806cf8e.png" alt="Amigo Virtual Assistant" className="h-8 object-contain" />
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onMinimize} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0">
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Title */}
      <div className="px-6 py-4 text-center border-b border-gray-100 flex-shrink-0 bg-slate-200">
        <h2 className="text-xl font-light text-gray-900 mb-2">
          How can <span className="text-blue-600 font-medium">Amigo</span> help?
        </h2>
        <p className="text-gray-500 text-sm">
          Amigo Support joined • {new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
        </p>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-200">
        {conversationHistory.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'agent' ? 'bg-white border border-gray-200' : 'bg-gray-600'}`}>
                {message.sender === 'agent' ? <img src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" alt="Amigo" className="w-6 h-6 object-contain" /> : <MessageCircle className="w-4 h-4 text-white" />}
              </div>
              <div className={`text-sm p-3 rounded-lg whitespace-pre-wrap ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'}`}>
                {message.text}
              </div>
            </div>
          </div>)}
        
        {isLoading && <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <img src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" alt="Amigo" className="w-6 h-6 object-contain" />
              </div>
              <div className="bg-white border border-gray-100 rounded-lg rounded-bl-none p-3 shadow-sm">
                <div className="space-y-2">
                  <div className="h-3 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-blue-200 rounded-full animate-pulse w-4/5"></div>
                  <div className="h-3 bg-blue-200 rounded-full animate-pulse w-3/5"></div>
                </div>
              </div>
            </div>
          </div>}

        {isInFlow && currentStep && currentStep.userOptions && currentStep.userOptions.length > 0 && <div className="space-y-2">
            {currentStep.userOptions.map((option, index) => <Button key={index} onClick={() => onFlowChoice(option.text, option.nextStep)} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-md px-4 py-2 text-sm font-medium h-auto whitespace-normal break-words leading-relaxed text-left">
                {option.text}
              </Button>)}
          </div>}
      </div>

      {/* Input - Fixed at bottom - Always visible */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-slate-500">
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <Input 
              value={inputValue} 
              onChange={handleInputChange} 
              placeholder={getInputPlaceholder()} 
              disabled={!isInputEnabled}
              className={`w-full pl-12 pr-12 py-3 text-gray-700 placeholder-gray-500 rounded-lg ${
                !isInputEnabled 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
                  : inputError 
                    ? 'bg-gray-50 border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`} 
              onKeyPress={e => e.key === 'Enter' && handleInputSubmit()} 
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                <img src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" alt="Amigo" className="w-4 h-4 object-contain" />
              </div>
            </div>
            <Button 
              onClick={handleInputSubmit} 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-8 w-8 p-0" 
              disabled={!inputValue.trim() || !isInputEnabled || !!inputError}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Error Message */}
          {inputError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {inputError}
            </div>
          )}
        </div>
      </div>
    </div>;
};
export default SidebarChat;
