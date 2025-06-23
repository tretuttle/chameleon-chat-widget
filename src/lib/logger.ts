// const isDevelopment = process.env.NODE_ENV === 'development';
const isDevelopment = import.meta.env.DEV;

export const log = (...args: unknown[]): void => {
	if (isDevelopment) {
		console.log(...args);
	}
};

export const warn = (...args: unknown[]): void => {
	if (isDevelopment) {
		console.warn(...args);
	}
};

export const error = (...args: unknown[]): void => {
	console.error(...args);
};
