export interface ConversationStep {
    id: string;
    botMessage: string | string[];
    userOptions: Array<{
        text: string;
        nextStep: string;
    }>;
    isEndStep?: boolean;
    allowTextInput?: boolean;
    decorateWithEmpathy?: boolean;
}

export interface ConversationFlow {
    [stepId: string]: ConversationStep;
}

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}
