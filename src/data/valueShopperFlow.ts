import type { ConversationFlow } from '@/types';
// This flow is based on "ValueShopper TSG for Chatbot - DONE.docx"
export const valueShopperFlow: ConversationFlow = {
  // Entry point from general flow when ValueShopper is selected
  start_valueshopper_flow: {
    id: 'start_valueshopper_flow',
    botMessage: [
      "I'll help you troubleshoot your ValueShopper cart.",
      "What seems to be the issue with your ValueShopper?"
    ],
    decorateWithEmpathy: true,
    userOptions: [
      { text: "My ValueShopper turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_vs_battery_troubleshooting" },
      { text: "My ValueShopper will not move", nextStep: "step_for_vs_wont_move" },
      { text: "I have a different customer service need.", nextStep: "contact_agent" }
    ]
  },

  greeting: {
    id: 'greeting',
    botMessage: [
      "Hello, this is the bot.",
      "What seems to be the issue?"
    ],
    userOptions: [
      { text: "My ValueShopper turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_vs_batt_led_gauge" },
      { text: "My ValueShopper will not move", nextStep: "step_for_vs_wont_move" },
      { text: "I have a different customer service need.", nextStep: "contact_agent" }
    ]
  },

  step_vs_batt_led_gauge: {
    id: 'step_vs_batt_led_gauge',
    botMessage: [
      "Connect the AC cord to the wall outlet.",
      "For the throttle enclosure LED battery gage: does the battery gage on the throttle enclosure flash for 10-30 seconds before going solid?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "step_vs_batt_lcd_display" },
      { text: "No", nextStep: "step_vs_batt_lcd_display" }
    ]
  },

  step_vs_batt_lcd_display: {
    id: 'step_vs_batt_lcd_display',
    botMessage: [
      "For the throttle enclosure LCD display: does the display show a green rectangle at the bottom with the text \"CHARGING\"?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "measure_record_battery_voltage" },
      { text: "No", nextStep: "ac_cord_illuminate" }
    ]
  },

  measure_record_battery_voltage: {
    id: 'measure_record_battery_voltage',
    botMessage: [
      "With the AC cord disconnected from the wall outlet, measure and record the voltage on the batteries. Now connect the AC cord into the wall outlet and let the batteries charge for two minutes.",
      "Now measure the battery voltage, has it increased to a minimum of 25 volts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_batteries_1" }, // Renamed to avoid conflict
      { text: "No", nextStep: "replace_battery_charger_1" } // Renamed to avoid conflict
    ]
  },
  
  replace_batteries_1: {
    id: 'replace_batteries_1',
    botMessage: [
      "The charger is operating properly, but the battery/batteries have reached a state where they can no longer hold a charge and should be replaced.",
      "Do you need to order parts?"
    ],
    userOptions: [
        { text: "Yes", nextStep: "order_parts" },
        { text: "No", nextStep: "end_conversation" }
    ]
  },
  
  replace_battery_charger_1: {
    id: 'replace_battery_charger_1',
    botMessage: [
      "The battery charger is not outputting the proper DC voltage, so you need to replace the battery charger.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  ac_cord_illuminate: {
    id: 'ac_cord_illuminate',
    botMessage: [ "Does the AC cord end illuminate?" ],
    userOptions: [
      { text: "Yes", nextStep: "charger_not_turning_on" },
      { text: "No", nextStep: "wall_outlet_ac_replacement" }
    ]
  },

  wall_outlet_ac_replacement: {
    id: 'wall_outlet_ac_replacement',
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working replace the Ac cord.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  charger_not_turning_on: {
    id: 'charger_not_turning_on',
    botMessage: [
      "This indicates the charger is not turning on. Let’s determine why it will not turn on.",
      "Check the 11024-IEC Receptacle for continuity."
    ],
    userOptions: [
      { text: "No continuity", nextStep: "replace_11024_receptacle" },
      { text: "Yes continuity", nextStep: "measure_the_voltage" }
    ]
  },

  replace_11024_receptacle: {
    id: 'replace_11024_receptacle',
    botMessage: [
      "Replace the 11024-Receptacle.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_the_voltage: {
    id: 'measure_the_voltage',
    botMessage: [ "If you have AGM batteries, measure the voltage on both batteries in series. They must have a minimum combined voltage of 16 volts. If you have a single lithium battery, it must have a minimum voltage of 21 volts." ],
    userOptions: [
      { text: "Batteries under voltage", nextStep: "replace_batteries_2" }, // Renamed
      { text: "Batteries have minimum required voltage", nextStep: "check_circuit_breaker_1" } // Renamed
    ]
  },

  replace_batteries_2: {
    id: 'replace_batteries_2',
    botMessage: [
      "Replace the battery/batteries.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_circuit_breaker_1: {
    id: 'check_circuit_breaker_1',
    botMessage: [ "Check the continuity of circuit breaker." ],
    userOptions: [
      { text: "Yes continuity", nextStep: "dc_wiring_connections" },
      { text: "No continuity", nextStep: "replace_circuit_breaker_1" } // Renamed
    ]
  },

  replace_circuit_breaker_1: {
    id: 'replace_circuit_breaker_1',
    botMessage: [
      "Replace the 12038-Circuit Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  dc_wiring_connections: {
    id: 'dc_wiring_connections',
    botMessage: [ "Check to make sure the Dc wiring connections from the charger are securely connected to the controller." ],
    userOptions: [
      { text: "The Dc wiring harness is bad", nextStep: "replace_harness" },
      { text: "The Dc wiring is good", nextStep: "replace_battery_charger_2" } // Renamed
    ]
  },

  replace_harness: {
    id: 'replace_harness',
    botMessage: [
      "Replace the 7852.10-Dc Cable Harness if the battery charger has a removable Dc cable. If the Dc cable is hard-wired into the charger, you must replace the battery charger.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_2: {
    id: 'replace_battery_charger_2',
    botMessage: [
      "The battery charger needs to be replaced.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  step_for_vs_wont_move: {
    id: 'step_for_vs_wont_move',
    botMessage: [ "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the ValueShopper is turned on?" ],
    userOptions: [
      { text: "Yes", nextStep: "numeral_diagnostic_window" },
      { text: "No", nextStep: "test_battery_voltage" }
    ]
  },

  numeral_diagnostic_window: {
    id: 'numeral_diagnostic_window',
    botMessage: [ "Is there a numeral illuminated in the diagnostic window?" ],
    userOptions: [
      { text: "Yes", nextStep: "diagnose_code_guide" },
      { text: "No", nextStep: "sit_on_vs_seat" }
    ]
  },

  diagnose_code_guide: {
    id: 'diagnose_code_guide',
    botMessage: [ "This indicates the motor controller has detected a diagnostic issue. Use the Amigo Diagnostic Code Guide to review the next steps to take to replace the component causing the diagnostic code." ],
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },

  sit_on_vs_seat: {
    id: 'sit_on_vs_seat',
    botMessage: [ "There must be a rider activating the safety switch in the seat. Sit in the seat and make sure the switch has been depressed. Does the ValueShopper now move?" ],
    userOptions: [
      { text: "Yes", nextStep: "problem_resolved" },
      { text: "No", nextStep: "disconnect_seat_switch_wires" }
    ]
  },

  problem_resolved: {
    id: 'problem_resolved',
    botMessage: [ "Your problem has been resolved." ],
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },

  disconnect_seat_switch_wires: {
    id: 'disconnect_seat_switch_wires',
    botMessage: [ "Disconnect the seat switch wires from the seat switch. Jumper across the two-seat switch wires you just disconnected to complete the circuit. Does the ValueShopper move now when the throttle lever is operated?" ],
    userOptions: [
      { text: "Yes", nextStep: "replace_seat_switch" },
      { text: "No", nextStep: "replace_wire_harness" }
    ]
  },

  replace_seat_switch: {
    id: 'replace_seat_switch',
    botMessage: [
      "You need to replace the seat switch.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_wire_harness: {
    id: 'replace_wire_harness',
    botMessage: [
      "You need to replace the 10947-18 Pin Wire Harness.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  test_battery_voltage: {
    id: 'test_battery_voltage',
    botMessage: [ "Remove the seat assembly and rear cover. Test the battery voltage at the controller. Is the battery voltage greater than 21 volts?" ],
    userOptions: [
      { text: "Yes", nextStep: "check_wiring_connections" },
      { text: "No", nextStep: "recharge_battery_or_replace" }
    ]
  },

  recharge_battery_or_replace: {
    id: 'recharge_battery_or_replace',
    botMessage: [ "Recharge the battery/batteries and allow them to go through a completed charge cycle. If the cart still has no power replace the 12168.20-Battery (Lithium) or 8967-Batteries (AGM Type)." ],
    userOptions: [
      { text: "I need to order new batteries.", nextStep: "order_parts" },
      { text: "Continue to end conversation", nextStep: "end_conversation" }
    ]
  },

  check_wiring_connections: {
    id: 'check_wiring_connections',
    botMessage: [
      "Check to ensure all wiring connections from the handle enclosure and controller are securely connected."
    ],
    userOptions: [
      { text: "Continue", nextStep: "check_voltage_match" }
    ]
  },

  check_voltage_match: {
    id: 'check_voltage_match',
    botMessage: [
      "Measure the battery voltage at the controller; it should match the battery voltage measured at the battery/batteries.",
      "Does the voltage at the controller battery/batteries match the voltage at the battery/batteries?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "check_label_motor_controller" },
      { text: "No", nextStep: "check_continuity_thru_breaker" }
    ]
  },

  check_continuity_thru_breaker: {
    id: 'check_continuity_thru_breaker',
    botMessage: [ "Check to make sure there is continuity through the 12038-Circuit Breaker. Is there continuity?" ],
    userOptions: [
      { text: "Yes", nextStep: "replace_battery_wire" },
      { text: "No", nextStep: "replace_circuit_breaker_2" } // Renamed
    ]
  },

  replace_circuit_breaker_2: {
    id: 'replace_circuit_breaker_2',
    botMessage: [
      "Replace the 12038-Circiut Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_wire: {
    id: 'replace_battery_wire',
    botMessage: [
      "Replace the Battery wire asms with a 9853-Battery Wire Disconnect kit.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_label_motor_controller: {
    id: 'check_label_motor_controller',
    botMessage: [ "Check the part number label on the motor controller. Does it match the type of handle the cart has (LED or LCD)?" ],
    userOptions: [
      { text: "Yes", nextStep: "substitute_parts" },
      { text: "No", nextStep: "replace_motor_controller" }
    ]
  },

  substitute_parts: {
    id: 'substitute_parts',
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:",
      "Handle cable",
      "Throttle assembly",
      "Controller",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_motor_controller: {
    id: 'replace_motor_controller',
    botMessage: [
      "Replace the motor controller with the correct version.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  
  order_parts: {
    id: 'order_parts',
    botMessage: [ "I'll connect you with our parts department to help you order the required components. They'll make sure you get exactly what you need for your ValueShopper!" ],
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" }
    ]
  }
};
