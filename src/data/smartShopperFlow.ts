import type { ConversationFlow } from '@/types';
// This flow is based on "SmartShopper TSG for Chatbot - DONE.docx"
export const smartShopperFlow: ConversationFlow = {
  // Entry point from general flow when SmartShopper is selected
  start_smartshopper_flow: {
    id: 'start_smartshopper_flow',
    botMessage: [
      "Great! I'll help you troubleshoot your SmartShopper cart.",
      "What seems to be the issue with your SmartShopper?"
    ],
    userOptions: [
      { text: "My SmartShopper turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_ss_battery_troubleshooting_info" },
      { text: "My SmartShopper will not move", nextStep: "step_for_ss_wont_move" },
      { text: "I have a different customer service need", nextStep: "contact_agent" }
    ]
  },

  greeting: {
    id: 'greeting',
    botMessage: [
      "Hello, this is the bot.",
      "What seems to be the issue?"
    ],
    userOptions: [
      { text: "My SmartShopper turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_ss_battery_troubleshooting_info" },
      { text: "My SmartShopper will not move", nextStep: "step_for_ss_wont_move" }
    ]
  },

  step_for_ss_battery_troubleshooting_info: {
    id: 'step_for_ss_battery_troubleshooting_info',
    botMessage: [
      "Connect the AC cord to the wall outlet."
    ],
    userOptions: [
      { text: "Continue", nextStep: "step_for_ss_battery_troubleshooting_question" }
    ]
  },

  step_for_ss_battery_troubleshooting_question: {
    id: 'step_for_ss_battery_troubleshooting_question',
    botMessage: [
      "For the LED throttle enclosure battery gage: does the battery gage on the throttle enclosure flash for 10-30 seconds before going solid?",
      "For the LCD throttle enclosure display: does the display show a green rectangle at the bottom with the text \"CHARGING\"?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "ac_cord_illuminate" },
      { text: "No", nextStep: "measure_record_voltage_1_info" }
    ]
  },

  ac_cord_illuminate: {
    id: 'ac_cord_illuminate',
    botMessage: [ "Does the AC cord end illuminate?" ],
    userOptions: [
      { text: "Yes", nextStep: "charger_not_turning_on" },
      { text: "No", nextStep: "wall_outlet_replace_cord_info" }
    ]
  },

  wall_outlet_replace_cord_info: {
    id: 'wall_outlet_replace_cord_info',
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working replace the AC cord."
    ],
    userOptions: [
      { text: "Continue", nextStep: "wall_outlet_replace_cord_order" }
    ]
  },

  wall_outlet_replace_cord_order: {
    id: 'wall_outlet_replace_cord_order',
    botMessage: [
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
      "This indicates the charger is not turning on. Let’s determine why it won’t turn on.",
      "Check the 11024-IEC Receptacle for continuity."
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "measure_voltage" },
      { text: "No continuity", nextStep: "replace_receptacle_info" }
    ]
  },

  replace_receptacle_info: {
    id: 'replace_receptacle_info',
    botMessage: [
      "You need to replace the 11024-Receptacle."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_receptacle_order" }
    ]
  },

  replace_receptacle_order: {
    id: 'replace_receptacle_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_voltage: {
    id: 'measure_voltage',
    botMessage: [
      "If you have AGM batteries, measure the voltage on both batteries in the series; they must have a minimum combined voltage of 16 volts. If you have a single lithium battery it must have a minimum voltage of 21 volts."
    ],
    userOptions: [
      { text: "Batteries are under voltage", nextStep: "replace_batteries_1_info" },
      { text: "Batteries have the minimum required voltage", nextStep: "check_circuit_breaker_1" }
    ]
  },

  replace_batteries_1_info: {
    id: 'replace_batteries_1_info',
    botMessage: [
      "You need to replace the battery/batteries."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_batteries_1_order" }
    ]
  },

  replace_batteries_1_order: {
    id: 'replace_batteries_1_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_circuit_breaker_1: {
    id: 'check_circuit_breaker_1',
    botMessage: [ "Check continuity of circuit breaker" ],
    userOptions: [
      { text: "No continuity", nextStep: "replace_breaker_1_info" },
      { text: "Yes continuity", nextStep: "check_dc_wiring" }
    ]
  },

  replace_breaker_1_info: {
    id: 'replace_breaker_1_info',
    botMessage: [
      "You need to replace the 12038-Circuit Breaker."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_breaker_1_order" }
    ]
  },

  replace_breaker_1_order: {
    id: 'replace_breaker_1_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_dc_wiring: {
    id: 'check_dc_wiring',
    botMessage: [ "Check to make sure the Dc wiring connections from the charger are securely connected to the controller." ],
    userOptions: [
      { text: "The Dc wiring harness is bad", nextStep: "replace_harness_or_charger_info" },
      { text: "Dc wiring is good", nextStep: "replace_battery_charger_1_info" }
    ]
  },

  replace_harness_or_charger_info: {
    id: 'replace_harness_or_charger_info',
    botMessage: [
      "You need to replace the 7852.10-Dc Cable Harness if the battery charger has a removable Dc cable. If the Dc cable is hard-wired into the charger, you must replace the battery charger."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_harness_or_charger_order" }
    ]
  },

  replace_harness_or_charger_order: {
    id: 'replace_harness_or_charger_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_1_info: {
    id: 'replace_battery_charger_1_info',
    botMessage: [
      "The battery charger needs to be replaced."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_battery_charger_1_order" }
    ]
  },

  replace_battery_charger_1_order: {
    id: 'replace_battery_charger_1_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_record_voltage_1_info: {
    id: 'measure_record_voltage_1_info',
    botMessage: [
      "With the Ac cord disconnected from the wall outlet, measure and record the voltage on the batteries. Now connect the Ac cord to the wall outlet, and let the batteries charge for two minutes."
    ],
    userOptions: [
      { text: "Continue", nextStep: "measure_record_voltage_1_question" }
    ]
  },

  measure_record_voltage_1_question: {
    id: 'measure_record_voltage_1_question',
    botMessage: [
      "Now measure the battery voltage, has it increased to a minimum of 25 volts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_batteries_2_info" },
      { text: "No", nextStep: "replace_battery_charger_2_info" }
    ]
  },

  replace_batteries_2_info: {
    id: 'replace_batteries_2_info',
    botMessage: [
      "The charger is operating properly, but the battery/batteries have reached a state where they can no longer hold a charge and should be replaced."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_batteries_2_order" }
    ]
  },

  replace_batteries_2_order: {
    id: 'replace_batteries_2_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_2_info: {
    id: 'replace_battery_charger_2_info',
    botMessage: [
      "The battery charger is not outputting the proper Dc voltage. You need to replace the battery charger."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_battery_charger_2_order" }
    ]
  },

  replace_battery_charger_2_order: {
    id: 'replace_battery_charger_2_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  step_for_ss_wont_move: {
    id: 'step_for_ss_wont_move',
    botMessage: [ "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the SmartShopper is turned on?" ],
    userOptions: [
      { text: "Yes", nextStep: "numeral_diagnostic_window" },
      { text: "No", nextStep: "remove_seat_test_voltage_info" }
    ]
  },

  numeral_diagnostic_window: {
    id: 'numeral_diagnostic_window',
    botMessage: [ "Is there a numeral illuminated in the diagnostic window?" ],
    userOptions: [
      { text: "Yes", nextStep: "diagnostic_issue" },
      { text: "No", nextStep: "sit_on_ss_try_again_info" }
    ]
  },

  sit_on_ss_try_again_info: {
    id: 'sit_on_ss_try_again_info',
    botMessage: [
      "There must be a rider activating the safety switch in the seat. Sit in the seat and make sure the switch is has been depressed."
    ],
    userOptions: [
      { text: "Continue", nextStep: "sit_on_ss_try_again_question" }
    ]
  },

  sit_on_ss_try_again_question: {
    id: 'sit_on_ss_try_again_question',
    botMessage: [
      "Does the SmartShopper now move?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "problem_resolved" },
      { text: "No", nextStep: "disconnect_seat_switch_info" }
    ]
  },

  problem_resolved: {
    id: 'problem_resolved',
    botMessage: [ "Your problem has been resolved." ],
    userOptions: [ { text: "Continue", nextStep: "end_conversation" } ]
  },

  disconnect_seat_switch_info: {
    id: 'disconnect_seat_switch_info',
    botMessage: [
      "Disconnect the seat switch wires from the seat switch. Jumper across the two seat switch wires you just disconnected to complete the circuit."
    ],
    userOptions: [
      { text: "Continue", nextStep: "disconnect_seat_switch_question" }
    ]
  },

  disconnect_seat_switch_question: {
    id: 'disconnect_seat_switch_question',
    botMessage: [
      "Does the SmartShopper move now when the throttle lever is operated?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_seat_switch_info" },
      { text: "No", nextStep: "replace_wire_harness_info" }
    ]
  },

  replace_seat_switch_info: {
    id: 'replace_seat_switch_info',
    botMessage: [
      "You need to replace the seat switch."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_seat_switch_order" }
    ]
  },

  replace_seat_switch_order: {
    id: 'replace_seat_switch_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_wire_harness_info: {
    id: 'replace_wire_harness_info',
    botMessage: [
      "You need to replace the 10947-18 Pin Wire Harness."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_wire_harness_order" }
    ]
  },

  replace_wire_harness_order: {
    id: 'replace_wire_harness_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  diagnostic_issue: {
    id: 'diagnostic_issue',
    botMessage: [ "This indicates the motor controller has detected a diagnostic issue. Is the numeral in the diagnostic window a \"2\"? Usually, the numeral \"2\" displays because the brake circuit is open." ],
    userOptions: [
      { text: "Yes", nextStep: "freewheel_lever_info" },
      { text: "No", nextStep: "diagnostic_code_guide" }
    ]
  },

  freewheel_lever_info: {
    id: 'freewheel_lever_info',
    botMessage: [
      "Turn the SmartShopper off, reach through the slot in the cover next to the right rear wheel and make sure the freewheel lever is pulled all the way to the rear in the Normal position.",
      "Turn the key back on. If the \"2\" code is still illuminated, check the continuity on the brake wiring. If the wires are good, you need to replace the 11087-Brake."
    ],
    userOptions: [
      { text: "Continue", nextStep: "freewheel_lever_order" }
    ]
  },

  freewheel_lever_order: {
    id: 'freewheel_lever_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  diagnostic_code_guide: {
    id: 'diagnostic_code_guide',
    botMessage: [ "Use the Amigo Diagnostic Code Guide to review the next steps to take to replace the component causing the diagnostic code." ],
    userOptions: [ { text: "Continue", nextStep: "end_conversation" } ]
  },

  remove_seat_test_voltage_info: {
    id: 'remove_seat_test_voltage_info',
    botMessage: [
      "Remove the seat assembly and rear cover. Test the battery voltage at the controller."
    ],
    userOptions: [
      { text: "Continue", nextStep: "remove_seat_test_voltage_question" }
    ]
  },

  remove_seat_test_voltage_question: {
    id: 'remove_seat_test_voltage_question',
    botMessage: [
      "Is the battery voltage greater than 21 volts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "check_wiring" },
      { text: "No", nextStep: "recharge_batteries" }
    ]
  },

  recharge_batteries: {
    id: 'recharge_batteries',
    botMessage: [
      "Recharge the battery/batteries and allow them to go through a completed charge cycle. If cart still has no power, replace the 12168.20-Battery (Lithium) or 8967-Batteries (AGM Type).",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_wiring: {
    id: 'check_wiring',
    botMessage: [ "Check to ensure all wiring connections from the handle enclosure and controller are securely connected. Measure the battery voltage at the controller, it should match the battery voltage measured at the battery/batteries. Are the wires secure and battery at the controller? Does the voltage at the controller’s battery/batteries match the voltage at the battery?" ],
    userOptions: [
      { text: "Yes", nextStep: "substitute_parts" },
      { text: "No", nextStep: "check_circuit_breaker_2" }
    ]
  },

  substitute_parts: {
    id: 'substitute_parts',
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:",
      "Handle cable",
      "Throttle Assembly",
      "Controller",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_circuit_breaker_2: {
    id: 'check_circuit_breaker_2',
    botMessage: [
      "Check to make sure there is continuity through the 12038-Circuit Breaker. Is there continuity?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_battery_wire" },
      { text: "No", nextStep: "replace_breaker_2" }
    ]
  },

  replace_battery_wire: {
    id: 'replace_battery_wire',
    botMessage: [
      "You need to replace the battery wire asms with a 9853-Battery Wire Disconnect kit.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_breaker_2: {
    id: 'replace_breaker_2',
    botMessage: [
      "You need to replace the 12038-Circuit Breaker.",
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  }
};