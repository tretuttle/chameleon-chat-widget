import { useEffect, useState } from "react";
import ChatWidget from "@/components/ChatWidget";

const Widget = () => {
  const [embedMode, setEmbedMode] = useState<'responsive' | 'fixed' | 'fullscreen'>('responsive');
  const [initialState, setInitialState] = useState<'horizontal' | 'modal' | 'sidebar'>('horizontal');

  useEffect(() => {
    // Check URL parameters for embedding configuration
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'responsive' | 'fixed' | 'fullscreen';
    const state = urlParams.get('state') as 'horizontal' | 'modal' | 'sidebar';
    
    if (mode) setEmbedMode(mode);
    if (state) setInitialState(state);

    // Send ready message to parent window if embedded
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'widget-ready', mode, state }, '*');
    }

    // Listen for resize messages from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'resize-widget') {
        const { width, height } = event.data;
        if (width) document.body.style.width = width + 'px';
        if (height) document.body.style.height = height + 'px';
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const getContainerClasses = () => {
    switch (embedMode) {
      case 'fullscreen':
        return "min-h-screen w-full";
      case 'fixed':
        return "h-[600px] w-full max-w-[400px]";
      case 'responsive':
      default:
        return "h-full w-full min-h-[300px] max-h-[100vh]";
    }
  };

  return (
    <div className={`${getContainerClasses()} overflow-hidden`}>
      <ChatWidget initialState={initialState} embedMode={embedMode} />
    </div>
  );
};

export default Widget;
