/**
 * Core properties shared between different chat shell variants (Modal, Sidebar, etc.)
 */
export interface ChatShellProps {
  /**
   * Array of chat messages representing the conversation history
   */
  conversationHistory: Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;

  /**
   * Current value of the input field
   */
  inputValue: string;

  /**
   * Function to update the input field value
   */
  setInputValue: (value: string) => void;

  /**
   * Function called when a message is sent
   */
  sendMessage: () => void;

  /**
   * Function called when the chat is closed
   */
  onClose: () => void;

  /**
   * Function called when modal chat is converted to sidebar (modal variant only)
   */
  onModalToSidebar?: () => void;

  /**
   * Function called when chat is minimized (sidebar variant only)
   */
  onMinimize?: () => void;

  /**
   * Function called when chat is restored from minimized state
   */
  onRestore?: () => void;

  /**
   * Whether the chat is currently in a guided flow state
   */
  isInFlow?: boolean;

  /**
   * Current step in the guided flow with available user options
   */
  currentStep?: {
    userOptions?: Array<{
      text: string;
      nextStep: string;
    }>;
  } | null;

  /**
   * Function called when a flow choice is made
   */
  onFlowChoice?: (choice: string, nextStep: string) => void;

  /**
   * Whether the bot is currently typing/processing
   */
  isTyping?: boolean;

  /**
   * Whether the input field should be disabled
   */
  isInputDisabled?: boolean;

  /**
   * Function called to download the conversation transcript
   */
  onDownloadTranscript?: () => void;

  /**
   * Function called to clear the conversation history
   */
  onClearHistory?: () => void;
}