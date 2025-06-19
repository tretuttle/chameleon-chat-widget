import { ConversationFlow } from './conversationFlow';

// This flow is based on "End Conversation for Chatbot - DONE.docx"
export const endConversationFlow: ConversationFlow = {
  end_conversation: {
    id: 'end_conversation',
    botMessage: [ "Did I solve your issue today?" ], //
    userOptions: [
      { text: "Yes", nextStep: "glad_to_help_anything_else" }, //
      { text: "No", nextStep: "sorry_talk_to_agent" } //
    ]
  },

  glad_to_help_anything_else: {
    id: 'glad_to_help_anything_else',
    botMessage: [ "Glad I could help! Are there other service needs you need help you with today?" ], //
    userOptions: [
      { text: "Yes", nextStep: "contact_agent" }, //
      { text: "No", nextStep: "thank_you_goodbye" } //
    ]
  },

  sorry_talk_to_agent: {
    id: 'sorry_talk_to_agent',
    botMessage: [ "Sorry I couldn’t help. Looks like you need to talk to a factory service agent." ], //
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" } //
    ]
  },

  thank_you_goodbye: {
    id: 'thank_you_goodbye',
    botMessage: [ "Thank you for choosing Amigo for your mobility needs. Have a great day!" ], //
    userOptions: [],
    isEndStep: true //
  }
};