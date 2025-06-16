
import { ConversationFlow } from './conversationFlow';

export const endConversationFlow: ConversationFlow = {
  end_conversation: {
    id: 'end_conversation',
    botMessage: "Were we able to resolve your issue today?",
    userOptions: [
      { text: "Yes", nextStep: "glad_to_help_anything_else" },
      { text: "No", nextStep: "sorry_talk_to_agent" }
    ]
  },

  glad_to_help_anything_else: {
    id: 'glad_to_help_anything_else',
    botMessage: "Wonderful! I'm so glad we could help you with your Amigo cart. Is there anything else I can assist you with today?",
    userOptions: [
      { text: "Yes", nextStep: "contact_agent" },
      { text: "No", nextStep: "thank_you_goodbye" }
    ]
  },

  sorry_talk_to_agent: {
    id: 'sorry_talk_to_agent',
    botMessage: "I'm sorry I wasn't able to fully resolve your issue.",
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" }
    ]
  },

  thank_you_goodbye: {
    id: 'thank_you_goodbye',
    botMessage: "It's been my pleasure helping you today! Thank you for choosing Amigo for your mobility needs. Have a wonderful day!",
    userOptions: [],
    isEndStep: true
  }
};
