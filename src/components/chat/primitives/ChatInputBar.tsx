import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputBarProps {
  mode?: 'single' | 'multi';
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  dynamicPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInputBar = ({
  mode = 'single',
  value,
  onChange,
  onSend,
  placeholder = 'Type your message here...',
  dynamicPlaceholder,
  disabled = false,
  className = ''
}: ChatInputBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (mode === 'single') {
      if (e.key === 'Enter' && !disabled) {
        e.preventDefault();
        onSend();
      }
    } else {
      if (e.key === 'Enter' && !e.shiftKey && !disabled) {
        e.preventDefault();
        onSend();
      }
    }
  };

  const effectivePlaceholder = dynamicPlaceholder || placeholder;
  const canSend = value.trim() && !disabled;

  if (mode === 'multi') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex-1 relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={effectivePlaceholder}
            dynamicPlaceholder={dynamicPlaceholder}
            className="w-full bg-white border-0 rounded-lg pl-12 pr-16 py-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent text-sm leading-relaxed min-h-[80px] resize-none"
            onKeyPress={handleKeyPress}
            disabled={disabled}
          />
          <Button
            onClick={onSend}
            size="sm"
            className="absolute right-2 top-5 bg-transparent hover:bg-blue-500 text-blue-600 hover:text-white border-0 h-8 w-8 p-0"
            disabled={!canSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={effectivePlaceholder}
          className="w-full py-4 text-base bg-white border-2 border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-gray-700 placeholder-gray-500 rounded-xl"
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
      </div>
      <Button
        onClick={onSend}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white h-12 w-12 p-0 border-0 rounded-lg flex-shrink-0"
        disabled={!canSend}
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatInputBar;