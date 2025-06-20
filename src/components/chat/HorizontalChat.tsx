import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatHeader from '@/components/chat/primitives/ChatHeader';
import ChatInputBar from '@/components/chat/primitives/ChatInputBar';
import { ChatContainerWithSlots } from '@/components/chat/primitives/ChatContainer';
import { useTypingPlaceholder } from '@/hooks/useTypingPlaceholder';

interface HorizontalChatProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onSuggestedAction: (
    action: string,
    flowType?: 'general' | 'smartShopper' | 'valueShopper' | 'vista' | 'contactAgent'
  ) => void;
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
  isProcessing = false,
}: HorizontalChatProps) => {
  const dynamicPlaceholder = useTypingPlaceholder(isProcessing);

  return (
    <ChatContainerWithSlots
      variant="horizontal"
      slots={{
        header: (
          <ChatHeader
            variant="horizontal"
            toolbarActions={[
              {
                icon: <X />,
                onClick: onClose,
                title: 'Close',
              },
            ]}
          />
        ),
        footer: (
          <div className="space-y-3">
            <ChatInputBar
              mode="multi"
              value={inputValue}
              onChange={setInputValue}
              onSend={sendMessage}
              placeholder="Hello, I'm Amigo Mobility's virtual assistant, an AI powered tool designed to help with your customer support needs. How can I help you today?"
              dynamicPlaceholder={dynamicPlaceholder}
              disabled={isProcessing}
            />
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => onSuggestedAction('I need help with an Amigo cart repair', 'general')}
                className="bg-blue-700 hover:bg-blue-800 text-white border-0 rounded-md px-4 py-2 text-sm font-medium"
                disabled={isProcessing}
              >
                I need help with an Amigo cart repair
              </Button>
              <Button
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
        ),
      }}
    />
  );
};

export default HorizontalChat;