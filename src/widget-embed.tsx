import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWidget from "./components/ChatWidget";
import "./index.css";
// import "./widget-embed.css";
import * as logger from "./lib/logger";

// Global widget interface
interface WidgetConfig {
	containerId?: string;
	theme?: "light" | "dark";
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

// Widget component with providers
function AmigoWidgetComponent() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	});
	return (
		<QueryClientProvider client={queryClient}>
			<ChatWidget />
		</QueryClientProvider>
	);
}

let widgetRoot: ReturnType<typeof createRoot> | null = null;

// Widget initialization function
export function initWidget(config: WidgetConfig = {}) {
	try {
		const { containerId = "amigo-widget-container" } = config;

		// Create container if it doesn't exist
		let container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement("div");
			container.id = containerId;
			container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      `;
			document.body.appendChild(container);
		}

		// Mount the widget
		if (!widgetRoot) {
			// const queryClient = new QueryClient({
			// 	defaultOptions: {
			// 		queries: {
			// 			retry: 1,
			// 			refetchOnWindowFocus: false,
			// 		},
			// 	},
			// });

			widgetRoot = createRoot(container);
			widgetRoot.render(<AmigoWidgetComponent />);
			// widgetRoot.render(
			// 	<React.StrictMode>
			// 		<QueryClientProvider client={queryClient}>
			// 			<ChatWidget />
			// 		</QueryClientProvider>
			// 	</React.StrictMode>,
			// );
		}

		logger.log("AmigoWidgetComponent initialized successfully");
	} catch (error) {
		logger.error("Error initializing AmigoWidgetComponent:", error);
	}
}

// Widget destruction function
export function destroyWidget() {
	try {
		if (widgetRoot) {
			widgetRoot.unmount();
			widgetRoot = null;
		}

		const container = document.getElementById("amigo-widget-container");
		if (container) {
			container.remove();
		}

		logger.log("AmigoWidgetComponent destroyed successfully");
	} catch (error) {
		logger.error("Error destroying AmigoWidgetComponent:", error);
	}
}
export const version = "1.0.0";

if (typeof window !== "undefined") {
	window.AmigoWidget = {
		initWidget,
		destroyWidget,
		version,
	};
}

declare global {
	interface Window {
		AmigoWidget: {
			initWidget: typeof initWidget;
			destroyWidget: typeof destroyWidget;
			version: string;
		};
	}
}
