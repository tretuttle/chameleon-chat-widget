
export interface ConversationStep {
  botMessage: string | string[];
  userOptions?: {
    text: string;
    nextStep: string;
  }[];
}

export const maxCRFlow: { [key: string]: ConversationStep } = {
  greeting: {
    botMessage: [
      "Hello! I'm Amigo Mobility's virtual assistant, and I'm here to help you troubleshoot your Max CR.",
      "What seems to be the issue you're experiencing?"
    ],
    userOptions: [
      {
        text: "My Max CR turns on, but the charger will not turn on or the batteries do not hold a charge.",
        nextStep: "Step_For_Max_CR_battery_troubleshooting"
      },
      {
        text: "My Max CR will not move",
        nextStep: "Step_For_Max_CR_wont_move"
      },
      {
        text: "My Max CR remote won't pair",
        nextStep: "Step_For_Max_CR_remote_pairing"
      },
      {
        text: "I have a different customer service need.",
        nextStep: "contact_agent"
      }
    ]
  },

  Step_For_Max_CR_battery_troubleshooting: {
    botMessage: "First, connect the AC cord to the wall outlet. Does the battery display on the throttle enclosure flash for 10-30 seconds before going solid?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "Measure_battery_voltage"
      },
      {
        text: "No",
        nextStep: "AC_cord_illumination"
      }
    ]
  },

  Measure_battery_voltage: {
    botMessage: "Disconnect the AC cord from the wall outlet and measure and record the voltage on the battery. Then connect the AC cord into the wall outlet and let the batteries charge for two minutes. After they have charged, measure the battery voltage. Has it increased to a minimum of 25 volts?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "Replace_battery"
      },
      {
        text: "No",
        nextStep: "Replace_battery_charger"
      }
    ]
  },

  Replace_battery_charger: {
    botMessage: [
      "The battery charger is not outputting the proper DC voltage, and it will need to be replaced. Replace the battery charger with P/N 12499.22-Charger for AGM or P/N 12499.23-Charger for Lithium.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  Replace_battery: {
    botMessage: [
      "The charger is operating properly. The battery/batteries have reached a state where they can no longer hold a charge and should be replaced.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  AC_cord_illumination: {
    botMessage: "Does the AC cord end illuminate?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "charger_troubleshooting"
      },
      {
        text: "No",
        nextStep: "wall_outlet"
      }
    ]
  },

  wall_outlet: {
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working, replace the AC cord.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  charger_troubleshooting: {
    botMessage: [
      "This indicates the charger is not turning on. Use the following steps to determine why it will not turn on.",
      "Check the 13084-IEC Receptacle for continuity."
    ],
    userOptions: [
      {
        text: "Yes continuity",
        nextStep: "measure_battery_voltage"
      },
      {
        text: "No continuity",
        nextStep: "replace_receptacle"
      }
    ]
  },

  replace_receptacle: {
    botMessage: [
      "You need to replace the 13084-IEC Receptacle.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  measure_battery_voltage: {
    botMessage: "If you have AGM batteries, measure the voltage on both batteries in the series; they must have a minimum combined voltage of 16-volts. If you have a single lithium battery, it must have a minimum voltage of 21-volts.",
    userOptions: [
      {
        text: "Batteries under voltage",
        nextStep: "replace_fuse"
      },
      {
        text: "Batteries have minimum required voltage",
        nextStep: "remove_fuse_check_continuity"
      }
    ]
  },

  replace_fuse: {
    botMessage: [
      "Replace the fuse with a 25A 250V replacement.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  remove_fuse_check_continuity: {
    botMessage: "Remove the fuse and check continuity.",
    userOptions: [
      {
        text: "Yes continuity",
        nextStep: "Replace_battery_charger"
      },
      {
        text: "No continuity",
        nextStep: "replace_fuse"
      }
    ]
  },

  Step_For_Max_CR_wont_move: {
    botMessage: [
      "First, turn the Max CR key on.",
      "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the key is turned on?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "battery_display"
      },
      {
        text: "No",
        nextStep: "test_battery_voltage"
      }
    ]
  },

  battery_display: {
    botMessage: "Is the battery display flashing rapidly?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "belly_switch"
      },
      {
        text: "No",
        nextStep: "numeral_2"
      }
    ]
  },

  belly_switch: {
    botMessage: [
      "Is the belly switch pushed in? Rotate the switch clockwise a quarter turn to release it. If this does not resolve the problem, check to make sure the 13147.20-Belly Switch asm is connected to the 13059-Breakout PCB.",
      "Did either of these two procedures clear the rapid flashing?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "problem_resolved"
      },
      {
        text: "No",
        nextStep: "disconnect_belly_switch"
      }
    ]
  },

  problem_resolved: {
    botMessage: "Your problem has been resolved.",
    userOptions: [
      {
        text: "Thank you",
        nextStep: "end_conversation"
      }
    ]
  },

  disconnect_belly_switch: {
    botMessage: [
      "Disconnect the 13147.20-Belly Switch asm from the 13059-Breakout PCB. Using a wire jumper, jumper across the two pins where you just disconnected the Belly Switch asm.",
      "Did this clear the rapid flashing?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "replace_belly_switch"
      },
      {
        text: "No",
        nextStep: "replace_PCB"
      }
    ]
  },

  replace_belly_switch: {
    botMessage: [
      "Replace the 13147.20-Belly Switch Asm.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_PCB: {
    botMessage: [
      "Replace the 13059-Breakout PCB.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  numeral_2: {
    botMessage: "Is the numeral \"2\" illuminated in the diagnostic window?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "brake_circuit"
      },
      {
        text: "No",
        nextStep: "diagnostic_code_guide"
      }
    ]
  },

  brake_circuit: {
    botMessage: [
      "This indicates the brake circuit is open. Turn the key off, check to make sure the freewheel lever in front of the Max CR is in the Normal position, and turn the key back on.",
      "If the \"2\" code is still illuminated, check the continuity on the brake wiring. If the wires are good, replace the 13077-Brake Wire Harness.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  test_battery_voltage: {
    botMessage: "Remove the top to the power box and test the battery voltage at the controller. Is the battery voltage greater than 21 volts?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "wiring_connections"
      },
      {
        text: "No",
        nextStep: "recharge_batteries"
      }
    ]
  },

  recharge_batteries: {
    botMessage: [
      "Recharge the battery/batteries, allowing them to go through a completed charge cycle.",
      "If the cart still has no power, you will need to replace the 12402-Battery (Lithium) or 12947-Batteries (AGM Type).",
      "Is there continuity?"
    ],
    userOptions: [
      {
        text: "Yes continuity",
        nextStep: "measure_voltage"
      },
      {
        text: "No power",
        nextStep: "replace_battery"
      }
    ]
  },

  measure_voltage: {
    botMessage: "If you have AGM batteries, measure the voltage on both batteries in series; they must have a minimum combined voltage of 16 volts. If you have a single lithium battery it must have a minimum voltage of 21 volts.",
    userOptions: [
      {
        text: "Batteries under voltage",
        nextStep: "replace_batteries"
      },
      {
        text: "Batteries have minimum required voltage",
        nextStep: "check_LEDs"
      }
    ]
  },

  replace_batteries: {
    botMessage: [
      "You need to replace the batteries.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  check_LEDs: {
    botMessage: "Check the LEDs on the battery charger. They should be either solid red, red & yellow flashing, or green. If they are, the charger is working.",
    userOptions: [
      {
        text: "LEDs illuminate",
        nextStep: "charge_batteries_replace_if_needed"
      },
      {
        text: "No LEDs illuminate on the battery charger or just the red LED is flashing",
        nextStep: "remove_fuse_check_continuity"
      }
    ]
  },

  charge_batteries_replace_if_needed: {
    botMessage: "Allow the batteries to fully charge. If they do not have enough capacity to run the cart for 8 hours, replace the batteries.",
    userOptions: [
      {
        text: "Thank you",
        nextStep: "end_conversation"
      }
    ]
  },

  wiring_connections: {
    botMessage: [
      "Check to ensure all wiring connections from the handle enclosure, breakout board, and controller are securely connected. Measure the battery voltage at the controller. It should match the battery voltage measured at the battery/batteries.",
      "Are wires secure and battery at the controller? Does voltage at the battery/batteries match the voltage at the battery?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "substitute_parts"
      },
      {
        text: "No",
        nextStep: "check_circuit_breaker_continuity"
      }
    ]
  },

  substitute_parts: {
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:",
      "1. 8969-Handle cable.",
      "2. 8223.25-Throttle Asm.",
      "3. 12933CR-Controller.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  check_circuit_breaker_continuity: {
    botMessage: "Check to make sure there is continuity through the 12661-Circuit Breaker. Is there continuity?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "replace_harness_battery_harness"
      },
      {
        text: "No",
        nextStep: "replace_circuit_breaker"
      }
    ]
  },

  replace_harness_battery_harness: {
    botMessage: [
      "Replace the 11190-Harness (2 pieces) and the 13093-Battery Harness.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_circuit_breaker: {
    botMessage: [
      "Replace the 12661-Circuit Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  Step_For_Max_CR_remote_pairing: {
    botMessage: [
      "Attempt the pairing process. Turn the Max CR and the remote on. Press the \"STOP\" button on the remote for 10 seconds. The power button on the remote will flash blue. Press and hold the pairing button on the Max CR until the horn sounds.",
      "Does the Max CR now respond to the remote?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "try_3_steps"
      },
      {
        text: "No",
        nextStep: "press_power_button"
      }
    ]
  },

  try_3_steps: {
    botMessage: [
      "If the remote only loses connection with the Max CR intermittently there are 3 steps to try:",
      "1. Attempt to pair the remote in the exact location where the connection is lost. The remote is designed to search for the clearest communication channel if there is interference from other devices.",
      "2. If the remote works well when you are close to the Max CR but consistently loses connectivity if you get to the end of the line of carts, replace the 13147.20-Antenna.",
      "3. If the Max CR will not respond when only pushing specific buttons on the remote, the membrane on the remote does not contact properly and needs to be replaced."
    ],
    userOptions: [
      {
        text: "I need to replace the antenna and need to order parts",
        nextStep: "Order_parts"
      },
      {
        text: "I need to replace the remote membrane and need to order parts",
        nextStep: "Order_parts"
      },
      {
        text: "I need to replace a part, but I don't need to order anything",
        nextStep: "end_conversation"
      },
      {
        text: "None of these options",
        nextStep: "contact_agent"
      }
    ]
  },

  press_power_button: {
    botMessage: "OK. Press the power button on the remote. Does it illuminate green?",
    userOptions: [
      {
        text: "No",
        nextStep: "replace_AA_batteries"
      },
      {
        text: "Yes",
        nextStep: "inspect_wiring"
      }
    ]
  },

  inspect_wiring: {
    botMessage: "Inspect all the wiring running between the receiver board and the breakout board. If the wiring is good, first replace the 12344-receiver board, if that doesn't resolve the problem replace the 13059-breakout board.",
    userOptions: [
      {
        text: "I need to order parts",
        nextStep: "Order_parts"
      }
    ]
  },

  replace_AA_batteries: {
    botMessage: [
      "Replace the batteries in the remote with four new lithium AA batteries or recharge the batteries if you have a remote with the rechargeable option.",
      "Press the remote power button, does it illuminate green?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Step_For_Max_CR_remote_pairing"
      },
      {
        text: "No",
        nextStep: "replace_remote"
      }
    ]
  },

  replace_remote: {
    botMessage: [
      "You need to replace the remote.",
      "Do you want to order a new one?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "Order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  diagnostic_code_guide: {
    botMessage: "Please refer to the diagnostic code guide in your manual or contact our support team for assistance with other diagnostic codes.",
    userOptions: [
      { text: "Contact support", nextStep: "contact_agent" }
    ]
  },

  Order_parts: {
    botMessage: [
      "You can order parts by calling 1-800-692-6446 or visiting our website.",
      "Is there anything else I can help you with?"
    ],
    userOptions: [
      { text: "Contact agent", nextStep: "contact_agent" },
      { text: "End conversation", nextStep: "end_conversation" }
    ]
  },

  contact_agent: {
    botMessage: [
      "I'd be happy to connect you with one of our factory service agents who can provide personalized assistance.",
      "Would you prefer to receive a phone call or an email?"
    ],
    userOptions: [
      { text: "Phone call", nextStep: "phone_call" },
      { text: "Email", nextStep: "send_email" }
    ]
  },

  phone_call: {
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
    botMessage: "Great! Please provide your name and phone number, and one of our service agents will contact you within the next business day.",
    userOptions: [
      { text: "Submit contact information", nextStep: "contact_info_received" }
    ]
  },

  contact_info_received: {
    botMessage: [
      "Thank you! We've received your information and one of our service agents will be in touch within the next business day to help with your Amigo cart.",
      "Thank you for choosing Amigo for your mobility needs!"
    ],
    userOptions: []
  },

  call_phone_number: {
    botMessage: "Excellent! Please call 1-800-248-9131 Monday through Friday between 7:30 a.m. and 5:30 p.m. EST, and one of our knowledgeable agents will be happy to assist you with your Amigo cart.",
    userOptions: []
  },

  send_email: {
    botMessage: [
      "That works perfectly! Please email service@myamigo.com with your name, company, phone number, and a brief description of what you need help with. One of our service agent will respond within the next business day.",
      "Thank you for choosing Amigo for your mobility needs!"
    ],
    userOptions: []
  },

  end_conversation: {
    botMessage: "Thank you for using Amigo Assistant. Have a great day!",
    userOptions: []
  }
};
