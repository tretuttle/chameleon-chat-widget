import React from 'react';
import { useChat } from '@/hooks/useChat'; // Your new hook
import ChatButton from './chat/ChatButton';
import ModalChat from './chat/ModalChat';
import SidebarChat from './chat/SidebarChat';

const ChatWidget = () => {
  // All state and actions come from a single, reliable source.
  const { state, actions } = useChat();

  const currentStep = state.activeFlow ? state.activeFlow[state.currentStepId] : null;

  // No more complex logic trying to reconcile two different hooks.
  const isInputDisabled = state.isTyping || (currentStep?.userOptions && currentStep.userOptions.length > 0 && !currentStep.allowTextInput);

  const handleSendMessage = () => {
    // The sendMessage action now contains all the complex logic.
    actions.sendMessage();
  };

  if (state.uiState === 'hidden') {
    return <ChatButton onClick={actions.openWidget} />;
  }
  
  // --- Render logic for Modal, Sidebar, etc. ---
  // This part remains similar, but the props are much cleaner.
  
  if (state.uiState === 'modal') {
      return (
          <ModalChat
              conversationHistory={state.history}
              inputValue={state.inputValue}
              setInputValue={actions.setInputValue}
              sendMessage={handleSendMessage}
              onClose={actions.closeWidget}
              onModalToSidebar={() => actions.setUiState('sidebar')}
              isInFlow={!!state.activeFlow}
              currentStep={currentStep}
              onFlowChoice={(text, nextStep) => actions.selectOption(text, nextStep)}
              isTyping={state.isTyping}
              isInputDisabled={isInputDisabled}
              // onDownloadTranscript and onClearHistory would be new actions in your hook
          />
      );
  }

  if (state.uiState === 'sidebar') {
      return (
          <SidebarChat
              conversationHistory={state.history}
              inputValue={state.inputValue}
              setInputValue={actions.setInputValue}
              sendMessage={handleSendMessage}
              onClose={actions.closeWidget}
              onMinimize={() => actions.setUiState('modal')}
              isInFlow={!!state.activeFlow}
              currentStep={currentStep}
              onFlowChoice={(text, nextStep) => actions.selectOption(text, nextStep)}
              isTyping={state.isTyping}
              isInputDisabled={isInputDisabled}
              // ...
          />
      );
  }

  // The HorizontalChat component would be handled similarly
  
  return null;
};

export default ChatWidget;