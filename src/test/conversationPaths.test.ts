import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { chatReducer, type ChatState, type ChatAction, type FlowType } from '@/hooks/useChat';
import { buildCompleteGraph, enumeratePaths, type ConversationPath, getPathDescription } from '@/test/conversationGraph';
import type { ProductInfo } from '@/services/serialNumberService';

// Mock the services
vi.mock('@/services/serialNumberService');
vi.mock('@/lib/logger');

interface TestResult {
  pathIndex: number;
  pathDescription: string;
  success: boolean;
  error?: string;
  finalState?: {
    currentStepId: string | null;
    isTyping: boolean;
    activeFlowType: FlowType | null;
    historyLength: number;
  };
  executionTime: number;
}

// Build conversation graph and paths at module level
console.log('Building conversation graph and enumerating paths...');
const startTime = Date.now();
const graph = buildCompleteGraph();
const allPaths = enumeratePaths(graph);
const buildTime = Date.now() - startTime;
console.log(`Graph built and paths enumerated in ${buildTime}ms`);
console.log(`Total paths to test: ${allPaths.length}`);

// Log some sample paths for debugging
console.log('\nSample paths:');
allPaths.slice(0, 3).forEach((path, index) => {
  console.log(`Path ${index + 1}: ${getPathDescription(path)}`);
});

describe('Conversation Paths Integration Tests', () => {
  let testResults: TestResult[] = [];
  
  console.log(`Starting integration tests for ${allPaths.length} conversation paths...`);
  console.log(`Estimated completion time: ${Math.ceil(allPaths.length * 10 / 1000)} seconds`);
  console.log(`Progress will be shown every 50 tests\n`);

  afterAll(() => {
    // Generate comprehensive test summary
    const summary = {
      totalPaths: allPaths.length,
      successfulPaths: testResults.filter(r => r.success).length,
      failedPaths: testResults.filter(r => !r.success).length,
      averageExecutionTime: testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length,
      failureReasons: testResults
        .filter(r => !r.success)
        .reduce((acc, r) => {
          const reason = r.error || 'Unknown error';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      pathsByFlow: testResults.reduce((acc, r) => {
        const flowType = r.finalState?.activeFlowType || 'unknown';
        acc[flowType] = (acc[flowType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      testResults: testResults.map(r => ({
        pathIndex: r.pathIndex,
        pathDescription: r.pathDescription,
        success: r.success,
        error: r.error,
        finalStepId: r.finalState?.currentStepId,
        executionTime: r.executionTime
      }))
    };

    console.log('\n=== CONVERSATION PATHS TEST SUMMARY ===');
    console.log(JSON.stringify(summary, null, 2));
    
    // Also log failures for easier debugging
    const failures = testResults.filter(r => !r.success);
    if (failures.length > 0) {
      console.log('\n=== FAILED PATHS DETAILS ===');
      failures.forEach(failure => {
        console.log(`\nPath ${failure.pathIndex}: ${failure.pathDescription}`);
        console.log(`Error: ${failure.error}`);
        console.log(`Final State: ${JSON.stringify(failure.finalState, null, 2)}`);
      });
    }
  });

  it.each(allPaths.map((path, index) => ({ path, index })))(
    'should successfully execute conversation path $index',
    async ({ path, index }) => {
      const startTime = Date.now();
      
      // Progress logging
      if (index % 50 === 0 || index < 10) {
        const progress = ((index / allPaths.length) * 100).toFixed(1);
        console.log(`\nTesting path ${index + 1}/${allPaths.length} (${progress}%)`);
        console.log(`Path: ${getPathDescription(path).substring(0, 100)}${getPathDescription(path).length > 100 ? '...' : ''}`);
      }
      
      let testResult: TestResult = {
        pathIndex: index,
        pathDescription: getPathDescription(path),
        success: false,
        executionTime: 0
      };

      try {
        // Initialize state - start with widget opened
        let state: ChatState = {
          uiState: 'modal',
          history: [{
            id: 'init',
            sender: 'agent',
            text: "Hello, I'm Amigo Mobility's virtual assistant. To best help you, please provide your product's serial number or select an option below.",
            timestamp: new Date()
          }],
          inputValue: '',
          isTyping: false,
          productInfo: null,
          activeFlow: null,
          currentStepId: null,
        };

        // Execute each step in the path
        for (let stepIndex = 0; stepIndex < path.length; stepIndex++) {
          const pathStep = path[stepIndex];
          let action: ChatAction;

          // Determine the action to dispatch based on the path step
          switch (pathStep.action) {
            case 'SELECT_OPTION':
              if (!pathStep.buttonText) {
                throw new Error(`Missing buttonText for SELECT_OPTION at step ${stepIndex}`);
              }
              
              // First dispatch the selection
              action = { type: 'SELECT_OPTION', payload: { text: pathStep.buttonText } };
              state = chatReducer(state, action);
              
              // Then process the bot response after a simulated delay
              await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async delay
              
              // Find the next step ID from the current step's options
              const currentFlow = state.activeFlow;
              const currentStep = currentFlow?.[state.currentStepId!];
              const selectedOption = currentStep?.userOptions?.find(opt => opt.text === pathStep.buttonText);
              
              if (selectedOption) {
                const processAction: ChatAction = { 
                  type: 'PROCESS_BOT_RESPONSE', 
                  payload: { nextStepId: selectedOption.nextStep } 
                };
                state = chatReducer(state, processAction);
              }
              break;

            case 'SUBMIT_INPUT':
              // Set input value first
              state = chatReducer(state, { type: 'SET_INPUT_VALUE', payload: 'test input' });
              
              // Then submit
              action = { type: 'SUBMIT_INPUT' };
              state = chatReducer(state, action);
              break;

            case 'SERIAL_LOOKUP_SUCCESS':
              // Mock successful serial lookup
              const mockProductInfo: ProductInfo = {
                model: pathStep.condition?.includes('smartShopper') ? 'SmartShopper' :
                       pathStep.condition?.includes('valueShopper') ? 'ValueShopper' :
                       pathStep.condition?.includes('vista') ? 'Vista' :
                       pathStep.condition?.includes('maxCR') ? 'Max CR' : 'SmartShopper',
                serialNumber: 'AMI1234567'
              };
              
              const flowType: FlowType = pathStep.condition?.includes('smartShopper') ? 'smartShopper' :
                                       pathStep.condition?.includes('valueShopper') ? 'valueShopper' :
                                       pathStep.condition?.includes('vista') ? 'vista' :
                                       pathStep.condition?.includes('maxCR') ? 'maxCR' : 'smartShopper';
              
              action = { 
                type: 'SERIAL_LOOKUP_SUCCESS', 
                payload: { productInfo: mockProductInfo, flowType } 
              };
              state = chatReducer(state, action);
              break;

            case 'SERIAL_LOOKUP_FAILURE':
              action = { type: 'SERIAL_LOOKUP_FAILURE' };
              state = chatReducer(state, action);
              break;

            default:
              throw new Error(`Unknown action type: ${pathStep.action}`);
          }

          // Validate state after each step
          if (state.history.length === 0) {
            throw new Error(`History is empty after step ${stepIndex}`);
          }
        }

        // Final assertions
        expect(state.isTyping).toBe(false);
        
        // For paths that end in terminal nodes, currentStepId should be set
        if (path.length > 0) {
          const lastStep = path[path.length - 1];
          
          // Check if we reached a terminal step (steps that typically end conversations)
          const terminalSteps = [
            'order_parts', 'end_conversation', 'contact_agent',
            'replace_cord_reel', 'charge_batteries_or_replace', 'replace_battery_charger_1',
            'replace_batteries', 'replace_battery_charger_2', 'charge_batteries_try_again',
            'one_of_three_issues', 'motor_controller_signal', 'em_brake_circuit',
            'em_brake_open', 'motor_circuit', 'motor_circuit_open', 'motor_controller_fault',
            'over_temp', 'battery_charger_cycle', 'motor_controller_3_faults'
          ];
          
          if (terminalSteps.includes(lastStep.stepId)) {
            expect(state.currentStepId).toBe(lastStep.stepId);
          } else {
            expect(state.currentStepId).not.toBeNull();
          }
        }

        // Ensure we have some conversation history
        expect(state.history.length).toBeGreaterThan(0);

        testResult.success = true;
        testResult.finalState = {
          currentStepId: state.currentStepId,
          isTyping: state.isTyping,
          activeFlowType: state.activeFlow ? getFlowTypeFromFlow(state.activeFlow) : null,
          historyLength: state.history.length
        };

      } catch (error) {
        testResult.success = false;
        testResult.error = error instanceof Error ? error.message : String(error);
        testResult.finalState = {
          currentStepId: null,
          isTyping: false,
          activeFlowType: null,
          historyLength: 0
        };
      } finally {
        testResult.executionTime = Date.now() - startTime;
        testResults.push(testResult);
        
        // Log completion and batch progress
        if (index % 50 === 49 || index === allPaths.length - 1) {
          const completed = testResults.length;
          const successful = testResults.filter(r => r.success).length;
          const failed = testResults.filter(r => !r.success).length;
          const avgTime = testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length;
          console.log(`Batch complete: ${successful} passed, ${failed} failed (avg: ${avgTime.toFixed(0)}ms per test)`);
        }
      }

      // Assert the test passed
      if (!testResult.success) {
        console.log(`FAILED - Path ${index + 1} failed: ${testResult.error}`);
        throw new Error(`Path execution failed: ${testResult.error}`);
      } else if (index % 50 === 0 || index < 10) {
        console.log(`PASSED - Path ${index + 1} passed (${testResult.executionTime}ms)`);
      }
    }
  );
});

// Helper function to determine flow type from flow object
function getFlowTypeFromFlow(flow: any): FlowType {
  // This is a simple heuristic - in a real implementation you might want to add
  // flow identification metadata to each flow object
  if (flow.greeting?.botMessage?.includes?.('SmartShopper')) return 'smartShopper';
  if (flow.greeting?.botMessage?.includes?.('ValueShopper')) return 'valueShopper';
  if (flow.greeting?.botMessage?.includes?.('Vista')) return 'vista';
  if (flow.greeting?.botMessage?.includes?.('Max CR')) return 'maxCR';
  if (flow.contact_agent) return 'contactAgent';
  if (flow.end_conversation) return 'endConversation';
  return 'general';
}

// Additional test suite for edge cases and error conditions
describe('Conversation Paths Edge Cases', () => {
  it('should handle empty path gracefully', () => {
    const initialState: ChatState = {
      uiState: 'modal',
      history: [],
      inputValue: '',
      isTyping: false,
      productInfo: null,
      activeFlow: null,
      currentStepId: null,
    };

    // Should not throw with empty path
    expect(() => {
      chatReducer(initialState, { type: 'OPEN_WIDGET' });
    }).not.toThrow();
  });

  it('should handle invalid step transitions', () => {
    const initialState: ChatState = {
      uiState: 'modal',
      history: [],
      inputValue: '',
      isTyping: false,
      productInfo: null,
      activeFlow: null,
      currentStepId: null,
    };

    // Should handle invalid next step gracefully
    const result = chatReducer(initialState, { 
      type: 'PROCESS_BOT_RESPONSE', 
      payload: { nextStepId: 'nonexistent_step' } 
    });

    expect(result.isTyping).toBe(false);
  });

  it('should handle serial lookup with various inputs', () => {
    const initialState: ChatState = {
      uiState: 'modal',
      history: [],
      inputValue: 'AMI1234567',
      isTyping: true,
      productInfo: null,
      activeFlow: null,
      currentStepId: 'ask_for_serial_number',
    };

    // Test successful lookup
    const mockProductInfo: ProductInfo = {
      model: 'SmartShopper',
      serialNumber: 'AMI1234567'
    };

    const successResult = chatReducer(initialState, {
      type: 'SERIAL_LOOKUP_SUCCESS',
      payload: { productInfo: mockProductInfo, flowType: 'smartShopper' }
    });

    expect(successResult.productInfo).toEqual(mockProductInfo);
    expect(successResult.isTyping).toBe(false);

    // Test failed lookup
    const failureResult = chatReducer(initialState, {
      type: 'SERIAL_LOOKUP_FAILURE'
    });

    expect(failureResult.productInfo).toBeNull();
    expect(failureResult.isTyping).toBe(false);
  });
});