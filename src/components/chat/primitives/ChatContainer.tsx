import React from 'react';
import { cn } from '@/lib/utils';

export type ChatVariant = 'modal' | 'sidebar' | 'horizontal' | 'minimized';

interface ChatContainerProps {
  variant: ChatVariant;
  children: React.ReactNode;
  className?: string;
}

interface ChatContainerSlots {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

interface ChatContainerWithSlotsProps extends Omit<ChatContainerProps, 'children'> {
  slots: ChatContainerSlots;
}

const getVariantClasses = (variant: ChatVariant): string => {
  switch (variant) {
    case 'modal':
      return 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
    case 'sidebar':
      return 'fixed right-0 top-0 bottom-0 w-96 shadow-2xl z-50 animate-slide-in-right border-l border-gray-200 flex flex-col';
    case 'horizontal':
      return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in';
    case 'minimized':
      return 'fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 animate-scale-in border border-gray-200';
    default:
      return '';
  }
};

const getInnerContainerClasses = (variant: ChatVariant): string => {
  switch (variant) {
    case 'modal':
      return 'bg-transparent rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden';
    case 'sidebar':
      return 'flex flex-col h-full';
    case 'horizontal':
      return 'bg-blue-600 rounded-lg shadow-xl min-w-[800px] max-w-6xl';
    case 'minimized':
      return 'flex flex-col h-full';
    default:
      return 'flex flex-col h-full';
  }
};

const getHeaderClasses = (variant: ChatVariant): string => {
  switch (variant) {
    case 'modal':
      return 'px-6 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 flex-shrink-0 rounded-t-2xl';
    case 'sidebar':
      return 'flex items-center justify-between p-4 border-b border-blue-100 flex-shrink-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600';
    case 'horizontal':
      return 'flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-t-lg';
    case 'minimized':
      return 'flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-lg';
    default:
      return 'flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0';
  }
};

const getBodyClasses = (variant: ChatVariant): string => {
  switch (variant) {
    case 'modal':
      return 'flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-[500px] bg-gradient-to-b from-blue-50 via-blue-25 to-white';
    case 'sidebar':
      return 'flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gradient-to-b from-blue-50 to-white';
    case 'horizontal':
      return 'px-6 pb-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600';
    case 'minimized':
      return 'p-3 max-h-60 overflow-y-auto bg-gray-50';
    default:
      return 'flex-1 overflow-y-auto p-4 space-y-4';
  }
};

const getFooterClasses = (variant: ChatVariant): string => {
  switch (variant) {
    case 'modal':
      return 'px-8 py-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 via-blue-25 to-white flex-shrink-0 rounded-b-2xl';
    case 'sidebar':
      return 'p-4 border-t border-blue-100 flex-shrink-0 bg-gradient-to-r from-blue-100 via-blue-50 to-white';
    case 'horizontal':
      return 'px-6 pb-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600';
    case 'minimized':
      return 'p-3 border-t border-gray-200';
    default:
      return 'p-4 border-t border-gray-200 flex-shrink-0';
  }
};

// Basic container wrapper
export const ChatContainer: React.FC<ChatContainerProps> = ({
  variant,
  children,
  className
}) => {
  const containerClasses = getVariantClasses(variant);
  const innerClasses = getInnerContainerClasses(variant);

  return (
    <div className={cn(containerClasses, className)}>
      <div className={innerClasses}>
        {children}
      </div>
    </div>
  );
};

// Container with structured slots
export const ChatContainerWithSlots: React.FC<ChatContainerWithSlotsProps> = ({
  variant,
  slots,
  className
}) => {
  const containerClasses = getVariantClasses(variant);
  const innerClasses = getInnerContainerClasses(variant);
  const headerClasses = getHeaderClasses(variant);
  const bodyClasses = getBodyClasses(variant);
  const footerClasses = getFooterClasses(variant);

  return (
    <div className={cn(containerClasses, className)}>
      <div className={innerClasses}>
        {slots.header && (
          <div className={headerClasses}>
            {slots.header}
          </div>
        )}
        
        {slots.body && (
          <div className={bodyClasses}>
            {slots.body}
          </div>
        )}
        
        {slots.footer && (
          <div className={footerClasses}>
            {slots.footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Export both as named exports and default export for the main container
export default ChatContainer;