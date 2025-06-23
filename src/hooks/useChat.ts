import { useReducer, useCallback } from "react";
import { conversationFlow } from "@/data/conversationFlow";
import type {
	ConversationStep,
	ConversationFlow,
	ConversationMessage,
} from "@/types";
import { smartShopperFlow } from "@/data/smartShopperFlow";
import { valueShopperFlow } from "@/data/valueShopperFlow";
import { vistaFlow } from "@/data/vistaFlow";
import { maxCRFlow } from "@/data/maxCRFlow";
import { contactAgentFlow } from "@/data/contactAgentFlow";
import { endConversationFlow } from "@/data/endConversationFlow";
import {
	lookupSerialNumber,
	determineFlowFromModel,
	ProductInfo,
} from "@/services/serialNumberService";
import * as logger from "@/lib/logger";

// --- TYPE DEFINITIONS ---
export type FlowType =
	| "general"
	| "smartShopper"
	| "valueShopper"
	| "vista"
	| "maxCR"
	| "contactAgent"
	| "endConversation";
export type ChatUIState = "hidden" | "horizontal" | "modal" | "sidebar";

export interface ChatState {
	uiState: ChatUIState;
	lastActiveUIState: ChatUIState | null;
	history: ConversationMessage[];
	inputValue: string;
	isTyping: boolean;
	productInfo: ProductInfo | null;
	activeFlow: ConversationFlow | null;
	currentStepId: string | null;
}

// All possible state transitions are defined as actions
export type ChatAction =
	| { type: "OPEN_WIDGET" }
	| { type: "CLOSE_WIDGET" }
	| { type: "SET_UI_STATE"; payload: ChatUIState }
	| { type: "SET_INPUT_VALUE"; payload: string }
	| { type: "SUBMIT_INPUT" }
	| {
			type: "START_FLOW";
			payload: { flowType: FlowType; initialMessage?: string };
	  }
	| { type: "START_SERIAL_LOOKUP" }
	| {
			type: "SERIAL_LOOKUP_SUCCESS";
			payload: { productInfo: ProductInfo; flowType: FlowType };
	  }
	| { type: "SERIAL_LOOKUP_FAILURE" }
	| {
			type: "ADD_MESSAGE";
			payload: Omit<ConversationMessage, "id" | "timestamp">;
	  }
	| { type: "SELECT_OPTION"; payload: { text: string } }
	| { type: "PROCESS_BOT_RESPONSE"; payload: { nextStepId: string } }
	| { type: "START_FLOW_FROM_SUGGESTION"; payload: { text: string } }
	| {
			type: "PROCESS_SUGGESTION_RESPONSE";
			payload: { flowType: FlowType; text: string };
	  };

// --- FLOW MAPPING ---
const flowMap: Record<FlowType, ConversationFlow> = {
	general: conversationFlow,
	smartShopper: smartShopperFlow,
	valueShopper: valueShopperFlow,
	vista: vistaFlow,
	maxCR: maxCRFlow,
	contactAgent: contactAgentFlow,
	endConversation: endConversationFlow,
};

// Empathy message templates
const empathyTemplates: Record<string, string> = {
	smartShopper: "Let's get your SmartShopper working properly.",
	valueShopper: "Let's get your ValueShopper working properly.",
	vista: "Let's get your Vista working properly.",
	maxCR: "Let's get your Max CR working properly.",
	general: "Let's get your Amigo cart working properly.",
};

// Track visited nodes to prevent duplicate empathy messages
const visitedEmpathyNodes = new Set<string>();

// Helper function to generate empathy message
const generateEmpathyMessage = (flowType: FlowType): string => {
	return empathyTemplates[flowType] || empathyTemplates.general;
};

// Helper function to check if empathy should be shown
const shouldShowEmpathy = (stepId: string, step: ConversationStep): boolean => {
	return (
		step.decorateWithEmpathy === true && !visitedEmpathyNodes.has(stepId)
	);
};

// --- INITIAL STATE ---
const initialState: ChatState = {
	uiState: "horizontal",
	lastActiveUIState: null,
	history: [],
	inputValue: "",
	isTyping: false,
	productInfo: null,
	activeFlow: null,
	currentStepId: null,
};

// --- REDUCER (The Brains of the Operation) ---
export const chatReducer = (
	state: ChatState,
	action: ChatAction,
): ChatState => {
	switch (action.type) {
		case "OPEN_WIDGET":
			return {
				...state,
				uiState: state.lastActiveUIState || "modal",
				history: state.history,
			};

		case "CLOSE_WIDGET":
			return {
				...initialState,
				lastActiveUIState: state.lastActiveUIState,
				uiState: state.lastActiveUIState || "hidden",
			};

		case "SET_UI_STATE":
			return {
				...state,
				uiState: action.payload,
				lastActiveUIState:
					action.payload === "modal" || action.payload === "sidebar"
						? action.payload
						: state.lastActiveUIState,
			};

		case "SET_INPUT_VALUE":
			return { ...state, inputValue: action.payload };

		case "ADD_MESSAGE": {
			const newMessage: ConversationMessage = {
				...action.payload,
				id: `${Date.now()}`,
				timestamp: new Date(),
			};
			return { ...state, history: [...state.history, newMessage] };
		}
		case "SUBMIT_INPUT": {
			if (!state.inputValue.trim()) return state;

			const userMessage: ConversationMessage = {
				id: `${Date.now()}`,
				text: state.inputValue,
				sender: "user",
				timestamp: new Date(),
			};

			const { activeFlow, currentStepId } = state;

			if (
				activeFlow &&
				currentStepId &&
				activeFlow[currentStepId]?.allowTextInput
			) {
				if (
					currentStepId === "ask_for_serial_number" ||
					currentStepId === "ask_for_model_name"
				) {
					return {
						...state,
						inputValue: "",
						history: [...state.history, userMessage],
						isTyping: true,
					};
				}

				const nextStepId =
					activeFlow[currentStepId].userOptions[0]?.nextStep ||
					"contact_info_received";
				let nextStep = activeFlow[nextStepId];
				let currentActiveFlow = activeFlow;

				if (!nextStep) {
					if (contactAgentFlow[nextStepId]) {
						logger.log(`Switching to contactAgentFlow`);
						currentActiveFlow = contactAgentFlow;
						nextStep = currentActiveFlow[nextStepId];
					} else if (endConversationFlow[nextStepId]) {
						logger.log(`Switching to endConversationFlow`);
						currentActiveFlow = endConversationFlow;
						nextStep = currentActiveFlow[nextStepId];
					}
				}

				if (!nextStep) {
					logger.error(
						`Next step "${nextStepId}" not found in flow.`,
					);
					return state;
				}

				const botMessage: ConversationMessage = {
					id: `${Date.now() + 1}`,
					text: Array.isArray(nextStep.botMessage)
						? nextStep.botMessage.join("\n")
						: nextStep.botMessage,
					sender: "agent",
					timestamp: new Date(),
				};

				return {
					...state,
					inputValue: "",
					history: [...state.history, userMessage, botMessage],
					currentStepId: nextStepId,
				};
			}

			return {
				...state,
				inputValue: "",
				history: [...state.history, userMessage],
				isTyping: true,
			};
		}

		case "SELECT_OPTION": {
			const { text } = action.payload;
			const userMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "user",
				text: text,
				timestamp: new Date(),
			};
			return {
				...state,
				history: [...state.history, userMessage],
				isTyping: true,
			};
		}
		case "PROCESS_BOT_RESPONSE": {
			const { nextStepId } = action.payload;
			if (!state.activeFlow) return { ...state, isTyping: false };

			const crossFlowMap: Record<string, FlowType> = {
				start_smartshopper_flow: "smartShopper",
				start_valueshopper_flow: "valueShopper",
				start_vista_flow: "vista",
				start_maxcr_flow: "maxCR",
			};

			if (crossFlowMap[nextStepId]) {
				const newFlowType = crossFlowMap[nextStepId];
				const newFlow = flowMap[newFlowType];
				const nextStep = newFlow[nextStepId];

				if (!nextStep) {
					logger.error(
						`Step "${nextStepId}" not found in flow: ${newFlowType}`,
					);
					return { ...state, isTyping: false };
				}

				const botMessage: ConversationMessage = {
					id: `${Date.now()}`,
					sender: "agent",
					text: Array.isArray(nextStep.botMessage)
						? nextStep.botMessage.join("\n")
						: nextStep.botMessage,
					timestamp: new Date(),
				};

				return {
					...state,
					activeFlow: newFlow,
					currentStepId: nextStepId,
					history: [...state.history, botMessage],
					isTyping: false,
				};
			}

			let nextStep = state.activeFlow[nextStepId];
			let activeFlow = state.activeFlow;

			if (!nextStep) {
				if (contactAgentFlow[nextStepId]) {
					logger.log(`Switching to contactAgentFlow`);
					activeFlow = contactAgentFlow;
					nextStep = activeFlow[nextStepId];
				} else if (endConversationFlow[nextStepId]) {
					logger.log(`Switching to endConversationFlow`);
					activeFlow = endConversationFlow;
					nextStep = activeFlow[nextStepId];
				}
			}

			if (!nextStep) {
				logger.error(
					`Step "${nextStepId}" could not be found in any known flow.`,
				);
				return { ...state, isTyping: false };
			}

			const botMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "agent",
				text: Array.isArray(nextStep.botMessage)
					? nextStep.botMessage.join("\n")
					: nextStep.botMessage,
				timestamp: new Date(),
			};
			return {
				...state,
				activeFlow,
				history: [...state.history, botMessage],
				currentStepId: nextStepId,
				isTyping: false,
			};
		}

		case "START_FLOW_FROM_SUGGESTION": {
			const { text } = action.payload;
			const userMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "user",
				text: text,
				timestamp: new Date(),
			};
			return {
				...state,
				uiState: "modal",
				history: [userMessage],
				isTyping: true,
			};
		}
		case "PROCESS_SUGGESTION_RESPONSE": {
			const { flowType, text } = action.payload;
			const flow = flowMap[flowType];
			if (!flow) return { ...state, isTyping: false };

			let startStepId: string;
			if (flowType === "general") {
				startStepId = "start_repair_flow";
			} else if (flowType === "contactAgent") {
				startStepId = "contact_agent";
			} else {
				startStepId = "greeting";
			}

			const startStep = flow[startStepId];
			if (!startStep) {
				logger.error(
					`Starting step "${startStepId}" not found in flow: ${flowType}`,
				);
				return { ...state, isTyping: false };
			}

			const botMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "agent",
				text: Array.isArray(startStep.botMessage)
					? startStep.botMessage.join("\n")
					: startStep.botMessage,
				timestamp: new Date(),
			};

			return {
				...state,
				activeFlow: flow,
				currentStepId: startStepId,
				history: [...state.history, botMessage],
				isTyping: false,
			};
		}

		case "START_FLOW": {
			const { flowType, initialMessage } = action.payload;
			const flow = flowMap[flowType];
			if (!flow) return state;
			const greetingStep = flow.greeting;
			const firstMessageText =
				initialMessage ||
				(Array.isArray(greetingStep.botMessage)
					? greetingStep.botMessage.join("\n")
					: greetingStep.botMessage);
			const botMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "agent",
				text: firstMessageText,
				timestamp: new Date(),
			};
			return {
				...state,
				activeFlow: flow,
				currentStepId: "greeting",
				history: [...state.history, botMessage],
				isTyping: false,
			};
		}

		case "START_SERIAL_LOOKUP":
			return { ...state, isTyping: true };

		case "SERIAL_LOOKUP_SUCCESS": {
			const { productInfo, flowType } = action.payload;
			const flow = flowMap[flowType];
			const greetingStep = flow.greeting;
			const successMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "agent",
				text: `Thank you! I've identified your product as an Amigo ${productInfo.model}. Let's begin troubleshooting. \n\n${Array.isArray(greetingStep.botMessage) ? greetingStep.botMessage.join("\n") : greetingStep.botMessage}`,
				timestamp: new Date(),
			};
			return {
				...state,
				productInfo,
				activeFlow: flow,
				currentStepId: "greeting",
				isTyping: false,
				history: [...state.history, successMessage],
			};
		}

		case "SERIAL_LOOKUP_FAILURE": {
			const failureMessage: ConversationMessage = {
				id: `${Date.now()}`,
				sender: "agent",
				text: "I'm sorry, I couldn't find that serial number. Please double-check the number and try again. You can also tell me the model name, like 'Vista' or 'SmartShopper'.",
				timestamp: new Date(),
			};
			return {
				...state,
				isTyping: false,
				history: [...state.history, failureMessage],
			};
		}

		default:
			return state;
	}
};

// --- THE UNIFIED HOOK ---
export const useChat = () => {
	const [state, dispatch] = useReducer(chatReducer, initialState);

	const openWidget = useCallback(() => dispatch({ type: "OPEN_WIDGET" }), []);
	const closeWidget = useCallback(
		() => dispatch({ type: "CLOSE_WIDGET" }),
		[],
	);
	const setUiState = useCallback(
		(uiState: ChatUIState) =>
			dispatch({ type: "SET_UI_STATE", payload: uiState }),
		[],
	);
	const setInputValue = useCallback(
		(value: string) =>
			dispatch({ type: "SET_INPUT_VALUE", payload: value }),
		[],
	);
	const sendMessage = useCallback(async () => {
		const userInput = state.inputValue;
		if (!userInput.trim()) return;

		const { activeFlow, currentStepId } = state;
		const currentStep = activeFlow ? activeFlow[currentStepId!] : null;

		dispatch({ type: "SUBMIT_INPUT" });

		if (
			currentStep?.allowTextInput &&
			(currentStepId === "ask_for_serial_number" ||
				currentStepId === "ask_for_model_name")
		) {
			try {
				const productData = await lookupSerialNumber(userInput);
				if (productData && productData.model) {
					const flowType = determineFlowFromModel(productData.model);
					dispatch({
						type: "SERIAL_LOOKUP_SUCCESS",
						payload: { productInfo: productData, flowType },
					});
				} else {
					dispatch({ type: "SERIAL_LOOKUP_FAILURE" });
				}
			} catch (error) {
				logger.error("Lookup failed:", error);
				dispatch({ type: "SERIAL_LOOKUP_FAILURE" });
			}
		} else if (!currentStep || !currentStep.allowTextInput) {
			try {
				const productData = await lookupSerialNumber(userInput);
				if (productData && productData.model) {
					const flowType = determineFlowFromModel(productData.model);
					dispatch({
						type: "SERIAL_LOOKUP_SUCCESS",
						payload: { productInfo: productData, flowType },
					});
				} else {
					dispatch({ type: "SERIAL_LOOKUP_FAILURE" });
				}
			} catch (error) {
				logger.error("Lookup failed:", error);
				dispatch({ type: "SERIAL_LOOKUP_FAILURE" });
			}
		}
	}, [state]);

	const selectOption = useCallback(
		(text: string, nextStepId: string) => {
			dispatch({ type: "SELECT_OPTION", payload: { text } });

			// Check if target step needs empathy decoration
			const { activeFlow } = state;
			let targetStep = activeFlow?.[nextStepId];
			let currentFlow = activeFlow;

			// Handle cross-flow navigation
			const crossFlowMap: Record<string, FlowType> = {
				start_smartshopper_flow: "smartShopper",
				start_valueshopper_flow: "valueShopper",
				start_vista_flow: "vista",
				start_maxcr_flow: "maxCR",
			};

			if (crossFlowMap[nextStepId]) {
				const newFlowType = crossFlowMap[nextStepId];
				currentFlow = flowMap[newFlowType];
				targetStep = currentFlow[nextStepId];
			}

			if (targetStep && shouldShowEmpathy(nextStepId, targetStep)) {
				// First dispatch empathy message
				const empathyText = generateEmpathyMessage(
					crossFlowMap[nextStepId] || "general",
				);
				dispatch({
					type: "ADD_MESSAGE",
					payload: { text: empathyText, sender: "agent" },
				});
				visitedEmpathyNodes.add(nextStepId);

				// Set typing indicator and delay
				setTimeout(() => {
					dispatch({
						type: "PROCESS_BOT_RESPONSE",
						payload: { nextStepId },
					});
				}, 1200);
			} else {
				setTimeout(() => {
					dispatch({
						type: "PROCESS_BOT_RESPONSE",
						payload: { nextStepId },
					});
				}, 1200);
			}
		},
		[state],
	);

	const startFlow = useCallback(
		(flowType: FlowType, initialMessage?: string) => {
			dispatch({
				type: "START_FLOW",
				payload: { flowType, initialMessage },
			});
		},
		[],
	);

	const startFlowFromSuggestion = useCallback(
		(flowType: FlowType, text: string) => {
			dispatch({ type: "START_FLOW_FROM_SUGGESTION", payload: { text } });

			// Check if the starting step needs empathy decoration
			const flow = flowMap[flowType];
			let startStepId: string;
			if (flowType === "general") {
				startStepId = "start_repair_flow";
			} else if (flowType === "contactAgent") {
				startStepId = "contact_agent";
			} else {
				startStepId = "greeting";
			}

			const startStep = flow?.[startStepId];
			if (startStep && shouldShowEmpathy(startStepId, startStep)) {
				// First dispatch empathy message
				const empathyText = generateEmpathyMessage(flowType);
				dispatch({
					type: "ADD_MESSAGE",
					payload: { text: empathyText, sender: "agent" },
				});
				visitedEmpathyNodes.add(startStepId);

				// Set typing indicator and delay
				setTimeout(() => {
					dispatch({
						type: "PROCESS_SUGGESTION_RESPONSE",
						payload: { flowType, text },
					});
				}, 1200);
			} else {
				setTimeout(() => {
					dispatch({
						type: "PROCESS_SUGGESTION_RESPONSE",
						payload: { flowType, text },
					});
				}, 1200);
			}
		},
		[],
	);

	return {
		state,
		actions: {
			openWidget,
			closeWidget,
			setUiState,
			setInputValue,
			sendMessage,
			selectOption,
			startFlow,
			startFlowFromSuggestion,
		},
	};
};
