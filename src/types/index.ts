export interface ConversationStep {
    id: string;
    botMessage: string | string[];
    userOptions: Array<{
        text: string;
        nextStep: string;
    }>;
    isEndStep?: boolean;
    allowTextInput?: boolean;
}

export interface ConversationFlow {
    [stepId: string]: ConversationStep;
}