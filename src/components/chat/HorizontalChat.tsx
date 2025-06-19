
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTypingPlaceholder } from '@/hooks/useTypingPlaceholder';

interface HorizontalChatProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onSuggestedAction: (action: string, flowType?: 'general' | 'smartShopper' | 'valueShopper' | 'vista' | 'contactAgent') => void;
  onSerialNumberSubmit: (serialNumber: string) => void;
  isProcessing?: boolean;
}

const HorizontalChat = ({
  inputValue,
  setInputValue,
  sendMessage,
  onClose,
  onSuggestedAction,
  onSerialNumberSubmit,
  isProcessing = false
}: HorizontalChatProps) => {
  const dynamicPlaceholder = useTypingPlaceholder(isProcessing);
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-blue-600 rounded-lg shadow-xl min-w-[800px] max-w-6xl">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b12f4efb-0fa0-4019-ba3b-e5cffcf2ef22.png" 
              alt="Amigo Virtual Assistant" 
              className="h-12 object-contain"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                dynamicPlaceholder={dynamicPlaceholder}
                placeholder="Hello, I'm Amigo Mobility's virtual assistant, an AI powered tool designed to help with your customer support needs. How can I help you today?"
                className="w-full bg-white border-0 rounded-lg pl-12 pr-16 py-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent text-sm leading-relaxed min-h-[80px] resize-none"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                disabled={isProcessing}
              />
              <div className="absolute left-4 top-5">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <Button
                onClick={sendMessage}
                size="sm"
                className="absolute right-2 top-5 bg-transparent hover:bg-blue-500 text-blue-600 hover:text-white border-0 h-8 w-8 p-0"
                disabled={!inputValue.trim() || isProcessing}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => onSuggestedAction('I need help with an Amigo cart repair', 'general')}
                className="bg-blue-700 hover:bg-blue-800 text-white border-0 rounded-md px-4 py-2 text-sm font-medium"
                disabled={isProcessing}
              >
                I need help with an Amigo cart repair
              </Button>              <Button
                onClick={() => onSuggestedAction('I need to buy a part for an Amigo cart', 'contactAgent')}
                className="bg-blue-700 hover:bg-blue-800 text-white border-0 rounded-md px-4 py-2 text-sm font-medium"
                disabled={isProcessing}
              >
                I need to buy a part for an Amigo cart
              </Button>
              <Button
                onClick={() => onSuggestedAction('I have a different customer service need', 'contactAgent')}
                className="bg-blue-700 hover:bg-blue-800 text-white border-0 rounded-md px-4 py-2 text-sm font-medium"
                disabled={isProcessing}
              >
                I have a different customer service need
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalChat;
