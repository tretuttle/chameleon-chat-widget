import { useState, useEffect } from "react";
const thoughtTexts = [
	"Analyzing your request...",
	"Looking up product information...",
	"Processing serial number...",
	"Checking our database...",
	"Preparing response...",
];

export const useTypingPlaceholder = (isProcessing: boolean) => {
	const [placeholder, setPlaceholder] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (!isProcessing) {
			setPlaceholder("Type your message here...");
			setCurrentIndex(0);
			return;
		}

		const currentText =
			thoughtTexts[Math.floor(Math.random() * thoughtTexts.length)];
		setPlaceholder("");
		setCurrentIndex(0);

		const typeText = () => {
			let index = 0;
			const interval = setInterval(() => {
				setPlaceholder(currentText.slice(0, index + 1));
				index++;

				if (index >= currentText.length) {
					clearInterval(interval);

					// Start new text after a pause
					setTimeout(() => {
						if (isProcessing) {
							typeText();
						}
					}, 2000);
				}
			}, 50);

			return interval;
		};

		const interval = typeText();

		return () => clearInterval(interval);
	}, [isProcessing]);

	return placeholder;
};
