import type { ConversationFlow } from '@/types';
// This flow is based on "Vista TSG for Chatbot - DONE.docx"
export const vistaFlow: ConversationFlow = {
  // Entry point from general flow when Vista is selected
  start_vista_flow: {
    id: 'start_vista_flow',
    botMessage: [
      "Excellent! I'll help you troubleshoot your Vista cart.",
      "What seems to be the issue with your Vista?"
    ],
    userOptions: [
      { text: "My Vista turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_vista_battery_troubleshooting" },
      { text: "My Vista will not move", nextStep: "step_for_vista_wont_move" },
      { text: "I have a different customer service need", nextStep: "contact_agent" }
    ]
  },
  greeting: {
    id: 'greeting',
    botMessage: [
      "Hello, this is the bot.", //
      "What seems to be the issue?" //
    ],
    userOptions: [
      { text: "My Vista turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_vista_battery_troubleshooting" },
      { text: "My Vista will not move", nextStep: "step_for_vista_wont_move" },
      { text: "I have a different customer service need.", nextStep: "contact_agent" }
    ]
  },
  step_for_vista_battery_troubleshooting: {
    id: 'step_for_vista_battery_troubleshooting',
    botMessage: [
      "Connect the AC cord to the wall outlet.", //
      "For the throttle enclosure LED battery gage: does the battery gage on the throttle enclosure flash for 10-30 seconds before going solid?", //
      "For the throttle enclosure LCD throttle display: does the display show a green rectangle at the bottom with the text \"CHARGING\"?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "charge_batteries_measure_voltage" },
      { text: "No", nextStep: "ac_cord_illuminate" }
    ]
  },
  charge_batteries_measure_voltage: {
    id: 'charge_batteries_measure_voltage',
    botMessage: [
      "With the Ac cord disconnected from the wall outlet, measure and record the voltage on the batteries.", //
      "Now connect the Ac cord into the wall outlet and let the batteries charge for two minutes.", //
      "Now measure the battery voltage, has it increased to a minimum of 25 volts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "charger_fine_replace_batteries" },
      { text: "No", nextStep: "replace_charger" }
    ]
  },
  charger_fine_replace_batteries: {
    id: 'charger_fine_replace_batteries',
    botMessage: [
      "The charger is operating properly, but the battery/batteries have reached a state where they can no longer hold a charge and should be replaced.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  replace_charger: {
    id: 'replace_charger',
    botMessage: [
      "The battery charger is not outputting the proper Dc voltage, so you need to replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  ac_cord_illuminate: {
    id: 'ac_cord_illuminate',
    botMessage: [ "Does the Ac cord end illuminate?" ], //
    userOptions: [
      { text: "Yes", nextStep: "charger_not_turning_on" },
      { text: "No", nextStep: "wall_outlet_replace_cord" }
    ]
  },
  wall_outlet_replace_cord: {
    id: 'wall_outlet_replace_cord',
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working, you need to replace the AC cord.", //
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
      "This indicates the charger is not turning on. Let’s determine why it will not turn on.", //
      "Check the 11024-IEC Receptacle for continuity." //
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "check_battery_voltage" },
      { text: "No continuity", nextStep: "replace_batteries" }
    ]
  },
  replace_batteries: {
    id: 'replace_batteries',
    botMessage: [
      "You need to replace the battery/batteries.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  check_battery_voltage: {
    id: 'check_battery_voltage',
    botMessage: [ "If you have AGM batteries, measure the voltage on both batteries in the series; they must have a minimum combined voltage of 16 volts. If you have a single lithium battery it must have a minimum voltage of 21 volts." ], //
    userOptions: [
      { text: "Batteries are under voltage", nextStep: "replace_batteries" },
      { text: "Batteries have minimum required voltage", nextStep: "check_circuit_breaker" }
    ]
  },
  check_circuit_breaker: {
    id: 'check_circuit_breaker',
    botMessage: [ "Check if there is continuity of circuit breaker." ], //
    userOptions: [
      { text: "Yes continuity", nextStep: "check_dc_wiring" },
      { text: "No continuity", nextStep: "replace_breaker" }
    ]
  },
  replace_breaker: {
    id: 'replace_breaker',
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
      { text: "Dc wiring harness is bad", nextStep: "replace_harness" },
      { text: "Dc wiring is good", nextStep: "replace_battery_charger_wiring" }
    ]
  },
  replace_harness: {
    id: 'replace_harness',
    botMessage: [
      "You need to replace the 7852.10-Dc Cable Harness if the battery charger has a removable Dc cable. If the Dc cable is hard-wired into the charger, you must replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  replace_battery_charger_wiring: {
    id: 'replace_battery_charger_wiring',
    botMessage: [
      "You need to replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  step_for_vista_wont_move: {
    id: 'step_for_vista_wont_move',
    botMessage: [ "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the key is turned on?" ], //
    userOptions: [
      { text: "Yes", nextStep: "battery_display_flashing" },
      { text: "No", nextStep: "test_battery_voltage" }
    ]
  },
  battery_display_flashing: {
    id: 'battery_display_flashing',
    botMessage: [ "Is the battery display flashing?" ], //
    userOptions: [
      { text: "Yes", nextStep: "numeral_2_illuminate" },
      { text: "No", nextStep: "make_sure_sitting_try_again" }
    ]
  },
  numeral_2_illuminate: {
    id: 'numeral_2_illuminate',
    botMessage: [ "Is the numeral \"2\" illuminated in the diagnostic window?" ], //
    userOptions: [
      { text: "Yes", nextStep: "brake_circuit_open" },
      { text: "No", nextStep: "diagnostic_code_guide" }
    ]
  },
  diagnostic_code_guide: {
    id: 'diagnostic_code_guide',
    botMessage: [ "If the numeral is something other than \"2,\" refer to the diagnostic code guide and use those troubleshooting steps to determine the root cause of the diagnostic code." ], //
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },
  brake_circuit_open: {
    id: 'brake_circuit_open',
    botMessage: [
      "This indicates the brake circuit is open.", //
      "Turn the key off and check to make sure the freewheel lever in the rear of the Vista is in the Normal position.", //
      "Turn the key back on, and if the \"2\" code is still illuminated, check the continuity on the brake wiring. If the wires are good replace the 11087-Brake.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  make_sure_sitting_try_again: {
    id: 'make_sure_sitting_try_again',
    botMessage: [ "Make sure you are properly seated and depress the seat switch under the seat cover. Does the Vista now run?" ], //
    userOptions: [
      { text: "Yes", nextStep: "problem_resolved" },
      { text: "No", nextStep: "throttle_lever_activated" }
    ]
  },
  problem_resolved: {
    id: 'problem_resolved',
    botMessage: [ "Your problem has been resolved." ], //
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },
  throttle_lever_activated: {
    id: 'throttle_lever_activated',
    botMessage: [
      "Disconnect the two wires from the seat switch terminals coming off 10947-Wire asm. Create a short circuit across the two female terminals you just disconnected.", //
      "Does the Vista now run if the throttle lever is activated?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_wire_assembly" },
      { text: "No", nextStep: "swap_parts" }
    ]
  },
  replace_wire_assembly: {
    id: 'replace_wire_assembly',
    botMessage: [
      "You need to replace the 10947-Wire Assembly.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  swap_parts: {
    id: 'swap_parts',
    botMessage: [
      "This means one of four components is faulty. Swap them in the following order:", //
      "Replace the 8969-Handle Cable",
      "Replace the enclosure matching the current style on the Vista",
      "Replace the motor controller matching the current style on the Vista",
      "If none of the previous three parts resolved the issue, then replace the 11042-Drive",
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  test_battery_voltage: {
    id: 'test_battery_voltage',
    botMessage: [
      "Remove the 7/16\" bolt underneath the front of the seat that runs between the seat release levers. Test the battery voltage at the controller.", //
      "Is the battery voltage greater than 21 volts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "check_wiring" },
      { text: "No", nextStep: "recharge_batteries_replace_batteries" }
    ]
  },
  recharge_batteries_replace_batteries: {
    id: 'recharge_batteries_replace_batteries',
    botMessage: [
      "Recharge the battery/batteries and allow them to go through a completed charge cycle. If cart still has no power replace the batteries.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  check_wiring: {
    id: 'check_wiring',
    botMessage: [
      "Check to ensure all wiring connections from the handle enclosure, breakout board, and controller are securely connected.", //
      "Measure the battery voltage at the controller; it should match the battery voltage measured at the battery/batteries. Are the wires secure and battery at the controller? Does voltage at the battery/batteries at the controller match the voltage at the battery?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "substitute_parts" },
      { text: "No", nextStep: "check_continuity" }
    ]
  },
  substitute_parts: {
    id: 'substitute_parts',
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:", //
      "8969-Handle cable",
      "Enclosure",
      "Controller",
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  check_continuity: {
    id: 'check_continuity',
    botMessage: [
      "Check to make sure there is continuity through the 12038-Circuit Breaker.", //
      "Is there continuity?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_battery_harness" },
      { text: "No", nextStep: "replace_breaker" }
    ]
  },
  replace_battery_harness: {
    id: 'replace_battery_harness',
    botMessage: [
      "You need to replace the battery harnesses with a 9853-Battery Harness Kit.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  order_parts: {
    id: 'order_parts',
    botMessage: [ "I'll connect you with our parts department to help you order the required components. They'll make sure you get exactly what you need for your Vista!" ],
    userOptions: [
        { text: "Continue", nextStep: "contact_agent" }
    ]
  }
};