export {};

declare global {
  interface TimeProps {
    day: string;
    time: number[];
    date: string;
    localStorageDate: string;
  }

  interface Window {
    electronApi: {
      getTime: () => TimeProps;
    };
  }

  type tableProps = [string[], [string, ...number], [string, ...number]];
  type totalProps = [string[], number[]];
  interface FinalDataInterface {
    Quantity: number;
    TrayNumber: string;
    TimeStamp: string;
  }

  type localItemProps = {
    table: [[string, ...number], [string, ...number]];
    model: [[string, ...number], [string, ...number]];
    total: [number, number];
    hourly: finalDataInterface[];
  };
}
