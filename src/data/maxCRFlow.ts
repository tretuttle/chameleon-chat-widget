import type { ConversationFlow } from '@/types';
// This flow is based on "Max CR TSG for Chatbot - DONE.docx"
export const maxCRFlow: ConversationFlow = {
  // Entry point from general flow when Max CR is selected
  start_maxcr_flow: {
    id: 'start_maxcr_flow',
    botMessage: [
      "Great choice! I'll help you troubleshoot your Max CR cart.",
      "What seems to be the issue with your Max CR?"
    ],
    userOptions: [
      { text: "My Max CR turns on, but the charger will not turn on or the batteries do not hold a charge", nextStep: "step_for_max_cr_battery_troubleshooting_info" },
      { text: "My Max CR will not move", nextStep: "step_for_max_cr_wont_move_info" },
      { text: "My Max CR remote won't pair", nextStep: "step_for_max_cr_remote_pairing_info" },
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
      { text: "My Max CR turns on, but the charger will not turn on or the batteries do not hold a charge.", nextStep: "step_for_max_cr_battery_troubleshooting_info" },
      { text: "My Max CR will not move", nextStep: "step_for_max_cr_wont_move_info" },
      { text: "My Max CR remote won’t pair", nextStep: "step_for_max_cr_remote_pairing_info" },
      { text: "I have a different customer service need.", nextStep: "contact_agent" }
    ]
  },

  // Battery troubleshooting split into info/question
  step_for_max_cr_battery_troubleshooting_info: {
    id: 'step_for_max_cr_battery_troubleshooting_info',
    botMessage: [
      "First, connect the AC cord to the wall outlet."
    ],
    userOptions: [
      { text: "Continue", nextStep: "step_for_max_cr_battery_troubleshooting_question" }
    ]
  },
  step_for_max_cr_battery_troubleshooting_question: {
    id: 'step_for_max_cr_battery_troubleshooting_question',
    botMessage: [
      "Does the battery display on the throttle enclosure flash for 10-30 seconds before going solid?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "measure_battery_voltage_1_info" },
      { text: "No", nextStep: "ac_cord_illumination" }
    ]
  },

  // Measure battery voltage split
  measure_battery_voltage_1_info: {
    id: 'measure_battery_voltage_1_info',
    botMessage: [
      "Disconnect the AC cord from the wall outlet and measure and record the voltage on the battery. Then connect the AC cord into the wall outlet and let the batteries charge for two minutes. After they have charged, measure the battery voltage."
    ],
    userOptions: [
      { text: "Continue", nextStep: "measure_battery_voltage_1_question" }
    ]
  },
  measure_battery_voltage_1_question: {
    id: 'measure_battery_voltage_1_question',
    botMessage: [
      "Has it increased to a minimum of 25 volts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_battery_1_info" },
      { text: "No", nextStep: "replace_battery_charger_1_info" }
    ]
  },

  // Replace battery charger split
  replace_battery_charger_1_info: {
    id: 'replace_battery_charger_1_info',
    botMessage: [
      "The battery charger is not outputting the proper DC voltage, and it will need to be replaced. Replace the battery charger with P/N 12499.22-Charger for AGM or P/N 12499.23-Charger for Lithium."
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

  // Replace battery split
  replace_battery_1_info: {
    id: 'replace_battery_1_info',
    botMessage: [
      "The charger is operating properly. The battery/batteries have reached a state where they can no longer hold a charge and should be replaced."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_battery_1_order" }
    ]
  },
  replace_battery_1_order: {
    id: 'replace_battery_1_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  ac_cord_illumination: {
    id: 'ac_cord_illumination',
    botMessage: [
      "Does the AC cord end illuminate?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "charger_troubleshooting" },
      { text: "No", nextStep: "wall_outlet_info" }
    ]
  },

  // Wall outlet split
  wall_outlet_info: {
    id: 'wall_outlet_info',
    botMessage: [
      "Check to see if the wall outlet is working. If the wall outlet is working, replace the AC cord."
    ],
    userOptions: [
      { text: "Continue", nextStep: "wall_outlet_order" }
    ]
  },
  wall_outlet_order: {
    id: 'wall_outlet_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  charger_troubleshooting: {
    id: 'charger_troubleshooting',
    botMessage: [
      "This indicates the charger is not turning on. Use the following steps to determine why it will not turn on.",
      "Check the 13084-IEC Receptacle for continuity."
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "measure_battery_voltage_2" },
      { text: "No continuity", nextStep: "replace_receptacle_info" }
    ]
  },

  // Replace receptacle split
  replace_receptacle_info: {
    id: 'replace_receptacle_info',
    botMessage: [
      "You need to replace the 13084-IEC Receptacle."
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

  measure_battery_voltage_2: {
    id: 'measure_battery_voltage_2',
    botMessage: [
      "If you have AGM batteries, measure the voltage on both batteries in the series; they must have a minimum combined voltage of 16-volts. If you have a single lithium battery, it must have a minimum voltage of 21-volts."
    ],
    userOptions: [
      { text: "Batteries under voltage", nextStep: "replace_fuse_1_info" },
      { text: "Batteries have minimum required voltage", nextStep: "remove_fuse_check_continuity" }
    ]
  },

  // Replace fuse 1 split
  replace_fuse_1_info: {
    id: 'replace_fuse_1_info',
    botMessage: [
      "Replace the fuse with a 25A 250V replacement."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_fuse_1_order" }
    ]
  },
  replace_fuse_1_order: {
    id: 'replace_fuse_1_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  remove_fuse_check_continuity: {
    id: 'remove_fuse_check_continuity',
    botMessage: [
      "Remove the fuse and check continuity."
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "replace_battery_charger_2_info" },
      { text: "No continuity", nextStep: "replace_fuse_2_info" }
    ]
  },

  // Replace battery charger 2 split
  replace_battery_charger_2_info: {
    id: 'replace_battery_charger_2_info',
    botMessage: [
      "Replace the 12499.21 battery charger if the batteries are AGM. Replace the 12499.22 battery charger if the battery is lithium."
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

  // Replace fuse 2 split
  replace_fuse_2_info: {
    id: 'replace_fuse_2_info',
    botMessage: [
      "Replace the fuse with a 25A 250V replacement."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_fuse_2_order" }
    ]
  },
  replace_fuse_2_order: {
    id: 'replace_fuse_2_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Move issue split
  step_for_max_cr_wont_move_info: {
    id: 'step_for_max_cr_wont_move_info',
    botMessage: [
      "First, turn the Max CR key on."
    ],
    userOptions: [
      { text: "Continue", nextStep: "step_for_max_cr_wont_move_question" }
    ]
  },
  step_for_max_cr_wont_move_question: {
    id: 'step_for_max_cr_wont_move_question',
    botMessage: [
      "Does the battery display or diagnostic code window on the throttle enclosure illuminate when the key is turned on?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "battery_display" },
      { text: "No", nextStep: "test_battery_voltage_info" }
    ]
  },

  battery_display: {
    id: 'battery_display',
    botMessage: [
      "Is the battery display flashing rapidly?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "belly_switch_info" },
      { text: "No", nextStep: "numeral_2" }
    ]
  },

  // Belly switch split
  belly_switch_info: {
    id: 'belly_switch_info',
    botMessage: [
      "Is the belly switch pushed in? Rotate the switch clockwise a quarter turn to release it. If this does not resolve the problem, check to make sure the 13147.20-Belly Switch asm is connected to the 13059-Breakout PCB."
    ],
    userOptions: [
      { text: "Continue", nextStep: "belly_switch_question" }
    ]
  },
  belly_switch_question: {
    id: 'belly_switch_question',
    botMessage: [
      "Did either of these two procedures clear the rapid flashing?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "problem_resolved" },
      { text: "No", nextStep: "disconnect_belly_switch_info" }
    ]
  },

  problem_resolved: {
    id: 'problem_resolved',
    botMessage: [
      "Your problem has been resolved."
    ],
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },

  // Disconnect belly switch split
  disconnect_belly_switch_info: {
    id: 'disconnect_belly_switch_info',
    botMessage: [
      "Disconnect the 13147.20-Belly Switch asm from the 13059-Breakout PCB. Using a wire jumper, jumper across the two pins where you just disconnected the Belly Switch asm."
    ],
    userOptions: [
      { text: "Continue", nextStep: "disconnect_belly_switch_question" }
    ]
  },
  disconnect_belly_switch_question: {
    id: 'disconnect_belly_switch_question',
    botMessage: [
      "Did this clear the rapid flashing?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_belly_switch_info" },
      { text: "No", nextStep: "replace_pcb_info" }
    ]
  },

  // Replace belly switch split
  replace_belly_switch_info: {
    id: 'replace_belly_switch_info',
    botMessage: [
      "Replace the 13147.20-Belly Switch Asm."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_belly_switch_order" }
    ]
  },
  replace_belly_switch_order: {
    id: 'replace_belly_switch_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Replace PCB split
  replace_pcb_info: {
    id: 'replace_pcb_info',
    botMessage: [
      "Replace the 13059-Breakout PCB."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_pcb_order" }
    ]
  },
  replace_pcb_order: {
    id: 'replace_pcb_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  numeral_2: {
    id: 'numeral_2',
    botMessage: [
      "Is the numeral “2” illuminated in the diagnostic window?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "brake_circuit_info" },
      { text: "No", nextStep: "diagnostic_code_guide" }
    ]
  },

  diagnostic_code_guide: {
    id: 'diagnostic_code_guide',
    botMessage: [
      "Use the Amigo Diagnostic Code Guide to review the next steps to take to replace the component causing the diagnostic code."
    ],
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },

  // Brake circuit split
  brake_circuit_info: {
    id: 'brake_circuit_info',
    botMessage: [
      "This indicates the brake circuit is open. Turn the key off, check to make sure the freewheel lever in front of the Max CR is in the Normal position, and turn the key back on.",
      "If the \"2\" code is still illuminated, check the continuity on the brake wiring. If the wires are good, replace the 13077-Brake Wire Harness."
    ],
    userOptions: [
      { text: "Continue", nextStep: "brake_circuit_order" }
    ]
  },
  brake_circuit_order: {
    id: 'brake_circuit_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Test battery voltage split
  test_battery_voltage_info: {
    id: 'test_battery_voltage_info',
    botMessage: [
      "Remove the top to the power box and test the battery voltage at the controller."
    ],
    userOptions: [
      { text: "Continue", nextStep: "test_battery_voltage_question" }
    ]
  },
  test_battery_voltage_question: {
    id: 'test_battery_voltage_question',
    botMessage: [
      "Is the battery voltage greater than 21 volts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "wiring_connections_info" },
      { text: "No", nextStep: "recharge_batteries_info" }
    ]
  },

  // Recharge batteries split
  recharge_batteries_info: {
    id: 'recharge_batteries_info',
    botMessage: [
      "Recharge the battery/batteries, allowing them to go through a completed charge cycle.",
      "If the cart still has no power, you will need to replace the 12402-Battery (Lithium) or 12947-Batteries (AGM Type)."
    ],
    userOptions: [
      { text: "Continue", nextStep: "recharge_batteries_question" }
    ]
  },
  recharge_batteries_question: {
    id: 'recharge_batteries_question',
    botMessage: [
      "Is there continuity?"
    ],
    userOptions: [
      { text: "Yes continuity", nextStep: "measure_voltage_3" },
      { text: "No power", nextStep: "replace_battery_2" }
    ]
  },

  measure_voltage_3: {
    id: 'measure_voltage_3',
    botMessage: [
      "If you have AGM batteries, measure the voltage on both batteries in series; they must have a minimum combined voltage of 16 volts.",
      "If you have a single lithium battery it must have a minimum voltage of 21 volts."
    ],
    userOptions: [
      { text: "Batteries under voltage", nextStep: "replace_batteries_3_info" },
      { text: "Batteries have minimum required voltage", nextStep: "check_leds" }
    ]
  },

  // Replace batteries 3 split
  replace_batteries_3_info: {
    id: 'replace_batteries_3_info',
    botMessage: [
      "You need to replace the batteries."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_batteries_3_order" }
    ]
  },
  replace_batteries_3_order: {
    id: 'replace_batteries_3_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  check_leds: {
    id: 'check_leds',
    botMessage: [
      "Check the LEDs on the battery charger. They should be either solid red, red & yellow flashing, or green. If they are, the charger is working."
    ],
    userOptions: [
      { text: "LEDs illuminate", nextStep: "charge_batteries_replace_if_needed" },
      { text: "No LEDs illuminate on the battery charger or just the red LED is flashing", nextStep: "remove_fuse_check_continuity_2" }
    ]
  },

  charge_batteries_replace_if_needed: {
    id: 'charge_batteries_replace_if_needed',
    botMessage: [
      "Allow the batteries to fully charge. If they do not have enough capacity to run the cart for 8 hours, replace the batteries."
    ],
    userOptions: [
      { text: "Continue", nextStep: "end_conversation" }
    ]
  },

  remove_fuse_check_continuity_2: {
    id: 'remove_fuse_check_continuity_2',
    botMessage: [
      "Remove the fuse and check continuity."
    ],
    userOptions: [
      { text: "No continuity", nextStep: "replace_fuse_3_info" },
      { text: "Yes continuity", nextStep: "replace_battery_charger_3_info" }
    ]
  },

  // Replace fuse 3 split
  replace_fuse_3_info: {
    id: 'replace_fuse_3_info',
    botMessage: [
      "Replace the fuse with a 25A 250V replacement."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_fuse_3_order" }
    ]
  },
  replace_fuse_3_order: {
    id: 'replace_fuse_3_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Replace battery charger 3 split
  replace_battery_charger_3_info: {
    id: 'replace_battery_charger_3_info',
    botMessage: [
      "Replace the 12499.21-battery charger if the batteries are AGM. Replace the 12499.22-battery charger if the battery is lithium."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_battery_charger_3_order" }
    ]
  },
  replace_battery_charger_3_order: {
    id: 'replace_battery_charger_3_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Wiring connections split
  wiring_connections_info: {
    id: 'wiring_connections_info',
    botMessage: [
      "Check to ensure all wiring connections from the handle enclosure, breakout board, and controller are securely connected. Measure the battery voltage at the controller. It should match the battery voltage measured at the battery/batteries."
    ],
    userOptions: [
      { text: "Continue", nextStep: "wiring_connections_question" }
    ]
  },
  wiring_connections_question: {
    id: 'wiring_connections_question',
    botMessage: [
      "Are wires secure and battery at the controller? Does voltage at the battery/batteries match the voltage at the battery?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "substitute_parts_info" },
      { text: "No", nextStep: "check_circuit_breaker_continuity_info" }
    ]
  },

  // Substitute parts split
  substitute_parts_info: {
    id: 'substitute_parts_info',
    botMessage: [
      "Substitute the following parts in order until the faulty part is found:",
      "1. 8969-Handle cable.",
      "2. 8223.25-Throttle Asm.",
      "3. 12933CR-Controller."
    ],
    userOptions: [
      { text: "Continue", nextStep: "substitute_parts_order" }
    ]
  },
  substitute_parts_order: {
    id: 'substitute_parts_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Check circuit breaker split
  check_circuit_breaker_continuity_info: {
    id: 'check_circuit_breaker_continuity_info',
    botMessage: [
      "Check to make sure there is continuity through the 12661-Circuit Breaker."
    ],
    userOptions: [
      { text: "Continue", nextStep: "check_circuit_breaker_continuity_question" }
    ]
  },
  check_circuit_breaker_continuity_question: {
    id: 'check_circuit_breaker_continuity_question',
    botMessage: [
      "Is there continuity?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "replace_harness_battery_harness_info" },
      { text: "No", nextStep: "replace_circuit_breaker_info" }
    ]
  },

  // Replace harness split
  replace_harness_battery_harness_info: {
    id: 'replace_harness_battery_harness_info',
    botMessage: [
      "Replace the 11190-Harness (2 pieces) and the 13093-Battery Harness."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_harness_battery_harness_order" }
    ]
  },
  replace_harness_battery_harness_order: {
    id: 'replace_harness_battery_harness_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Replace circuit breaker split
  replace_circuit_breaker_info: {
    id: 'replace_circuit_breaker_info',
    botMessage: [
      "Replace the 12661-Circuit Breaker."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_circuit_breaker_order" }
    ]
  },
  replace_circuit_breaker_order: {
    id: 'replace_circuit_breaker_order',
    botMessage: [
      "Do you need to order parts?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  // Remote pairing split
  step_for_max_cr_remote_pairing_info: {
    id: 'step_for_max_cr_remote_pairing_info',
    botMessage: [
      "Attempt the pairing process. Turn the Max CR and the remote on. Press the \"STOP\" button on the remote for 10 seconds. The power button on the remote will flash blue. Press and hold the pairing button on the Max CR until the horn sounds."
    ],
    userOptions: [
      { text: "Continue", nextStep: "step_for_max_cr_remote_pairing_question" }
    ]
  },
  step_for_max_cr_remote_pairing_question: {
    id: 'step_for_max_cr_remote_pairing_question',
    botMessage: [
      "Does the Max CR now respond to the remote?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "try_3_steps" },
      { text: "No", nextStep: "press_power_button_info" }
    ]
  },

  try_3_steps: {
    id: 'try_3_steps',
    botMessage: [
      "If the remote only loses connection with the Max CR intermittently there are 3 steps to try:",
      "1. Attempt to pair the remote in the exact location where the connection is lost. The remote is designed to search for the clearest communication channel if there is interference from other devices.",
      "2. If the remote works well when you are close to the Max CR but consistently loses connectivity if you get to the end of the line of carts, replace the 13147.20-Antenna.",
      "3. If the Max CR will not respond when only pushing specific buttons on the remote, the membrane on the remote does not contact properly and needs to be replaced."
    ],
    userOptions: [
      { text: "I need to replace the antenna and need to order parts", nextStep: "order_parts" },
      { text: "I need to replace the remote membrane and need to order parts", nextStep: "order_parts" },
      { text: "I need to replace a part, but I don’t need to order anything", nextStep: "end_conversation" },
      { text: "None of these options", nextStep: "contact_agent" }
    ]
  },

  // Press power button split
  press_power_button_info: {
    id: 'press_power_button_info',
    botMessage: [
      "OK. Press the power button on the remote."
    ],
    userOptions: [
      { text: "Continue", nextStep: "press_power_button_question" }
    ]
  },
  press_power_button_question: {
    id: 'press_power_button_question',
    botMessage: [
      "Does it illuminate green?"
    ],
    userOptions: [
      { text: "No", nextStep: "replace_aa_batteries_info" },
      { text: "Yes", nextStep: "inspect_wiring" }
    ]
  },

  inspect_wiring: {
    id: 'inspect_wiring',
    botMessage: [
      "Inspect all the wiring running between the receiver board and the breakout board. If the wiring is good, first replace the 12344-recevier board, if that doesn't resolve the problem replace the 13059-breakout board."
    ],
    userOptions: [
      { text: "I need to order parts", nextStep: "order_parts" }
    ]
  },

  // Replace AA batteries split
  replace_aa_batteries_info: {
    id: 'replace_aa_batteries_info',
    botMessage: [
      "Replace the batteries in the remote with four new lithium AA batteries or recharge the batteries if you have a remote with the rechargeable option."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_aa_batteries_question" }
    ]
  },
  replace_aa_batteries_question: {
    id: 'replace_aa_batteries_question',
    botMessage: [
      "Press the remote power button, does it illuminate green?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "step_for_max_cr_remote_pairing_info" },
      { text: "No", nextStep: "replace_remote_info" }
    ]
  },

  // Replace remote split
  replace_remote_info: {
    id: 'replace_remote_info',
    botMessage: [
      "You need to replace the remote."
    ],
    userOptions: [
      { text: "Continue", nextStep: "replace_remote_order" }
    ]
  },
  replace_remote_order: {
    id: 'replace_remote_order',
    botMessage: [
      "Do you want to order a new one?"
    ],
    userOptions: [
      { text: "Yes", nextStep: "order_parts" },
      { text: "No", nextStep: "end_conversation" }
    ]
  },

  order_parts: {
    id: 'order_parts',
    botMessage: [
      "I'll connect you with our parts department to help you order the required components. They'll make sure you get exactly what you need for your Max CR!"
    ],
    userOptions: [
      { text: "Continue", nextStep: "contact_agent" }
    ]
  }
};