import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatWidget from './components/ChatWidget';
import './index.css';
import './widget-embed.css';
import * as logger from './lib/logger';

// Create query client for the widget
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Widget component with providers
const AmigoWidget = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatWidget />
    </QueryClientProvider>
  );
};

// Global widget interface
interface WidgetConfig {
  containerId?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

let widgetRoot: any = null;

// Widget initialization function
const initWidget = (config: WidgetConfig = {}) => {
  try {
    const { containerId = 'amigo-widget-container' } = config;
    
    // Create container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
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
      widgetRoot = createRoot(container);
      widgetRoot.render(<AmigoWidget />);
    }
    
    logger.log('AmigoWidget initialized successfully');
  } catch (error) {
    logger.error('Error initializing AmigoWidget:', error);
  }
};

// Widget destruction function
const destroyWidget = () => {
  try {
    if (widgetRoot) {
      widgetRoot.unmount();
      widgetRoot = null;
    }
    
    const container = document.getElementById('amigo-widget-container');
    if (container) {
      container.remove();
    }
    
    logger.log('AmigoWidget destroyed successfully');
  } catch (error) {
    logger.error('Error destroying AmigoWidget:', error);
  }
};

// Create the global widget object
const AmigoWidgetGlobal = {
  init: initWidget,
  destroy: destroyWidget,
  version: '1.0.0'
};

// Expose global widget object
if (typeof window !== 'undefined') {
  (window as any).AmigoWidget = AmigoWidgetGlobal;
}

// Auto-initialize if data attribute is present
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const autoInit = document.querySelector('[data-amigo-widget="auto"]');
    if (autoInit) {
      initWidget();
    }
  });
}

// Export for module usage
export { AmigoWidget, initWidget, destroyWidget };
export default AmigoWidgetGlobal;