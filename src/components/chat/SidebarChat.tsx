import React from 'react';
import { X, Expand, Download, Trash2 } from 'lucide-react';
import ChatContainer from '@/components/chat/primitives/ChatContainer';
import type { ChatShellProps } from './primitives/ChatShellProps';
import ChatHeader, { ToolbarAction } from '@/components/chat/primitives/ChatHeader';
import ChatMessageList from '@/components/chat/primitives/ChatMessageList';
import ChatOptionButtons from '@/components/chat/primitives/ChatOptionButtons';
import ChatInputBar from '@/components/chat/primitives/ChatInputBar';

const SidebarChat: React.FC<ChatShellProps> = ({
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
}) => {
  const handleClearHistory = () => {
    if (onClearHistory && conversationHistory.length > 0) {
      if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        onClearHistory();
      }
    }
  };

  const toolbarActions: ToolbarAction[] = [
    {
      icon: <Trash2 />,
      onClick: handleClearHistory,
      show: Boolean(onClearHistory && conversationHistory.length > 0),
      title: 'Clear Chat History'
    },
    {
      icon: <Download />,
      onClick: onDownloadTranscript ?? (() => {}),
      show: Boolean(onDownloadTranscript && conversationHistory.length > 0),
      title: 'Download Transcript'
    },
    {
      icon: <Expand />,
      onClick: onMinimize,
      title: 'Minimize'
    },
    {
      icon: <X />,
      onClick: onClose,
      title: 'Close'
    }
  ];

  return (
    <ChatContainer variant="sidebar">
      <ChatHeader variant="sidebar" toolbarActions={toolbarActions} />
      <ChatMessageList conversationHistory={conversationHistory} isTyping={isTyping} />
      {!isTyping && currentStep?.userOptions && currentStep.userOptions.length > 0 && (
        <ChatOptionButtons
          options={currentStep.userOptions}
          disabled={isInputDisabled}
          onSelect={onFlowChoice}
        />
      )}
      <ChatInputBar
        mode="single"
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
        placeholder={
          isTyping
            ? 'Hang on while I check...'
            : isInputDisabled
            ? 'Please select an option above'
            : 'Type your message here...'
        }
        disabled={isInputDisabled || isTyping}
      />
    </ChatContainer>
  );
};

export default SidebarChat;