import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatOptionButtonsProps {
  options: Array<{
    text: string;
    nextStep: string;
  }>;
  disabled?: boolean;
  onSelect: (choice: string, nextStep: string) => void;
}

const ChatOptionButtons = ({ options, disabled = false, onSelect }: ChatOptionButtonsProps) => {
  const handleButtonClick = (option: { text: string; nextStep: string }) => {
    if (!disabled) {
      onSelect(option.text, option.nextStep);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => handleButtonClick(option)}
          disabled={disabled}
          className="w-full justify-start text-left h-auto p-4 bg-blue-600 hover:bg-blue-700 text-white border-0 whitespace-normal break-words shadow-md rounded-xl font-medium"
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
};

export default ChatOptionButtons;