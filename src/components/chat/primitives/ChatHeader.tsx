import React from 'react';
import { Button } from '@/components/ui/button';

export interface ToolbarAction {
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
  show?: boolean;
}

interface ChatHeaderProps {
  variant?: 'modal' | 'sidebar' | 'horizontal' | 'minimized';
  title?: string;
  subtitle?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  toolbarActions?: ToolbarAction[];
  showJoinedTime?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  variant = 'modal',
  title = 'How can Amigo help?',
  subtitle,
  avatarSrc = '/lovable-uploads/b12f4efb-0fa0-4019-ba3b-e5cffcf2ef22.png',
  avatarAlt = 'Amigo Virtual Assistant',
  toolbarActions = [],
  showJoinedTime = true
}) => {
  const getHeaderClasses = () => {
    const baseClasses = 'flex items-center justify-between border-b border-blue-100 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 flex-shrink-0';
    
    switch (variant) {
      case 'modal':
        return `${baseClasses} px-6 py-3 rounded-t-2xl`;
      case 'sidebar':
        return `${baseClasses} p-4`;
      case 'horizontal':
        return `${baseClasses} px-4 py-3`;
      case 'minimized':
        return `${baseClasses} px-3 py-2`;
      default:
        return `${baseClasses} px-6 py-3`;
    }
  };

  const getAvatarClasses = () => {
    switch (variant) {
      case 'modal':
        return 'h-10 object-contain';
      case 'sidebar':
        return 'h-8 object-contain';
      case 'horizontal':
        return 'h-8 object-contain';
      case 'minimized':
        return 'h-6 object-contain';
      default:
        return 'h-10 object-contain';
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'text-white hover:text-white hover:bg-white/20 p-0 rounded-full';
    
    switch (variant) {
      case 'modal':
        return `${baseClasses} h-10 w-10`;
      case 'sidebar':
        return `${baseClasses} h-8 w-8`;
      case 'horizontal':
        return `${baseClasses} h-8 w-8`;
      case 'minimized':
        return `${baseClasses} h-6 w-6`;
      default:
        return `${baseClasses} h-10 w-10`;
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'modal':
        return 'w-5 h-5';
      case 'sidebar':
        return 'w-4 h-4';
      case 'horizontal':
        return 'w-4 h-4';
      case 'minimized':
        return 'w-3 h-3';
      default:
        return 'w-5 h-5';
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    if (variant === 'minimized') {
      return (
        <>
          <div className="flex items-center space-x-2">
            <img 
              src={avatarSrc} 
              alt={avatarAlt} 
              className={getAvatarClasses()}
            />
          </div>
          <div className="flex items-center space-x-1">
            {toolbarActions
              .filter(action => action.show !== false)
              .map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className={getButtonClasses()}
                  title={action.title}
                >
                  <div className={getIconSize()}>
                    {action.icon}
                  </div>
                </Button>
              ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center space-x-3">
          <img 
            src={avatarSrc} 
            alt={avatarAlt} 
            className={getAvatarClasses()}
          />
          {variant === 'sidebar' && (
            <div className="text-white">
              <div className="font-medium text-sm">{title}</div>
              {showJoinedTime && (
                <div className="text-xs opacity-90">
                  Amigo Support joined • {getCurrentTime()}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {toolbarActions
            .filter(action => action.show !== false)
            .map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className={getButtonClasses()}
                title={action.title}
              >
                <div className={getIconSize()}>
                  {action.icon}
                </div>
              </Button>
            ))}
        </div>
      </>
    );
  };

  return (
    <div className={getHeaderClasses()}>
      {renderContent()}
    </div>
  );
};

export default ChatHeader;