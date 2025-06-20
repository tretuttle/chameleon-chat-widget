const isDevelopment = process.env.NODE_ENV === 'development';

export const log = (...args: any[]): void => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const warn = (...args: any[]): void => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const error = (...args: any[]): void => {
  console.error(...args);
};