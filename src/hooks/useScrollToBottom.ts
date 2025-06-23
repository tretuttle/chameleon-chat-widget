import { useEffect, useRef } from "react";

/**
 * Custom hook that provides a ref and auto-scroll functionality for chat messages
 * @param dependencies - Array of dependencies that should trigger auto-scroll
 * @returns Object containing the ref to attach to the scroll target element
 */
export const useScrollToBottom = <T extends HTMLElement = HTMLDivElement>(
	dependencies = [],
) => {
	const scrollRef = useRef<T>(null);

	const scrollToBottom = () => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, dependencies);

	return {
		scrollRef,
		scrollToBottom,
	};
};

export default useScrollToBottom;
