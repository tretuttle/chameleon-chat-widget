import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Minimize2, Send, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ConversationMessage, ConversationStep } from '@/types';
import TypingIndicator from './TypingIndicator';

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
  isTyping?: boolean;
  isInputDisabled?: boolean;
  onDownloadTranscript?: () => void;
  onClearHistory?: () => void;
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
  isTyping = false,
  isInputDisabled = false,
  onDownloadTranscript,
  onClearHistory
}: ModalChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasOnlyButtonOptions = currentStep && currentStep.userOptions && currentStep.userOptions.length > 0;
  const [streamingPlaceholder, setStreamingPlaceholder] = useState('');

  // Update streaming placeholder when typing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTyping) {
      let dots = '';
      interval = setInterval(() => {
        dots = dots === '...' ? '' : dots + '.';
        setStreamingPlaceholder(`Hang on while I check${dots}`);
      }, 500);
    } else {
      setStreamingPlaceholder('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, isTyping, currentStep]);

  const getPlaceholderText = () => {
    if (isTyping) return streamingPlaceholder;
    if (isInputDisabled) return "Please select an option above";
    return "Type your message here...";
  };

  const handleClearHistory = () => {
    if (onClearHistory && conversationHistory.length > 0) {
      if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        onClearHistory();
      }
    }
  };

  const handleButtonClick = (option: any, index: number) => {
    if (onFlowChoice) {
      onFlowChoice(option.text, option.nextStep);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-transparent rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <img 
              src="/lovable-uploads/b12f4efb-0fa0-4019-ba3b-e5cffcf2ef22.png" 
              alt="Amigo Virtual Assistant" 
              className="h-10 object-contain"
            />
            <div className="flex items-center space-x-2">
              {onClearHistory && conversationHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-white hover:text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
              {onDownloadTranscript && conversationHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownloadTranscript}
                  className="text-white hover:text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
                  title="Download Transcript"
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onModalToSidebar}
                className="text-white hover:text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container - Fixed height with scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-[500px] bg-gradient-to-b from-blue-50 via-blue-25 to-white">
          {/* Title and timestamp - now in scrollable area */}
          <div className="text-center pb-4 border-b border-blue-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              How can <span className="text-blue-500">Amigo</span> help?
            </h2>
            <p className="text-black text-sm font-medium">
              Amigo Support joined • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>

          {conversationHistory.filter(msg => msg.text !== 'typing').map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-4 max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'agent' ? 'bg-white border-2 border-blue-100 shadow-sm' : 'bg-blue-600'
                }`}>
                  {message.sender === 'agent' ? (
                    <img 
                      src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" 
                      alt="Amigo" 
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`px-6 py-4 rounded-2xl text-sm whitespace-pre-wrap shadow-sm leading-relaxed ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-md' 
                    : 'bg-white text-gray-800 rounded-tl-md border border-blue-100'
                }`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}

          {!isTyping && currentStep && currentStep.userOptions && currentStep.userOptions.length > 0 && onFlowChoice && (
            <div className="space-y-3 mt-6">
              {currentStep.userOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleButtonClick(option, index)}
                  className="w-full justify-start text-left h-auto p-4 bg-blue-600 hover:bg-blue-700 text-white border-0 whitespace-normal break-words shadow-md rounded-xl font-medium"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        {!hasOnlyButtonOptions && (
          <div className="px-8 py-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 via-blue-25 to-white flex-shrink-0 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="w-full py-4 text-base bg-white border-2 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-gray-700 placeholder-gray-500 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && !isInputDisabled && sendMessage()}
                  disabled={isInputDisabled || isTyping}
                />
              </div>
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 p-0 border-0 rounded-lg flex-shrink-0"
                disabled={!inputValue.trim() || isInputDisabled || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalChat;