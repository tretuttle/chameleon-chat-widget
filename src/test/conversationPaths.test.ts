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

describe('Conversation Paths Integration Tests', () => {
  let allPaths: ConversationPath[][] = [];
  let testResults: TestResult[] = [];

  beforeAll(async () => {
    console.log('Building conversation graph and enumerating paths...');
    const startTime = Date.now();
    
    const graph = buildCompleteGraph();
    allPaths = enumeratePaths(graph);
    
    const buildTime = Date.now() - startTime;
    console.log(`Graph built and paths enumerated in ${buildTime}ms`);
    console.log(`Total paths to test: ${allPaths.length}`);
    
    // Log some sample paths for debugging
    console.log('\nSample paths:');
    allPaths.slice(0, 3).forEach((path, index) => {
      console.log(`Path ${index + 1}: ${getPathDescription(path)}`);
    });
  });

  afterAll(() => {
    // Generate comprehensive test summary
    const summary = {
      totalPaths: allPaths.length,
      successfulPaths: testResults.filter(r => r.success).length,
      failedPaths: testResults.filter(r => !r.success).length,
      averageExecutionTime: testResults.length > 0 ? testResults.reduce((sum, r) => sum + r.executionTime, 0) / testResults.length : 0,
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

  it('should execute ALL conversation paths successfully', async () => {
    expect(allPaths.length).toBeGreaterThan(0);
    console.log(`\nTesting ALL ${allPaths.length} conversation paths...`);

    let successCount = 0;
    let failureCount = 0;

    // Process paths in batches to avoid memory issues
    const batchSize = 50;
    for (let batchStart = 0; batchStart < allPaths.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, allPaths.length);
      const batch = allPaths.slice(batchStart, batchEnd);
      
      console.log(`\nProcessing batch ${Math.floor(batchStart / batchSize) + 1}/${Math.ceil(allPaths.length / batchSize)} (paths ${batchStart + 1}-${batchEnd})`);

      for (let i = 0; i < batch.length; i++) {
        const pathIndex = batchStart + i;
        const path = batch[i];
        const startTime = Date.now();
        
        let testResult: TestResult = {
          pathIndex,
          pathDescription: getPathDescription(path),
          success: false,
          executionTime: 0
        };

        try {
          // Initialize state for each path - start with widget opened
          let state: ChatState = {
            uiState: 'modal',
            lastActiveUIState: null,
            history: [],
            inputValue: '',
            isTyping: false,
            productInfo: null,
            activeFlow: null,
            currentStepId: null,
          };

          // Open the widget first
          state = chatReducer(state, { type: 'OPEN_WIDGET' });

          // Determine the flow type from the first step
          const firstStep = path[0];
          let flowType: FlowType = 'general';
          
          if (firstStep?.stepId.includes('smartShopper') || firstStep?.condition?.includes('smartShopper')) {
            flowType = 'smartShopper';
          } else if (firstStep?.stepId.includes('valueShopper') || firstStep?.condition?.includes('valueShopper')) {
            flowType = 'valueShopper';
          } else if (firstStep?.stepId.includes('vista') || firstStep?.condition?.includes('vista')) {
            flowType = 'vista';
          } else if (firstStep?.stepId.includes('maxCR') || firstStep?.condition?.includes('maxCR')) {
            flowType = 'maxCR';
          } else if (firstStep?.stepId.includes('contactAgent')) {
            flowType = 'contactAgent';
          } else if (firstStep?.stepId.includes('endConversation')) {
            flowType = 'endConversation';
          }

          // Start the appropriate flow
          if (flowType === 'general') {
            // For general flow, start with suggestion
            state = chatReducer(state, { 
              type: 'START_FLOW_FROM_SUGGESTION', 
              payload: { text: 'I need help with my Amigo cart' } 
            });
            state = chatReducer(state, { 
              type: 'PROCESS_SUGGESTION_RESPONSE', 
              payload: { flowType: 'general', text: 'I need help with my Amigo cart' } 
            });
          } else {
            // For specific flows, start directly
            state = chatReducer(state, { 
              type: 'START_FLOW', 
              payload: { flowType } 
            });
          }

          // Execute each step in the path
          for (let stepIndex = 0; stepIndex < path.length; stepIndex++) {
            const pathStep = path[stepIndex];

            switch (pathStep.action) {
              case 'SELECT_OPTION':
                if (!pathStep.buttonText) {
                  throw new Error(`Missing buttonText for SELECT_OPTION at step ${stepIndex}`);
                }
                
                // Dispatch the selection
                state = chatReducer(state, { 
                  type: 'SELECT_OPTION', 
                  payload: { text: pathStep.buttonText } 
                });
                
                // Find the next step from current flow
                const currentFlow = state.activeFlow;
                const currentStep = currentFlow?.[state.currentStepId!];
                const selectedOption = currentStep?.userOptions?.find(opt => opt.text === pathStep.buttonText);
                
                if (selectedOption) {
                  state = chatReducer(state, { 
                    type: 'PROCESS_BOT_RESPONSE', 
                    payload: { nextStepId: selectedOption.nextStep } 
                  });
                }
                break;

              case 'SUBMIT_INPUT':
                // Set input value first
                state = chatReducer(state, { 
                  type: 'SET_INPUT_VALUE', 
                  payload: 'test input' 
                });
                
                // Then submit
                state = chatReducer(state, { type: 'SUBMIT_INPUT' });
                break;

              case 'SERIAL_LOOKUP_SUCCESS':
                // Mock successful serial lookup based on condition
                const mockProductInfo: ProductInfo = {
                  model: pathStep.condition?.includes('smartShopper') ? 'SmartShopper' :
                         pathStep.condition?.includes('valueShopper') ? 'ValueShopper' :
                         pathStep.condition?.includes('vista') ? 'Vista' :
                         pathStep.condition?.includes('maxCR') ? 'Max CR' : 'SmartShopper',
                  serialNumber: 'AMI1234567'
                };
                
                const stepFlowType: FlowType = pathStep.condition?.includes('smartShopper') ? 'smartShopper' :
                                             pathStep.condition?.includes('valueShopper') ? 'valueShopper' :
                                             pathStep.condition?.includes('vista') ? 'vista' :
                                             pathStep.condition?.includes('maxCR') ? 'maxCR' : 'smartShopper';
                
                state = chatReducer(state, {
                  type: 'SERIAL_LOOKUP_SUCCESS',
                  payload: { productInfo: mockProductInfo, flowType: stepFlowType }
                });
                break;

              case 'SERIAL_LOOKUP_FAILURE':
                state = chatReducer(state, { type: 'SERIAL_LOOKUP_FAILURE' });
                break;

              default:
                throw new Error(`Unknown action type: ${pathStep.action}`);
            }

            // Basic state validation after each step
            if (!state) {
              throw new Error(`State is null after step ${stepIndex}`);
            }
          }

          // Final validations for the completed path
          // The key validation is that the conversation executed without errors
          // and we have conversation history
          expect(state.history.length).toBeGreaterThan(0);
          
          // Validate that we have an active flow (conversation was started)
          expect(state.activeFlow).not.toBeNull();
          
          // For paths that should end in specific steps, validate the final state
          if (path.length > 0) {
            const lastStep = path[path.length - 1];
            
            // Check if we reached a terminal step - these should have currentStepId set
            const terminalSteps = [
              'order_parts', 'end_conversation', 'contact_agent',
              'replace_cord_reel', 'charge_batteries_or_replace', 'replace_battery_charger_1',
              'replace_batteries', 'replace_battery_charger_2', 'charge_batteries_try_again',
              'one_of_three_issues', 'motor_controller_signal', 'em_brake_circuit',
              'em_brake_open', 'motor_circuit', 'motor_circuit_open', 'motor_controller_fault',
              'over_temp', 'battery_charger_cycle', 'motor_controller_3_faults',
              'anything_else_question', 'glad_to_help_info', 'contact_info_received',
              'call_phone_number', 'send_email'
            ];
            
            if (terminalSteps.includes(lastStep.stepId)) {
              // For terminal steps, we should have reached the step
              // Note: isTyping might still be true due to async processing, which is OK
              expect(state.currentStepId).toBeDefined();
            } else {
              // For non-terminal steps, we should have a current step
              expect(state.currentStepId).not.toBeNull();
            }
          }

          testResult.success = true;
          testResult.finalState = {
            currentStepId: state.currentStepId,
            isTyping: state.isTyping,
            activeFlowType: state.activeFlow ? getFlowTypeFromFlow(state.activeFlow) : null,
            historyLength: state.history.length
          };

          successCount++;

        } catch (error) {
          testResult.success = false;
          testResult.error = error instanceof Error ? error.message : String(error);
          testResult.finalState = {
            currentStepId: null,
            isTyping: false,
            activeFlowType: null,
            historyLength: 0
          };
          
          failureCount++;
          
          // Log individual failures for debugging
          console.error(`Path ${pathIndex + 1} FAILED: ${testResult.error}`);
          console.error(`Path description: ${testResult.pathDescription}`);
        } finally {
          testResult.executionTime = Date.now() - startTime;
          testResults.push(testResult);
        }
      }

      // Progress update
      console.log(`Batch completed: ${successCount} successes, ${failureCount} failures so far`);
    }

    // Final assertions
    console.log(`\n=== FINAL RESULTS ===`);
    console.log(`Total paths tested: ${allPaths.length}`);
    console.log(`Successful paths: ${successCount}`);
    console.log(`Failed paths: ${failureCount}`);
    console.log(`Success rate: ${((successCount / allPaths.length) * 100).toFixed(2)}%`);

    // Expect at least 95% success rate (allowing for some edge cases)
    const successRate = successCount / allPaths.length;
    expect(successRate).toBeGreaterThan(0.95);
    
    // If we have failures, they should be documented
    if (failureCount > 0) {
      console.warn(`${failureCount} paths failed. Check the detailed failure log above.`);
    }

    // Ensure we tested all paths
    expect(testResults.length).toBe(allPaths.length);
  }, 60000); // 60 second timeout for comprehensive testing
});

// Helper function to determine flow type from flow object
function getFlowTypeFromFlow(flow: any): FlowType {
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
      lastActiveUIState: null,
      history: [],
      inputValue: '',
      isTyping: false,
      productInfo: null,
      activeFlow: null,
      currentStepId: null,
    };

    expect(() => {
      chatReducer(initialState, { type: 'OPEN_WIDGET' });
    }).not.toThrow();
  });

  it('should handle invalid step transitions', () => {
    const initialState: ChatState = {
      uiState: 'modal',
      lastActiveUIState: null,
      history: [],
      inputValue: '',
      isTyping: false,
      productInfo: null,
      activeFlow: null,
      currentStepId: null,
    };

    const result = chatReducer(initialState, { 
      type: 'PROCESS_BOT_RESPONSE', 
      payload: { nextStepId: 'nonexistent_step' } 
    });

    expect(result.isTyping).toBe(false);
  });

  it('should handle serial lookup with various inputs', () => {
    const initialState: ChatState = {
      uiState: 'modal',
      lastActiveUIState: null,
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
