import { conversationFlow as generalAmigoFlow } from '@/data/conversationFlow';
import { smartShopperFlow } from '@/data/smartShopperFlow';
import { valueShopperFlow } from '@/data/valueShopperFlow';
import { vistaFlow } from '@/data/vistaFlow';
import { maxCRFlow } from '@/data/maxCRFlow';
import { contactAgentFlow } from '@/data/contactAgentFlow';
import { endConversationFlow } from '@/data/endConversationFlow';
import type { ConversationFlow, ConversationStep } from '@/types';
import type { FlowType } from '@/hooks/useChat';

// Types for graph representation
export interface GraphNode {
  stepId: string;
  flowType: FlowType;
  step: ConversationStep;
  edges: GraphEdge[];
}

export interface GraphEdge {
  targetStepId: string;
  targetFlowType: FlowType;
  action: 'SELECT_OPTION' | 'SUBMIT_INPUT' | 'SERIAL_LOOKUP_SUCCESS' | 'SERIAL_LOOKUP_FAILURE';
  buttonText?: string;
  condition?: string;
}

export interface ConversationPath {
  stepId: string;
  flowType: FlowType;
  action: 'SELECT_OPTION' | 'SUBMIT_INPUT' | 'SERIAL_LOOKUP_SUCCESS' | 'SERIAL_LOOKUP_FAILURE';
  buttonText?: string;
  condition?: string;
}

export interface ConversationGraph {
  nodes: Map<string, GraphNode>;
  entryPoints: string[];
}

// Flow mapping from useChat.ts
const flowMap: Record<FlowType, ConversationFlow> = {
  general: generalAmigoFlow,
  smartShopper: smartShopperFlow,
  valueShopper: valueShopperFlow,
  vista: vistaFlow,
  maxCR: maxCRFlow,
  contactAgent: contactAgentFlow,
  endConversation: endConversationFlow,
};

// Cross-flow mapping from useChat.ts
const crossFlowMap: Record<string, FlowType> = {
  'start_smartshopper_flow': 'smartShopper',
  'start_valueshopper_flow': 'valueShopper',
  'start_vista_flow': 'vista',
  'start_maxcr_flow': 'maxCR'
};

// Fallback flows for steps not found in current flow
const fallbackFlows: FlowType[] = ['contactAgent', 'endConversation'];

/**
 * Builds a complete conversation graph from all flow files
 */
export function buildGraph(): ConversationGraph {
  const nodes = new Map<string, GraphNode>();
  const entryPoints: string[] = [];

  // Process each flow
  Object.entries(flowMap).forEach(([flowType, flow]) => {
    const flowTypeKey = flowType as FlowType;
    
    Object.entries(flow).forEach(([stepId, step]) => {
      const nodeKey = `${flowTypeKey}:${stepId}`;
      
      // Create edges for this step
      const edges: GraphEdge[] = [];
      
      // Handle user options (button clicks)
      if (step.userOptions && step.userOptions.length > 0) {
        step.userOptions.forEach(option => {
          edges.push({
            targetStepId: option.nextStep,
            targetFlowType: flowTypeKey, // Will be updated in injectCrossFlowEdges
            action: 'SELECT_OPTION',
            buttonText: option.text
          });
        });
      }
      
      // Handle text input steps
      if (step.allowTextInput) {
        if (stepId === 'ask_for_serial_number' || stepId === 'ask_for_model_name') {
          // Serial lookup can succeed or fail
          edges.push({
            targetStepId: 'greeting', // Will be determined by flow type from serial lookup
            targetFlowType: 'general', // Placeholder, will be dynamic
            action: 'SERIAL_LOOKUP_SUCCESS',
            condition: 'serial_lookup_success'
          });
          edges.push({
            targetStepId: stepId, // Stay on same step for retry
            targetFlowType: flowTypeKey,
            action: 'SERIAL_LOOKUP_FAILURE',
            condition: 'serial_lookup_failure'
          });
        } else {
          // Regular text input
          const nextStepId = step.userOptions[0]?.nextStep || 'contact_info_received';
          edges.push({
            targetStepId: nextStepId,
            targetFlowType: flowTypeKey,
            action: 'SUBMIT_INPUT'
          });
        }
      }
      
      const node: GraphNode = {
        stepId,
        flowType: flowTypeKey,
        step,
        edges
      };
      
      nodes.set(nodeKey, node);
      
      // Identify entry points
      if (stepId === 'greeting' || stepId === 'start_repair_flow' || stepId === 'contact_agent') {
        entryPoints.push(nodeKey);
      }
    });
  });

  return { nodes, entryPoints };
}

/**
 * Injects cross-flow edges and fallback flow connections
 */
export function injectCrossFlowEdges(graph: ConversationGraph): ConversationGraph {
  const updatedNodes = new Map(graph.nodes);
  
  // Update cross-flow edges
  updatedNodes.forEach((node, nodeKey) => {
    const updatedEdges = node.edges.map(edge => {
      // Check if target step is a cross-flow transition
      if (crossFlowMap[edge.targetStepId]) {
        return {
          ...edge,
          targetFlowType: crossFlowMap[edge.targetStepId]
        };
      }
      
      // Check if target step exists in current flow
      const currentFlow = flowMap[node.flowType];
      if (!currentFlow[edge.targetStepId]) {
        // Look for step in fallback flows
        for (const fallbackFlowType of fallbackFlows) {
          const fallbackFlow = flowMap[fallbackFlowType];
          if (fallbackFlow[edge.targetStepId]) {
            return {
              ...edge,
              targetFlowType: fallbackFlowType
            };
          }
        }
      }
      
      return edge;
    });
    
    updatedNodes.set(nodeKey, {
      ...node,
      edges: updatedEdges
    });
  });
  
  return {
    nodes: updatedNodes,
    entryPoints: graph.entryPoints
  };
}

/**
 * Enumerates all acyclic paths from entry points to terminal nodes
 */
export function enumeratePaths(graph: ConversationGraph): ConversationPath[][] {
  const allPaths: ConversationPath[][] = [];
  
  // Start DFS from each entry point
  graph.entryPoints.forEach(entryPoint => {
    const paths = dfsFromNode(graph, entryPoint, new Set(), []);
    allPaths.push(...paths);
  });
  
  return allPaths;
}

/**
 * Performs DFS to find all paths from a given node, avoiding cycles
 */
function dfsFromNode(
  graph: ConversationGraph, 
  nodeKey: string, 
  visited: Set<string>, 
  currentPath: ConversationPath[]
): ConversationPath[][] {
  const node = graph.nodes.get(nodeKey);
  if (!node || visited.has(nodeKey)) {
    return [];
  }
  
  // Mark as visited for cycle detection
  const newVisited = new Set(visited);
  newVisited.add(nodeKey);
  
  // If this is a terminal node (no edges), return the current path
  if (node.edges.length === 0) {
    return [currentPath];
  }
  
  const paths: ConversationPath[][] = [];
  
  // Explore each edge
  node.edges.forEach(edge => {
    const targetNodeKey = `${edge.targetFlowType}:${edge.targetStepId}`;
    
    // Create path step for this edge
    const pathStep: ConversationPath = {
      stepId: node.stepId,
      flowType: node.flowType,
      action: edge.action,
      buttonText: edge.buttonText,
      condition: edge.condition
    };
    
    const newPath = [...currentPath, pathStep];
    
    // Handle special cases for serial lookup
    if (edge.action === 'SERIAL_LOOKUP_SUCCESS') {
      // For serial lookup success, we need to generate paths for each possible flow type
      const possibleFlowTypes: FlowType[] = ['smartShopper', 'valueShopper', 'vista', 'maxCR'];
      
      possibleFlowTypes.forEach(flowType => {
        const successTargetKey = `${flowType}:greeting`;
        if (graph.nodes.has(successTargetKey)) {
          const successPathStep: ConversationPath = {
            ...pathStep,
            condition: `serial_lookup_success_${flowType}`
          };
          const successPath = [...currentPath, successPathStep];
          const subPaths = dfsFromNode(graph, successTargetKey, newVisited, successPath);
          paths.push(...subPaths);
        }
      });
    } else {
      // Regular edge traversal
      const subPaths = dfsFromNode(graph, targetNodeKey, newVisited, newPath);
      paths.push(...subPaths);
    }
  });
  
  return paths;
}

/**
 * Finds terminal nodes (nodes with no outgoing edges)
 */
export function findTerminalNodes(graph: ConversationGraph): string[] {
  const terminalNodes: string[] = [];
  
  graph.nodes.forEach((node, nodeKey) => {
    if (node.edges.length === 0) {
      terminalNodes.push(nodeKey);
    }
  });
  
  return terminalNodes;
}

/**
 * Gets all possible entry points for flows
 */
export function getFlowEntryPoints(): Record<FlowType, string[]> {
  const entryPoints: Record<FlowType, string[]> = {
    general: ['start_repair_flow', 'greeting'],
    smartShopper: ['greeting', 'start_smartshopper_flow'],
    valueShopper: ['greeting', 'start_valueshopper_flow'],
    vista: ['greeting', 'start_vista_flow'],
    maxCR: ['greeting', 'start_maxcr_flow'],
    contactAgent: ['contact_agent'],
    endConversation: ['end_conversation', 'order_parts']
  };
  
  return entryPoints;
}

/**
 * Utility function to get a human-readable path description
 */
export function getPathDescription(path: ConversationPath[]): string {
  return path.map(step => {
    const parts = [`${step.flowType}:${step.stepId}`];
    if (step.buttonText) {
      parts.push(`"${step.buttonText}"`);
    }
    if (step.condition) {
      parts.push(`[${step.condition}]`);
    }
    return parts.join(' ');
  }).join(' → ');
}

/**
 * Main function to build complete conversation graph with all connections
 */
export function buildCompleteGraph(): ConversationGraph {
  const baseGraph = buildGraph();
  const graphWithCrossFlows = injectCrossFlowEdges(baseGraph);
  return graphWithCrossFlows;
}