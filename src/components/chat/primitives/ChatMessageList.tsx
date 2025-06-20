import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import type { ConversationMessage } from '@/types';
import TypingIndicator from '../TypingIndicator';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';

interface ChatMessageListProps {
  conversationHistory: ConversationMessage[];
  isTyping?: boolean;
  condensed?: number;
  className?: string;
}

const ChatMessageList = ({
  conversationHistory,
  isTyping = false,
  condensed,
  className = ''
}: ChatMessageListProps) => {
  const { messagesEndRef, scrollToBottom } = useScrollToBottom();

  // Filter out typing placeholders and apply condensed limit if specified
  const filteredMessages = conversationHistory
    .filter(msg => msg.text !== 'typing')
    .slice(condensed ? -condensed : 0);

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, isTyping, scrollToBottom]);

  const renderMessage = (message: ConversationMessage, isCondensed: boolean = false) => (
    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-4 max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'agent' ? 'bg-white border-2 border-blue-100 shadow-sm' : 'bg-blue-600'
        } ${isCondensed ? 'w-6 h-6' : ''}`}>
          {message.sender === 'agent' ? (
            <img 
              src="/lovable-uploads/7a9d14cc-e93b-47a3-b3c8-c9ce3563866f.png" 
              alt="Amigo" 
              className={`object-contain ${isCondensed ? 'w-3 h-3' : 'w-6 h-6'}`}
            />
          ) : (
            <MessageCircle className={`text-white ${isCondensed ? 'w-3 h-3' : 'w-5 h-5'}`} />
          )}
        </div>
        <div className={`px-6 py-4 rounded-2xl whitespace-pre-wrap shadow-sm leading-relaxed ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-md' 
            : 'bg-white text-gray-800 rounded-tl-md border border-blue-100'
        } ${isCondensed ? 'px-2 py-2 text-xs' : 'text-sm'}`}>
          {isCondensed && message.text.length > 100 
            ? message.text.substring(0, 100) + '...' 
            : message.text
          }
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {filteredMessages.map(message => renderMessage(message, !!condensed))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;