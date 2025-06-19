import { ConversationFlow } from './conversationFlow';

// This flow is based on "SmartShopper TSG for Chatbot - DONE.docx"
export const smartShopperFlow: ConversationFlow = {
  greeting: {
    id: 'greeting',
    botMessage: [
      "Hello, this is the bot.",
      "What seems to be the issue?"
    ],
    userOptions: [
      { text: "My SmartShopper turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_ss_battery_troubleshooting" },
      { text: "My SmartShopper will not move", nextStep: "step_for_ss_wont_move" }
    ]
  },

  step_for_ss_battery_troubleshooting: {
    id: 'step_for_ss_battery_troubleshooting',
    botMessage: [
      "Connect the AC cord to the wall outlet.", //
      "For the LED throttle enclosure battery gage: does the battery gage on the throttle enclosure flash for 10-30 seconds before going solid?", //
      "For the LCD throttle enclosure display: does the display show a green rectangle at the bottom with the text \"CHARGING\"?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "ac_cord_illuminate" },
      { text: "No", nextStep: "measure_record_voltage_1" } // Renamed
    ]
  },

  ac_cord_illuminate: {
    id: 'ac_cord_illuminate',
    botMessage: [ "Does the AC cord end illuminate?" ], //
    userOptions: [
      { text: "Yes", nextStep: "charger_not_turning_on" },
      { text: "No", nextStep: "wall_outlet_replace_cord" }
    ]
  },

  wall_outlet_replace_cord: {
    id: 'wall_outlet_replace_cord',
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working replace the AC cord.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  charger_not_turning_on: {
    id: 'charger_not_turning_on',
    botMessage: [
      "This indicates the charger is not turning on. Let’s determine why it won’t turn on.", //
      "Check the 11024-IEC Receptacle for continuity." //
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "measure_voltage" },
      { text: "No continuity", nextStep: "replace_receptacle" }
    ]
  },

  replace_receptacle: {
    id: 'replace_receptacle',
    botMessage: [
      "You need to replace the 11024-Receptacle.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_voltage: {
    id: 'measure_voltage',
    botMessage: [ "If you have AGM batteries, measure the voltage on both batteries in the series; they must have a minimum combined voltage of 16 volts. If you have a single lithium battery it must have a minimum voltage of 21 volts." ], //
    userOptions: [
      { text: "Batteries are under voltage", nextStep: "replace_batteries_1" }, // Renamed
      { text: "Batteries have the minimum required voltage", nextStep: "check_circuit_breaker_1" } // Renamed
    ]
  },

  replace_batteries_1: {
    id: 'replace_batteries_1',
    botMessage: [
      "You need to replace the battery/batteries.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_circuit_breaker_1: {
    id: 'check_circuit_breaker_1',
    botMessage: [ "Check continuity of circuit breaker" ], //
    userOptions: [
      { text: "No continuity", nextStep: "replace_breaker_1" }, // Renamed
      { text: "Yes continuity", nextStep: "check_dc_wiring" }
    ]
  },

  replace_breaker_1: {
    id: 'replace_breaker_1',
    botMessage: [
      "You need to replace the 12038-Circuit Breaker.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_dc_wiring: {
    id: 'check_dc_wiring',
    botMessage: [ "Check to make sure the Dc wiring connections from the charger are securely connected to the controller." ], //
    userOptions: [
      { text: "The Dc wiring harness is bad", nextStep: "replace_harness_or_charger" },
      { text: "Dc wiring is good", nextStep: "replace_battery_charger_1" } // Renamed
    ]
  },

  replace_harness_or_charger: {
    id: 'replace_harness_or_charger',
    botMessage: [
      "You need to replace the 7852.10-Dc Cable Harness if the battery charger has a removable Dc cable. If the Dc cable is hard-wired into the charger, you must replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_1: {
    id: 'replace_battery_charger_1',
    botMessage: [
      "The battery charger needs to be replaced.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_record_voltage_1: {
    id: 'measure_record_voltage_1',
    botMessage: [
      "With the Ac cord disconnected from the wall outlet, measure and record the voltage on the batteries. Now connect the Ac cord to the wall outlet, and let the batteries charge for two minutes.", //
      "Now measure the battery voltage, has it increased to a minimum of 25 volts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_batteries_2" }, // Renamed
      { text: "No", nextStep: "replace_battery_charger_2" } // Renamed
    ]
  },
  
  replace_batteries_2: {
    id: 'replace_batteries_2',
    botMessage: [
      "The charger is operating properly, but the battery/batteries have reached a state where they can no longer hold a charge and should be replaced.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_2: {
    id: 'replace_battery_charger_2',
    botMessage: [
      "The battery charger is not outputting the proper Dc voltage. You need to replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  step_for_ss_wont_move: {
    id: 'step_for_ss_wont_move',
    botMessage: [ "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the SmartShopper is turned on?" ], //
    userOptions: [
      { text: "Yes", nextStep: "numeral_diagnostic_window" },
      { text: "No", nextStep: "remove_seat_test_voltage" }
    ]
  },

  numeral_diagnostic_window: {
    id: 'numeral_diagnostic_window',
    botMessage: [ "Is there a numeral illuminated in the diagnostic window?" ],
    userOptions: [
      { text: "Yes", nextStep: "diagnostic_issue" },
      { text: "No", nextStep: "sit_on_ss_try_again" }
    ]
  },

  sit_on_ss_try_again: {
    id: 'sit_on_ss_try_again',
    botMessage: [ "There must be a rider activating the safety switch in the seat. Sit in the seat and make sure the switch is has been depressed. Does the SmartShopper now move?" ], //
    userOptions: [
      { text: "Yes", nextStep: "problem_resolved" },
      { text: "No", nextStep: "disconnect_seat_switch" }
    ]
  },

  problem_resolved: {
    id: 'problem_resolved',
    botMessage: [ "Your problem has been resolved." ], //
    userOptions: [ { text: "Continue", nextStep: "end_conversation" } ]
  },

  disconnect_seat_switch: {
    id: 'disconnect_seat_switch',
    botMessage: [ "Disconnect the seat switch wires from the seat switch. Jumper across the two seat switch wires you just disconnected to complete the circuit. Does the SmartShopper move now when the throttle lever is operated?" ], //
    userOptions: [
      { text: "Yes", nextStep: "replace_seat_switch" },
      { text: "No", nextStep: "replace_wire_harness" }
    ]
  },

  replace_seat_switch: {
    id: 'replace_seat_switch',
    botMessage: [
      "You need to replace the seat switch.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_wire_harness: {
    id: 'replace_wire_harness',
    botMessage: [
      "You need to replace the 10947-18 Pin Wire Harness.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  diagnostic_issue: { // Corrected from mislabeled "remove_seat_test_voltage" in source doc
    id: 'diagnostic_issue',
    botMessage: [ "This indicates the motor controller has detected a diagnostic issue. Is the numeral in the diagnostic window a \"2\"? Usually, the numeral \"2\" displays because the brake circuit is open." ], //
    userOptions: [
      { text: "Yes", nextStep: "freewheel_lever" },
      { text: "No", nextStep: "diagnostic_code_guide" }
    ]
  },

  freewheel_lever: {
    id: 'freewheel_lever',
    botMessage: [
      "Turn the SmartShopper off, reach through the slot in the cover next to the right rear wheel and make sure the freewheel lever is pulled all the way to the rear in the Normal position.", //
      "Turn the key back on. If the \"2\" code is still illuminated, check the continuity on the brake wiring. If the wires are good, you need to replace the 11087-Brake.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  diagnostic_code_guide: {
    id: 'diagnostic_code_guide',
    botMessage: [ "Use the Amigo Diagnostic Code Guide to review the next steps to take to replace the component causing the diagnostic code." ], //
    userOptions: [ { text: "Continue", nextStep: "end_conversation" } ]
  },

  remove_seat_test_voltage: { // This is the "No" path from step_for_ss_wont_move
    id: 'remove_seat_test_voltage',
    botMessage: [ "Remove the seat assembly and rear cover. Test the battery voltage at the controller. Is the battery voltage greater than 21 volts?" ], //
    userOptions: [
      { text: "Yes", nextStep: "check_wiring" },
      { text: "No", nextStep: "recharge_batteries" } // Corrected from "No:"
    ]
  },

  recharge_batteries: {
    id: 'recharge_batteries',
    botMessage: [
      "Recharge the battery/batteries and allow them to go through a completed charge cycle. If cart still has no power, replace the 12168.20-Battery (Lithium) or 8967-Batteries (AGM Type).", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_wiring: {
    id: 'check_wiring',
    botMessage: [ "Check to ensure all wiring connections from the handle enclosure and controller are securely connected. Measure the battery voltage at the controller, it should match the battery voltage measured at the battery/batteries. Are the wires secure and battery at the controller? Does the voltage at the controller’s battery/batteries match the voltage at the battery?" ], //
    userOptions: [
      { text: "Yes", nextStep: "substitute_parts" },
      { text: "No", nextStep: "check_circuit_breaker_2" } // Renamed
    ]
  },

  substitute_parts: {
    id: 'substitute_parts',
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:", //
      "Handle cable",
      "Throttle Assembly",
      "Controller",
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_circuit_breaker_2: {
    id: 'check_circuit_breaker_2',
    botMessage: [
      "Check to make sure there is continuity through the 12038-Circuit Breaker. Is there continuity?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_battery_wire" },
      { text: "No", nextStep: "replace_breaker_2" } // Renamed
    ]
  },

  replace_battery_wire: {
    id: 'replace_battery_wire',
    botMessage: [
      "You need to replace the battery wire asms with a 9853-Battery Wire Disconnect kit.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_breaker_2: {
    id: 'replace_breaker_2',
    botMessage: [
      "You need to replace the 12038-Circuit Breaker.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  }
};