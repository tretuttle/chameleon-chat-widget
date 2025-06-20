# Testing Strategy for Chameleon Chat Widget

## Overview

The Chameleon Chat Widget employs a comprehensive two-layer testing strategy to ensure robust coverage of all conversation flows and user interactions. This approach combines automated unit testing of the state machine logic with end-to-end UI testing to validate the complete user experience.

## Two-Layer Testing Architecture

### Layer 1: Data-Driven Reducer Testing (Unit Level)
- **Purpose**: Exhaustively test every possible conversation path through the chat flows
- **Technology**: Vitest with parameterized tests
- **Coverage**: All state transitions, cross-flow navigation, error handling, and edge cases
- **Execution**: Fast, deterministic, runs on every commit

### Layer 2: End-to-End UI Testing (Integration Level)
- **Purpose**: Validate critical user journeys and UI interactions
- **Technology**: Playwright with browser automation
- **Coverage**: Key conversation paths, serial number lookup, cross-flow scenarios
- **Execution**: Slower, runs on pull requests and releases

## Running Tests

### Development Workflow
```bash
# Run all unit tests
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run tests with UI for debugging
npm run test:ui

# Run end-to-end tests
npm run test:e2e

# Run e2e tests in headed mode for debugging
npm run test:e2e -- --headed
```

### Continuous Integration
Tests are automatically executed in the following scenarios:
- **Pre-commit**: Unit tests run via Husky hooks
- **Pull Request**: Full test suite including e2e tests
- **Pre-push**: Complete unit test suite
- **Release**: Full regression testing

## Test Structure and Implementation

### Conversation Graph Builder
The testing framework automatically discovers and maps all conversation flows:

```typescript
// Automatically imports all *Flow.ts files
// Builds adjacency graph of all conversation steps
// Injects cross-flow edges based on flowMap configuration
// Enumerates all possible acyclic paths from entry to terminal nodes
```

### Path Enumeration Strategy
- **Entry Points**: Each flow's `greeting` step or designated start step
- **Terminal Nodes**: Steps with no `userOptions` or `nextStep` properties
- **Cross-Flow Navigation**: Automatically detected via `crossFlowMap` in useChat
- **Cycle Prevention**: DFS algorithm prevents infinite loops while exploring paths

### Reducer Test Harness
Each discovered path is tested by:
1. Initializing clean state with appropriate flow
2. Dispatching sequence of actions corresponding to path steps
3. Asserting final state properties (currentStepId, isTyping, etc.)
4. Capturing and reporting any exceptions or assertion failures

## Mock Strategy

### Serial Number Service Mock
```typescript
// Provides deterministic responses for testing
selectSuccess(model: string) // Returns valid ProductInfo
selectFailure() // Simulates lookup failure
```

### Logger Mock
```typescript
// Suppresses console output during tests
// Provides spies for asserting log calls
// Maintains call history for debugging
```

### DOM and Browser API Mocks
- `window.confirm` → Always returns true for consistent testing
- `Element.prototype.scrollIntoView` → No-op to prevent test errors
- Fake timers for controlling async behavior

## Extending Tests When Flows Change

### Adding New Conversation Steps
1. **No Action Required**: The graph builder automatically discovers new steps
2. **Path Coverage**: New paths are automatically enumerated and tested
3. **Validation**: Run `npm run test` to verify new paths work correctly

### Adding New Flows
1. **File Convention**: Name new flow files with `*Flow.ts` pattern
2. **Export Convention**: Export flow object as default or named export
3. **Cross-Flow Links**: Update `crossFlowMap` in useChat.ts if needed
4. **Verification**: Graph builder will automatically include new flows

### Modifying Existing Steps
1. **Automatic Detection**: Changed botMessage or userOptions are automatically tested
2. **Breaking Changes**: Test failures will highlight incompatible changes
3. **State Validation**: Ensure new step properties don't break state assertions

### Adding New Actions or State Properties
1. **Reducer Tests**: May need updates if new state properties affect path completion
2. **Mock Updates**: Update mocks if new external dependencies are introduced
3. **Assertion Updates**: Modify final state assertions if new properties are critical

## Test Data and Fixtures

### Deterministic Serial Numbers
```typescript
// Test serial numbers with known outcomes
"AMI1234567" → SmartShopper flow
"AMI2345678" → Vista flow
"AMI3456789" → ValueShopper flow
"INVALID123" → Lookup failure
```

### Conversation Path Examples
- **Shortest Path**: greeting → contact_agent (2 steps)
- **Longest Path**: Complex diagnostic flows (15+ steps)
- **Cross-Flow**: General → Serial lookup → Model-specific flow
- **Error Recovery**: Invalid input → Retry → Success

## Troubleshooting Guide

### Common Test Failures

#### "Step not found in flow" Errors
- **Cause**: Missing step definition or incorrect nextStep reference
- **Solution**: Verify all nextStep values reference existing step IDs
- **Debug**: Check console output for specific missing step names

#### "Path enumeration timeout" Errors
- **Cause**: Circular references in conversation flow
- **Solution**: Review flow definitions for unintended cycles
- **Debug**: Enable verbose logging to see path traversal

#### Serial Number Lookup Failures
- **Cause**: Mock not properly configured or real API calls in tests
- **Solution**: Ensure `vi.mock` is properly set up in test setup
- **Debug**: Check that mocks are being called instead of real service

#### Playwright Test Timeouts
- **Cause**: Elements not appearing or slow page loads
- **Solution**: Increase timeout or add explicit waits
- **Debug**: Run with `--headed` flag to observe browser behavior

### Performance Issues

#### Slow Test Execution
- **Path Explosion**: Too many conversation paths being generated
- **Solution**: Consider path sampling or flow-specific test isolation
- **Monitoring**: Check test output for path count statistics

#### Memory Usage
- **Large State Objects**: Conversation history growing too large
- **Solution**: Clear history between path tests
- **Monitoring**: Watch for memory warnings in test output

### Debugging Techniques

#### Path Visualization
```bash
# Generate path report with step details
npm run test -- --reporter=verbose

# Output path enumeration to file
npm run test:paths > conversation-paths.json
```

#### State Inspection
```typescript
// Add debugging to specific test cases
console.log('Final state:', JSON.stringify(finalState, null, 2));
console.log('Path taken:', pathSteps.map(s => s.stepId));
```

#### Mock Verification
```typescript
// Verify mock calls in tests
expect(mockLogger.log).toHaveBeenCalledWith('Expected message');
expect(mockSerialService.lookup).toHaveBeenCalledTimes(1);
```

## Maintenance Guidelines

### Regular Maintenance Tasks
1. **Weekly**: Review test execution times and failure patterns
2. **Monthly**: Update test data and mock responses to reflect real usage
3. **Per Release**: Validate test coverage reports and add missing scenarios
4. **Quarterly**: Review and optimize path enumeration performance

### Test Quality Metrics
- **Path Coverage**: Percentage of discoverable paths tested
- **Flow Coverage**: Percentage of conversation flows with test coverage
- **State Coverage**: Percentage of reducer state properties validated
- **Error Coverage**: Percentage of error conditions tested

### Documentation Updates
- Update this document when adding new testing patterns
- Document any custom test utilities or helpers
- Maintain examples of complex test scenarios
- Keep troubleshooting guide current with new issues

## Integration with Development Workflow

### Pre-Development
- Review existing test coverage for areas being modified
- Identify potential new paths or edge cases
- Plan test updates alongside feature development

### During Development
- Run tests in watch mode for immediate feedback
- Use test failures to guide implementation
- Add focused tests for complex logic

### Post-Development
- Verify all new paths are covered
- Update documentation for any new testing patterns
- Review test performance impact

This comprehensive testing strategy ensures that every conversation path is validated, user interactions work correctly, and the chat widget maintains high quality across all supported flows and scenarios.