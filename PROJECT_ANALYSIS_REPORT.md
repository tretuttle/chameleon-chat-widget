# Chameleon Chat Widget - Project Analysis Report

## Overview

This document provides analysis and guidelines for the Chameleon Chat Widget project, focusing on conversation flow design patterns and user experience optimization.

## One-Question-Per-Step Guideline

### Rule Description

**Each conversation step must contain exactly one actionable question or decision point.**

This fundamental design principle ensures optimal user experience by:
- Reducing cognitive load on users
- Preventing confusion from multiple simultaneous choices
- Improving conversation flow clarity
- Enabling better analytics and user journey tracking

### Implementation Pattern

When refactoring compound steps, follow this pattern:

1. **Split compound steps into sequential steps:**
   - Create an `*_info` step containing instructional content
   - Create a `*_question` (or `*_order`, `*_display`, etc.) step with the single decision point

2. **Maintain flow integrity:**
   - Update upstream `nextStep` references to point to the first new step
   - Copy original `userOptions` to the question step
   - Preserve all branching logic

3. **Use descriptive IDs:**
   - Ensure new step IDs are unique within their flow file
   - Make IDs self-documenting (e.g., `step_vs_batt_led_gauge`, `check_voltage_match`)

### Examples

#### ❌ Bad: Compound Step
```typescript
{
  id: "battery_troubleshooting",
  botMessage: [
    "First, check if the AC cord is plugged in and the LED gauge shows power.",
    "Then look at the LCD display.",
    "Do both the LED gauge and LCD display show proper readings?"
  ],
  userOptions: [
    { text: "Yes", nextStep: "measure_voltage" },
    { text: "No", nextStep: "check_connections" }
  ]
}
```

#### ✅ Good: Split Steps
```typescript
{
  id: "battery_check_info",
  botMessage: [
    "First, check if the AC cord is plugged in and the LED gauge shows power.",
    "Then look at the LCD display."
  ],
  nextStep: "battery_readings_question"
},
{
  id: "battery_readings_question", 
  botMessage: [
    "Do both the LED gauge and LCD display show proper readings?"
  ],
  userOptions: [
    { text: "Yes", nextStep: "measure_voltage" },
    { text: "No", nextStep: "check_connections" }
  ]
}
```

### Common Patterns to Split

1. **Instruction + Question:**
   - Split into `*_info` → `*_question`

2. **Multiple Questions:**
   - Create separate steps for each question
   - Chain them sequentially

3. **Context + Decision:**
   - Separate explanatory content from decision points

4. **Parts Ordering:**
   - Split into `*_explanation` → `*_order`

### Affected Flow Files

This guideline has been applied across all conversation flows:

- `valueShopperFlow.ts`
- `vistaFlow.ts` 
- `smartShopperFlow.ts`
- `maxCRFlow.ts`
- `conversationFlow.ts`
- `endConversationFlow.ts`
- `contactAgentFlow.ts`

### Benefits Achieved

- **Improved UX:** Users face one clear decision at a time
- **Better Analytics:** Each decision point can be tracked independently  
- **Easier Maintenance:** Simpler step logic reduces complexity
- **Enhanced Testing:** Individual steps can be tested in isolation
- **Clearer Documentation:** Flow specifications become more readable

### Future Considerations

When adding new conversation steps:

1. Always ask: "Does this step contain more than one question?"
2. If yes, split it following the established pattern
3. Ensure step IDs remain unique within each flow file
4. Update corresponding flow specification documentation
5. Test the complete user journey after changes

This guideline ensures consistent, user-friendly conversation flows that provide clear guidance without overwhelming users with multiple simultaneous decisions.