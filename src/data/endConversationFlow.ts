import type { ConversationFlow } from '@/types';
// This flow is based on "End Conversation for Chatbot - DONE.docx"
export const endConversationFlow: ConversationFlow = {
  end_conversation: {
    id: 'end_conversation',
    botMessage: ["Did I solve your issue today?"],
    userOptions: [
      { text: "Yes", nextStep: "glad_to_help_info" },
      { text: "No", nextStep: "sorry_talk_to_agent" }
    ]
  },

  glad_to_help_info: {
    id: 'glad_to_help_info',
    botMessage: ["Glad I could help!"],
    userOptions: [
      { text: "Continue", nextStep: "anything_else_question" }
    ]
  },

  anything_else_question: {
    id: 'anything_else_question',
    botMessage: ["Are there other service needs you need help with today?"],
    userOptions: [
      { text: "Yes", nextStep: "contact_agent" },
      { text: "No", nextStep: "thank_you_goodbye" }
    ]
  },

  sorry_talk_to_agent: {
    id: 'sorry_talk_to_agent',
    botMessage: ["Sorry I couldn't help. Looks like you need to talk to a factory service agent."],
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" }
    ]
  },

  thank_you_goodbye: {
    id: 'thank_you_goodbye',
    botMessage: ["Thank you for choosing Amigo for your mobility needs. Have a great day!"],
    userOptions: [],
    isEndStep: true
  }
};