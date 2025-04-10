export {};

declare global {
  interface Window {
    electronApi: {
      getTime: () => string;
    };
  }
}
