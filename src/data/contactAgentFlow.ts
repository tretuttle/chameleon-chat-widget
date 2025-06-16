
import { ConversationFlow } from './conversationFlow';

export const contactAgentFlow: ConversationFlow = {
  greeting: {
    id: 'greeting',
    botMessage: [
      "I'd be happy to help you with your customer service need! To provide you with the best assistance, I can connect you with one of our service agents."
    ],
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" }
    ]
  },

  contact_agent: {
    id: 'contact_agent',
    botMessage: [
      "Would you prefer to receive a phone call or an email?"
    ],
    userOptions: [
      { text: "Phone call", nextStep: "phone_call" },
      { text: "Email", nextStep: "send_email" }
    ]
  },

  phone_call: {
    id: 'phone_call',
    botMessage: [
      "Perfect! Our friendly Amigo service agents are available by phone Monday through Friday from 7:30 a.m. to 5:30 p.m. EST and can contact you within the next business day.",
      "Is this convenient for you, or would you prefer to call customer support directly?"
    ],
    userOptions: [
      { text: "Please call me", nextStep: "enter_contact_info" },
      { text: "I will call", nextStep: "call_phone_number" }
    ]
  },

  enter_contact_info: {
    id: 'enter_contact_info',
    botMessage: "Great! Please provide your phone number, and one of our service agents will contact you within the next business day.",
    expectsTextInput: {
      enabled: true,
      type: 'phone',
      placeholder: 'Enter phone number (e.g., 555-123-4567)',
      validation: {
        pattern: /^[\+]?[1-9][\d\s\-\(\)]{9,15}$/,
        errorMessage: 'Please enter a valid phone number'
      },
      nextStep: 'contact_info_received'
    }
  },

  contact_info_received: {
    id: 'contact_info_received',
    botMessage: [
      "Perfect! We've received your phone number and one of our wonderful service agents will be in touch within the next business day to help with your Amigo cart.",
      "It's been my pleasure helping you get connected with our team. They'll take excellent care of you!",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ],
    isEndStep: true
  },

  call_phone_number: {
    id: 'call_phone_number',
    botMessage: [
      "Excellent! Please call 1-800-248-9131 Monday through Friday between 7:30 a.m. and 5:30 p.m. EST, and one of our knowledgeable agents will be happy to assist you with your Amigo cart.",
      "It's been my pleasure helping you today. Our team is looking forward to speaking with you!",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ],
    isEndStep: true
  },

  send_email: {
    id: 'send_email',
    botMessage: "That works perfectly! Please provide your email address so we can respond to you directly.",
    expectsTextInput: {
      enabled: true,
      type: 'email',
      placeholder: 'Enter email address',
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Please enter a valid email address'
      },
      nextStep: 'email_received'
    }
  },

  email_received: {
    id: 'email_received',
    botMessage: [
      "Thank you! We've received your email address. Please also send us an email at service@myamigo.com with your name, company, phone number, and a brief description of what you need help with. One of our service agents will respond within the next business day.",
      "It's been my pleasure helping you get connected with our team. They'll provide you with excellent personalized assistance!",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ],
    isEndStep: true
  }
};
