export {};

declare global {
  interface TimeProps {
    day: string;
    time: number[];
    date: string;
  }

  interface Window {
    electronApi: {
      getTime: () => TimeProps;
    };
  }
}
