
import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Expand, Send, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ConversationMessage, ConversationStep } from '@/types';
import TypingIndicator from './TypingIndicator';

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
  isTyping?: boolean;
  isInputDisabled?: boolean;
  onDownloadTranscript?: () => void;
  onClearHistory?: () => void;
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
  isTyping = false,
  isInputDisabled = false,
  onDownloadTranscript,
  onClearHistory
}: SidebarChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingPlaceholder, setStreamingPlaceholder] = useState('');

  // Debug logging for button rendering
  console.log('🔥🔥🔥 SidebarChat - Rendering with currentStep:', currentStep);
  console.log('🔥🔥🔥 SidebarChat - onFlowChoice function:', onFlowChoice);

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

  // Enhanced button click handler with debugging
  const handleButtonClick = (option: any, index: number) => {
    console.log('🔥🔥🔥 SidebarChat - Button clicked!');
    console.log('🔥🔥🔥 SidebarChat - Option:', option);
    console.log('🔥🔥🔥 SidebarChat - Index:', index);
    console.log('🔥🔥🔥 SidebarChat - onFlowChoice function type:', typeof onFlowChoice);
    
    if (onFlowChoice) {
      console.log('🔥🔥🔥 SidebarChat - Calling onFlowChoice with:', option.text, option.nextStep);
      onFlowChoice(option.text, option.nextStep);
    } else {
      console.error('🔥🔥🔥 SidebarChat - onFlowChoice is not defined!');
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 shadow-2xl z-50 animate-slide-in-right border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-100 flex-shrink-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/4b9131f2-ab48-4c5a-951f-e24f1806cf8e.png" alt="Amigo Virtual Assistant" className="h-8 object-contain" />
        </div>
        <div className="flex space-x-1">
          {onClearHistory && conversationHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearHistory} 
              className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onDownloadTranscript && conversationHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDownloadTranscript} 
              className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              title="Download Transcript"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onMinimize} className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0">
            <Expand className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gradient-to-b from-blue-50 to-white">
        {/* Title and timestamp - now in scrollable area */}
        <div className="text-center pb-4 border-b border-blue-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            How can <span className="text-blue-500">Amigo</span> help?
          </h2>
          <p className="text-black text-sm font-medium">
            Amigo Support joined • {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          </p>
        </div>

        {conversationHistory.filter(msg => msg.text !== 'typing').map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'agent' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-blue-600'}`}>
                {message.sender === 'agent' ? <img src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" alt="Amigo" className="w-6 h-6 object-contain" /> : <MessageCircle className="w-4 h-4 text-white" />}
              </div>
              <div className={`text-sm p-3 rounded-lg whitespace-pre-wrap shadow-sm ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
          {isTyping && <TypingIndicator />}

        {!isTyping && currentStep && currentStep.userOptions && currentStep.userOptions.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 bg-yellow-100 p-2 rounded">
              🔥🔥🔥 DEBUG: Rendering {currentStep.userOptions.length} buttons
            </div>
            {currentStep.userOptions.map((option, index) => (
              <Button 
                key={index} 
                onClick={() => handleButtonClick(option, index)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-md px-4 py-3 text-sm font-medium whitespace-normal text-left leading-relaxed min-h-[44px] h-auto shadow-md"
              >
                🔥 {option.text}
              </Button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom - Always show */}
      <div className="p-4 border-t border-blue-100 flex-shrink-0 bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <div className="relative">
          <Input 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            placeholder={getPlaceholderText()}
            className="w-full bg-white border-2 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-lg pl-12 pr-12 py-3 text-gray-700 placeholder-gray-500"
            onKeyPress={e => e.key === 'Enter' && !isInputDisabled && !isTyping && sendMessage()}
            disabled={isInputDisabled || isTyping}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-white border-2 border-blue-100 rounded-full flex items-center justify-center shadow-sm">
              <img src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" alt="Amigo" className="w-4 h-4 object-contain" />
            </div>
          </div>
          <Button onClick={sendMessage} size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-8 w-8 p-0 rounded-lg" disabled={!inputValue.trim() || isInputDisabled || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarChat;
