
import React from 'react';
import { MessageCircle, X, Minimize2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConversationMessage } from '@/hooks/useConversationFlow';

interface MinimizedChatProps {
  conversationHistory: ConversationMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onRestore: () => void;
}

const MinimizedChat = ({
  conversationHistory,
  inputValue,
  setInputValue,
  sendMessage,
  onClose,
  onRestore
}: MinimizedChatProps) => {
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 animate-scale-in border border-gray-200">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
          <span className="font-medium text-gray-700 text-sm">Amigo Support</span>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestore}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 max-h-60 overflow-y-auto bg-gray-50">
        {conversationHistory.slice(-3).map(message => (
          <div key={message.id} className={`flex mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`text-xs p-2 rounded max-w-[85%] ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-100'
            }`}>
              {message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message Amigo Support"
            className="w-full bg-gray-50 border-gray-200 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-2 h-2 text-white" />
            </div>
          </div>
          <Button
            onClick={sendMessage}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-6 w-6 p-0"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinimizedChat;
