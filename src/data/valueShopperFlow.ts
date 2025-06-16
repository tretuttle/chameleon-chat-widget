
export interface ConversationStep {
  botMessage: string | string[];
  userOptions: {
    text: string;
    nextStep: string;
  }[];
}

export const valueShopperFlow: Record<string, ConversationStep> = {
  greeting: {
    botMessage: [
      "Hello! I'm Amigo Mobility's virtual assistant, and I'm here to help you troubleshoot your ValueShopper.",
      "What seems to be the issue you're experiencing?"
    ],
    userOptions: [
      {
        text: "My ValueShopper turns on, but the charger will not turn on or the batteries do not hold a charge",
        nextStep: "Step_For_VS_battery_troubleshooting"
      },
      {
        text: "My ValueShopper will not move",
        nextStep: "Step_For_VS_wont_move"
      },
      {
        text: "I have a different customer service need.",
        nextStep: "contact_agent"
      }
    ]
  },

  Step_For_VS_battery_troubleshooting: {
    botMessage: [
      "Connect the AC cord to the wall outlet.",
      "For the throttle enclosure LED battery gage: does the battery gage on the throttle enclosure flash for 10-30 seconds before going solid?",
      "For the throttle enclosure LCD display: does the display show a green rectangle at the bottom with the text 'CHARGING'?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "measure_record_battery_voltage"
      },
      {
        text: "No",
        nextStep: "AC_cord_illuminate"
      }
    ]
  },

  measure_record_battery_voltage: {
    botMessage: [
      "With the AC cord disconnected from the wall outlet, measure and record the voltage on the batteries. Now connect the AC cord into the wall outlet and let the batteries charge for two minutes.",
      "Now measure the battery voltage, has it increased to a minimum of 25 volts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "replace_batteries_vs1"
      },
      {
        text: "No",
        nextStep: "replace_battery_charger_vs1"
      }
    ]
  },

  replace_batteries_vs1: {
    botMessage: [
      "The charger is operating properly, but the battery/batteries have reached a state where they can no longer hold a charge and should be replaced.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_battery_charger_vs1: {
    botMessage: [
      "The battery charger is not outputting the proper DC voltage, so you need to replace the battery charger.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  AC_cord_illuminate: {
    botMessage: "Does the AC cord end illuminate?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "charger_not_turning_on"
      },
      {
        text: "No",
        nextStep: "wall_outlet_AC_replacement"
      }
    ]
  },

  wall_outlet_AC_replacement: {
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working replace the AC cord.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  charger_not_turning_on: {
    botMessage: [
      "This indicates the charger is not turning on. Let's determine why it will not turn on.",
      "Check the 11024-IEC Receptacle for continuity."
    ],
    userOptions: [
      {
        text: "No continuity",
        nextStep: "replace_11024_receptacle"
      },
      {
        text: "Yes continuity",
        nextStep: "measure_the_voltage"
      }
    ]
  },

  replace_11024_receptacle: {
    botMessage: [
      "Replace the 11024-Receptacle.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  measure_the_voltage: {
    botMessage: [
      "If you have AGM batteries, measure the voltage on both batteries in series. They must have a minimum combined voltage of 16 volts. If you have a single lithium battery, it must have a minimum voltage of 21 volts."
    ],
    userOptions: [
      {
        text: "Batteries under voltage",
        nextStep: "replace_batteries_vs2"
      },
      {
        text: "Batteries have minimum required voltage",
        nextStep: "check_circuit_breaker"
      }
    ]
  },

  replace_batteries_vs2: {
    botMessage: [
      "Replace the battery/batteries.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  check_circuit_breaker: {
    botMessage: "Check the continuity of circuit breaker.",
    userOptions: [
      {
        text: "Yes continuity",
        nextStep: "DC_wiring_connections"
      },
      {
        text: "No continuity",
        nextStep: "replace_circuit_breaker"
      }
    ]
  },

  replace_circuit_breaker: {
    botMessage: [
      "Replace the 12038-Circuit Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  DC_wiring_connections: {
    botMessage: "Check to make sure the DC wiring connections from the charger are securely connected to the controller.",
    userOptions: [
      {
        text: "The DC wiring harness is bad",
        nextStep: "replace_harness"
      },
      {
        text: "The DC wiring is good",
        nextStep: "replace_battery_charger_vs2"
      }
    ]
  },

  replace_harness: {
    botMessage: [
      "Replace the 7852.10-DC Cable Harness if the battery charger has a removable DC cable. If the DC cable is hard-wired into the charger, you must replace the battery charger.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_battery_charger_vs2: {
    botMessage: [
      "The battery charger needs to be replaced.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  Step_For_VS_wont_move: {
    botMessage: "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the ValueShopper is turned on?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "numeral_diagnostic_window"
      },
      {
        text: "No",
        nextStep: "test_battery_voltage"
      }
    ]
  },

  numeral_diagnostic_window: {
    botMessage: "Is there a numeral illuminated in the diagnostic window?",
    userOptions: [
      {
        text: "Yes",
        nextStep: "diagnose_code_guide"
      },
      {
        text: "No",
        nextStep: "sit_on_VS_seat"
      }
    ]
  },

  diagnose_code_guide: {
    botMessage: [
      "This indicates the motor controller has detected a diagnostic issue. Use the Amigo Diagnostic Code Guide to review the next steps to take to replace the component causing the diagnostic code.",
      "Our customer service team can help you interpret the diagnostic codes and guide you through the repair process.",
      "Would you like me to connect you with our support team?"
    ],
    userOptions: [
      { text: "Yes, connect me with support", nextStep: "contact_agent" },
      { text: "I'll handle this myself", nextStep: "end_conversation" }
    ]
  },

  sit_on_VS_seat: {
    botMessage: [
      "There must be a rider activating the safety switch in the seat. Sit in the seat and make sure the switch has been depressed. Does the ValueShopper now move?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "problem_resolved"
      },
      {
        text: "No",
        nextStep: "disconnect_seat_switch_wires"
      }
    ]
  },

  problem_resolved: {
    botMessage: [
      "Wonderful! I'm so glad we could get your ValueShopper working properly again.",
      "It's been my pleasure helping you troubleshoot this issue today.",
      "Remember, I'm always here whenever you need assistance with your Amigo.",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ]
  },

  disconnect_seat_switch_wires: {
    botMessage: [
      "Disconnect the seat switch wires from the seat switch. Jumper across the two-seat switch wires you just disconnected to complete the circuit. Does the ValueShopper move now when the throttle lever is operated?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "replace_seat_switch"
      },
      {
        text: "No",
        nextStep: "replace_wire_harness_vs"
      }
    ]
  },

  replace_seat_switch: {
    botMessage: [
      "You need to replace the seat switch.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_wire_harness_vs: {
    botMessage: [
      "You need to replace the 10947-18 Pin Wire Harness.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  test_battery_voltage: {
    botMessage: [
      "Remove the seat assembly and rear cover. Test the battery voltage at the controller. Is the battery voltage greater than 21 volts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "check_wiring_connections"
      },
      {
        text: "No",
        nextStep: "recharge_battery_or_replace"
      }
    ]
  },

  recharge_battery_or_replace: {
    botMessage: [
      "Recharge the battery/batteries and allow them to go through a completed charge cycle. If the cart still has no power replace the 12168.20-Battery (Lithium) or 8967-Batteries (AGM Type)."
    ],
    userOptions: [
      {
        text: "I need to order new batteries.",
        nextStep: "order_parts"
      }
    ]
  },

  check_wiring_connections: {
    botMessage: [
      "Check to ensure all wiring connections from the handle enclosure and controller are securely connected. Measure the battery voltage at the controller; it should match the battery voltage measured at the battery/batteries.",
      "Are the wires secure and battery at the controller? Does the voltage at the controller battery/batteries match the voltage at the battery/batteries?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "check_label_motor_controller"
      },
      {
        text: "No",
        nextStep: "check_continuity_thru_breaker"
      }
    ]
  },

  check_continuity_thru_breaker: {
    botMessage: [
      "Check to make sure there is continuity through the 12038-Circuit Breaker. Is there continuity?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "replace_battery_wire"
      },
      {
        text: "No",
        nextStep: "replace_circuit_breaker_vs2"
      }
    ]
  },

  replace_circuit_breaker_vs2: {
    botMessage: [
      "Replace the 12038-Circuit Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_battery_wire: {
    botMessage: [
      "Replace the Battery wire asms with a 9853-Battery Wire Disconnect kit.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  check_label_motor_controller: {
    botMessage: [
      "Check the part number label on the motor controller. Does it match the type of handle the cart has (LED or LCD)?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "substitute_parts"
      },
      {
        text: "No",
        nextStep: "replace_motor_controller"
      }
    ]
  },

  substitute_parts: {
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:",
      "1. Handle cable",
      "2. Throttle assembly",
      "3. Controller",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  replace_motor_controller: {
    botMessage: [
      "Replace the motor controller with the correct version.",
      "Do you need to order parts?"
    ],
    userOptions: [
      {
        text: "Yes",
        nextStep: "order_parts"
      },
      {
        text: "No",
        nextStep: "end_conversation"
      }
    ]
  },

  // Shared steps
  order_parts: {
    botMessage: [
      "I'm happy to help you get the parts you need! You can order through several convenient methods:",
      "• Call our friendly parts department at 1-800-692-6446",
      "• Email parts@amigomobility.com",
      "• Visit our website at amigomobility.com/parts",
      "Please have your ValueShopper model number and serial number ready when ordering.",
      "It's been my pleasure helping you today. Thank you for choosing Amigo!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ]
  },

  contact_agent: {
    botMessage: [
      "I'm happy to connect you with our wonderful customer service team who can provide personalized assistance.",
      "Please call us at 1-800-692-6446 or email support@amigomobility.com",
      "Our team is available Monday-Friday, 8AM-5PM EST, and they'll take excellent care of you!",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ]
  },

  end_conversation: {
    botMessage: [
      "Wonderful! I'm so glad we could work through this together and get your ValueShopper running smoothly again.",
      "It's been my pleasure helping you today. Remember, I'm always here whenever you need assistance with your Amigo.",
      "If you need further help, our support team at 1-800-692-6446 is always ready to assist you.",
      "Thank you for choosing Amigo for your mobility needs. Have a wonderful day!"
    ],
    userOptions: [
      { text: "Start a new conversation", nextStep: "greeting" }
    ]
  }
};
