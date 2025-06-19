import { ConversationFlow } from './conversationFlow';

// This flow is based on "General Amigo TSG for Chatbot - DONE.docx"
export const conversationFlow: ConversationFlow = {
  greeting: {
    id: 'greeting',
    botMessage: [
      "Hello, this is the bot.", //
      "What seems to be the issue?" //
    ],
    userOptions: [
      { text: "My Amigo turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_genamigo_battery_troubleshooting" }, //
      { text: "My Amigo will not move", nextStep: "step_for_genamigo_wont_move" }, //
      { text: "I have a different customer service need.", nextStep: "contact_agent" } //
    ]
  },

  step_for_genamigo_battery_troubleshooting: {
    id: 'step_for_genamigo_battery_troubleshooting',
    botMessage: [ "Connect the AC cord to the wall outlet. Does the battery gauge on the throttle enclosure flash for 10-30 seconds before going solid?" ], //
    userOptions: [
      { text: "Yes", nextStep: "measure_record_voltage" },
      { text: "No", nextStep: "check_wall_outlet" }
    ]
  },

  check_wall_outlet: {
    id: 'check_wall_outlet',
    botMessage: [ "Plug a radio, lamp, etc. into the wall outlet. Is it working?" ], //
    userOptions: [
      { text: "Yes", nextStep: "measure_voltage_ac_side" },
      { text: "Find a wall outlet that works and repeat the process.", nextStep: "try_again" } //
    ]
  },

  try_again: {
    id: 'try_again',
    botMessage: [ "Plug a radio, lamp, etc. into a different wall outlet. Is it working?" ], //
    userOptions: [
      { text: "Yes", nextStep: "measure_voltage_ac_side" },
      { text: "If the wall outlet is still not working, our service team may be able to help with your Amigo troubleshooting.", nextStep: "contact_agent" } //
    ]
  },

  measure_voltage_ac_side: {
    id: 'measure_voltage_ac_side',
    botMessage: [
      "Remove the seat and rear cover. Disconnect the cord reel Ac plug from the battery charger and measure the voltage coming out of the Ac side of the cord reel.", //
      "Does it measure at 110-120 volts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_dc_charger" },
      { text: "No", nextStep: "replace_cord_reel" }
    ]
  },

  replace_cord_reel: {
    id: 'replace_cord_reel',
    botMessage: [
      "You need to replace the cord reel.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_dc_charger: {
    id: 'replace_dc_charger',
    botMessage: [ "Replace the Dc cable that connects the battery charger to the motor controller. Does the battery gauge flash now when the cord reel is connected to the wall outlet?" ], //
    userOptions: [
      { text: "Yes", nextStep: "charge_batteries_or_replace" },
      { text: "No", nextStep: "replace_battery_charger_1" } // Renamed to avoid conflicts
    ]
  },

  charge_batteries_or_replace: {
    id: 'charge_batteries_or_replace',
    botMessage: [
      "Allow the batteries to fully charge. If the Amigo still does not hold a charge after an extended charge cycle, replace the batteries.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  replace_battery_charger_1: { // Renamed
    id: 'replace_battery_charger_1',
    botMessage: [
      "You need to replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  measure_record_voltage: {
    id: 'measure_record_voltage',
    botMessage: [
      "With the Ac cord disconnected from the wall outlet, measure and record the voltage on the batteries.", //
      "Now connect the Ac cord into the wall outlet and let the batteries charge for two minutes. Then measure the battery voltage. Has it increased to a minimum of 25 volts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_batteries" },
      { text: "No", nextStep: "replace_battery_charger_2" } // Renamed
    ]
  },

  replace_batteries: {
    id: 'replace_batteries',
    botMessage: [
      "The batteries have reached a point where they can no longer hold a charge and need to be replaced.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  
  replace_battery_charger_2: { // Renamed
    id: 'replace_battery_charger_2',
    botMessage: [
        "The battery charger is not outputting the proper Dc voltage, so you need to replace the battery charger.", //
        "Do you need to order parts?" //
    ],
    userOptions: [
        { text: "Yes", nextStep: "order_parts" },
        { text: "No", nextStep: "end_conversation" }
    ]
  },

  step_for_genamigo_wont_move: {
    id: 'step_for_genamigo_wont_move',
    botMessage: [ "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the Amigo is turned on?" ], //
    userOptions: [
      { text: "Yes", nextStep: "number_illuminated" },
      { text: "No", nextStep: "measure_battery_voltage" }
    ]
  },

  measure_battery_voltage: {
    id: 'measure_battery_voltage',
    botMessage: [ "When measuring the battery voltage in series, do they have a minimum combined voltage of 16 volts?" ], //
    userOptions: [
      { text: "Yes", nextStep: "one_of_three_issues" },
      { text: "No", nextStep: "charge_batteries_try_again" }
    ]
  },

  charge_batteries_try_again: {
    id: 'charge_batteries_try_again',
    botMessage: [
      "Your batteries do not have enough charge in them to power the Amigo. Plug the AC cord in, fully charge the batteries, and then see if the Amigo will run.", //
      "If the Amigo does not turn on after charging, the batteries need to be replaced.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
  
  one_of_three_issues: {
    id: 'one_of_three_issues',
    botMessage: [
      "One of three components is not allowing the Amigo to turn on. Replace the parts in this order to determine which part is at fault:", //
      "Handle cable",
      "Throttle enclosure assembly",
      "Motor controller",
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  number_illuminated: {
    id: 'number_illuminated',
    botMessage: [ "Is there a number illuminated in the diagnostic window?" ], //
    userOptions: [
      { text: "Yes", nextStep: "diagnostic_code" },
      { text: "No", nextStep: "battery_gage_flashing" }
    ]
  },

  battery_gage_flashing: {
    id: 'battery_gage_flashing',
    botMessage: [ "Is the battery gage on “empty” and flashing?" ], //
    userOptions: [
      { text: "Yes", nextStep: "charge_try_again_2" }, // Renamed
      { text: "No", nextStep: "motor_controller_signal" }
    ]
  },

  charge_try_again_2: { // Renamed
    id: 'charge_try_again_2',
    botMessage: [ "Your batteries may not have enough charge in them to power the Amigo. Plug the AC cord in, fully charge the batteries, then see if the Amigo will run" ], //
    userOptions: [
      { text: "I need further assistance", nextStep: "contact_agent" }
    ]
  },

  motor_controller_signal: {
    id: 'motor_controller_signal',
    botMessage: [
      "The motor controller may not be receiving the correct signal. Replace the handle cable first. If that does not resolve the problem, replace the throttle enclosure assembly.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  diagnostic_code: {
    id: 'diagnostic_code',
    botMessage: [ "Is the Diagnostic Code a \"1\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "em_brake_circuit" },
      { text: "No", nextStep: "code_2" }
    ]
  },

  em_brake_circuit: {
    id: 'em_brake_circuit',
    botMessage: [
      "The \"1\" code indicates the EM Brake circuit has a short circuit.", //
      "Check brake wires and connections for damage or looseness. If they are tight, disconnect brake wires to controller and cycle key.", //
      "If the code changes to a \"2” replace the brake. The last option is to replace the motor controller.",
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_2: {
    id: 'code_2',
    botMessage: [ "Is the Diagnostic Code a \"2\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "em_brake_open" },
      { text: "No", nextStep: "code_3" }
    ]
  },

  em_brake_open: {
    id: 'em_brake_open',
    botMessage: [
      "The EM Brake circuit is open. Either the windings or connections are open or the EM brake release lever is in “freewheeling position.\"", //
      "Ensure the EM brake lever is in drive position, if it is, check brake wires and connections for damage or looseness. If they are tight, swap brake and motor leads on the motor controller.", //
      "If code changes to\"4,\" change the brake. The last option is to change the motor controller.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_3: {
    id: 'code_3',
    botMessage: [ "Is the Diagnostic Code a \"3\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "motor_circuit" },
      { text: "No", nextStep: "code_4" }
    ]
  },

  motor_circuit: {
    id: 'motor_circuit',
    botMessage: [
      "The \"3\" code indicates motor circuit has a short circuit.", //
      "Check motor wiring connections. If they are good, swap the brake and motor leads on the motor controller.", //
      "If the code changes to \"1,\" change the motor. The last option is to change the motor controller.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_4: {
    id: 'code_4',
    botMessage: [ "Is the Diagnostic Code a \"4\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "motor_circuit_open" },
      { text: "No", nextStep: "code_5" }
    ]
  },

  motor_circuit_open: {
    id: 'motor_circuit_open',
    botMessage: [
      "The \"4\" code indicates the motor circuit is open.", //
      "Check the motor wire connections, if they appear to be good, swap the motor and brake leads at the motor controller.", //
      "If code changes to \"2\" replace the motor. If the code stays a \"4\" the last option is the motor controller.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_5: {
    id: 'code_5',
    botMessage: [ "Is the Diagnostic Code a \"5\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "motor_controller_fault" },
      { text: "No", nextStep: "code_6" }
    ]
  },

  motor_controller_fault: {
    id: 'motor_controller_fault',
    botMessage: [
      "The \"5\" code indicates the motor controller is detecting a fault in the throttle circuit.", //
      "Check to ensure the handle cable is securely connected to the receptacle under the throttle enclosure. If the handle cable is securely connected to the throttle enclosure, check to make sure the handle cable is in good shape with no kinks or cuts the entire length of the cable back to the motor controller.", //
      "Check to make the throttle lever moves freely and returns to the neutral position. The last option is to replace the throttle enclosure.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_6: {
    id: 'code_6',
    botMessage: [ "Is the Diagnostic Code a \"6\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "over_temp" },
      { text: "No", nextStep: "code_7" }
    ]
  },

  over_temp: {
    id: 'over_temp',
    botMessage: [
      "The \"6\" code indicates an over-temperature condition.", //
      "Allow the Amigo to sit idle for 15 minutes and then restart to see if the code disappears. If the code is still there, replace the motor controller.", //
      "If the code disappears, start driving the Amigo but check to make sure the brake is releasing properly so it is not causing excessive amperage draw. If the brake is not releasing you should be able to hear a sound near the transaxle that sounds like something is dragging.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_7: {
    id: 'code_7',
    botMessage: [ "Is the Diagnostic Code a \"8\"?" ], // Note: Document seems to have a typo, asking for 8.
    userOptions: [
      { text: "Yes", nextStep: "battery_charger_cycle" },
      { text: "No", nextStep: "code_8" }
    ]
  },

  battery_charger_cycle: {
    id: 'battery_charger_cycle',
    botMessage: [
      "The \"7\" code will only appear after an extended period of charging. It indicates the battery charger is not dropping into float mode to end the battery charge cycle.", //
      "Replace the Dc charger cable, if the code still appears replace the battery charger.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  code_8: {
    id: 'code_8',
    botMessage: [ "Is the Diagnostic Code a \"8\"?" ], //
    userOptions: [
      { text: "Yes", nextStep: "motor_controller_3_faults" }
    ]
  },

  motor_controller_3_faults: {
    id: 'motor_controller_3_faults',
    botMessage: [
      "The \"8\" code indicates the motor controller detected one of three faults during start-up.", //
      "First, check the batteries to ensure they are fully charged, and load test them. If the batteries are ok, replace the motor controller.", //
      "Do you need to order parts?" //
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },
};