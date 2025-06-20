import React from 'react';
import { X, Minimize2, Expand, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatToolbarActionsProps {
  // Action availability flags
  showClearHistory?: boolean;
  showDownloadTranscript?: boolean;
  showMinimize?: boolean;
  showExpand?: boolean;
  showClose?: boolean;
  
  // Action callbacks
  onClearHistory?: () => void;
  onDownloadTranscript?: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  
  // Styling props
  variant?: 'modal' | 'sidebar';
  className?: string;
}

const ChatToolbarActions = ({
  showClearHistory = false,
  showDownloadTranscript = false,
  showMinimize = false,
  showExpand = false,
  showClose = false,
  onClearHistory,
  onDownloadTranscript,
  onMinimize,
  onExpand,
  onClose,
  variant = 'modal',
  className = ''
}: ChatToolbarActionsProps) => {
  const buttonSize = variant === 'modal' ? 'sm' : 'sm';
  const iconSize = variant === 'modal' ? 'w-5 h-5' : 'w-4 h-4';
  const buttonClasses = variant === 'modal' 
    ? 'text-white hover:text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full'
    : 'text-white hover:text-white hover:bg-white/20 h-8 w-8 p-0';

  const handleClearHistory = () => {
    if (onClearHistory) {
      if (window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        onClearHistory();
      }
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showClearHistory && onClearHistory && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={handleClearHistory}
          className={buttonClasses}
          title="Clear Chat History"
        >
          <Trash2 className={iconSize} />
        </Button>
      )}
      
      {showDownloadTranscript && onDownloadTranscript && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={onDownloadTranscript}
          className={buttonClasses}
          title="Download Transcript"
        >
          <Download className={iconSize} />
        </Button>
      )}
      
      {showMinimize && onMinimize && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={onMinimize}
          className={buttonClasses}
          title="Minimize"
        >
          <Minimize2 className={iconSize} />
        </Button>
      )}
      
      {showExpand && onExpand && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={onExpand}
          className={buttonClasses}
          title="Expand"
        >
          <Expand className={iconSize} />
        </Button>
      )}
      
      {showClose && onClose && (
        <Button
          variant="ghost"
          size={buttonSize}
          onClick={onClose}
          className={buttonClasses}
          title="Close"
        >
          <X className={iconSize} />
        </Button>
      )}
    </div>
  );
};

export default ChatToolbarActions;