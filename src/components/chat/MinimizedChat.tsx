import React from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import {
  ChatContainer,
  ChatHeader,
  ChatMessageList,
  ChatInputBar,
} from '@/components/chat/primitives';
import { ConversationMessage } from '@/hooks/useConversationFlow';

interface MinimizedChatProps {
  conversationHistory: ConversationMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  onClose: () => void;
  onRestore: () => void;
  isInputDisabled?: boolean;
}

const MinimizedChat: React.FC<MinimizedChatProps> = ({
  conversationHistory,
  inputValue,
  setInputValue,
  sendMessage,
  onClose,
  onRestore,
  isInputDisabled = false,
}) => (
  <ChatContainer variant="minimized">
    <ChatHeader
      variant="minimized"
      avatar={
        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <MessageCircle className="w-3 h-3 text-white" />
        </div>
      }
      title="Amigo Support"
      actions={[
        {
          icon: <Minimize2 className="w-3 h-3" />,
          label: 'Restore',
          onClick: onRestore,
        },
        {
          icon: <X className="w-3 h-3" />,
          label: 'Close',
          onClick: onClose,
        },
      ]}
    />
    <ChatMessageList conversationHistory={conversationHistory} condensed={3} />
    <ChatInputBar
      value={inputValue}
      onChange={setInputValue}
      onSend={sendMessage}
      placeholder={
        isInputDisabled ? 'Please select an option' : 'Message Amigo Support'
      }
      disabled={isInputDisabled}
      mode="single"
    />
  </ChatContainer>
);

export default MinimizedChat;