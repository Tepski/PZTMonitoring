import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";

interface HeaderProps {
  getTime: () => Promise<string | void>;
  table: (string | number)[][] | null;
  total: (string | number)[][] | null;
  model: (string | number)[][] | null;
  setTable: React.Dispatch<React.SetStateAction<(string | number)[][] | null>>;
  setTotal: React.Dispatch<React.SetStateAction<(string | number)[][] | null>>;
  setModel: React.Dispatch<React.SetStateAction<(string | number)[][] | null>>;
}

interface FinalDataInterface {
  TrayNumber: string | null;
  Quantity: number | string | null;
  Timestamp: string;
}

const finalDataDefaultValue: FinalDataInterface = {
  TrayNumber: "",
  Quantity: null,
  Timestamp: "",
};

const Header = ({ getTime, setTable, table }: HeaderProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [scanned, setScanned] = useState<boolean>(false);
  const [finalData, setFinalData] = useState<FinalDataInterface>(
    finalDataDefaultValue
  );

  // Cancel Function
  const cancel = () => {
    setScanned(!scanned);
    setFinalData({
      ...finalData,
      TrayNumber: "",
    });
    ref.current?.focus();
  };

  const loggingTest = async (value: string | number) => {
    const date: string | void = await getTime();
    const timeArr = date?.split(" ");
    // const meridiem = timeArr && timeArr[2];
    const time = timeArr && timeArr[1].split(":")[0];

    // if (meridiem?.toLowerCase() == "pm") {
    //   time += 12;
    // }

    if (table) {
      const newTable = [...table];
      newTable[1][Number(time) + 7] = value;

      console.log(newTable[1][Number(time)]);

      setTable(() => {
        return newTable;
      });
    }
  };

  const handleEnter = useCallback(() => {
    setScanned((prev) => !prev);

    loggingTest(Number(finalData?.Quantity ?? ""));

    setFinalData((prev) => ({
      ...prev,
      TrayNumber: "",
    }));

    console.log(table);

    // loggingTest(finalData?.Quantity ?? "");
  }, [setScanned, setFinalData, finalData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const time = window.electronApi.getTime();

    setFinalData((prev: FinalDataInterface) => ({
      ...prev,
      TrayNumber: e.target.value,
      Timestamp: time,
    }));
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFinalData((prev) => ({ ...prev, Quantity: e.target.value }));
  };

  useEffect(() => {
    const scannerListener = (e: KeyboardEvent) => {
      if (e.key == "ArrowDown") {
        console.log("Shift clicked", finalData?.TrayNumber);

        setScanned((prev) => !prev);
      }
    };

    ref.current?.focus();
    window.addEventListener("keydown", scannerListener);

    return () => {
      window.removeEventListener("keydown", scannerListener);
    };
  }, [finalData]);

  useEffect(() => {
    if (scanned) {
      console.log("scanned");

      inputRef.current?.focus();

      const modalRefListener = (k: KeyboardEvent) => {
        if (k.key == "Enter") {
          handleEnter();
        }
      };

      window.addEventListener("keydown", modalRefListener);

      return () => {
        window.removeEventListener("keydown", modalRefListener);
      };
    }
  }, [scanned, handleEnter]);

  return (
    <div className="flex justify-between pb-2 items-center">
      <div className="">
        <input
          ref={ref}
          type="text"
          value={finalData?.TrayNumber ?? ""}
          onChange={(e) => handleChange(e)}
          className="border-2 px-2 py-1 rounded-md caret-transparent"
          placeholder="Scan Tray Barcode"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          className="border-2 px-2 py-1 rounded-md"
          defaultValue={"08/04/2025"}
        />

        <button
          className="bg-blue-500 mx-2 px-2 py-1 border-2 border-blue-500 shadow-md active:bg-blue-600 rounded-md hover:cursor-pointer text-white"
          onClick={() => loggingTest(finalData?.Quantity ?? "")}
        >
          Download Report
        </button>
      </div>

      {scanned && (
        <div
          ref={modalRef}
          className="h-full w-full place-self-center absolute left-0 top-0 bg-black/10 justify-self-center flex justify-center items-center"
        >
          <div className="w-1/4 bg-white shadow-lg shadow-black/60 rounded-2xl p-4 flex flex-col relative pb-20">
            <input
              type="number"
              ref={inputRef}
              className="border-2 border-gray-400 rounded-lg px-4 h-20 text-xl text-gray-600 bg-gray-100"
              onChange={(e) => handleQuantityChange(e)}
              placeholder="Enter Quantity"
              style={{
                WebkitAppearance: "none",
                // MozAppearance: "textfield",
                // appearance: "none",
              }}
            />

            <div className="flex items-center w-full flex-col text-lg text-gray-500 py-4 gap-4">
              <div className="flex w-full justify-between">
                <p className="font-semibold">TrayNumber: </p>
                <p className="text-sm">
                  {finalData?.TrayNumber ? finalData.TrayNumber : "N17252"}
                </p>
              </div>

              <div className="flex w-full justify-between items-center">
                <p className="font-semibold">Timestamp:</p>
                <p className="text-sm">
                  {finalData?.Timestamp ? finalData.Timestamp : "07:00"}
                </p>
              </div>
            </div>

            <div className="flex w-full justify-end items-center gap-2 absolute bottom-4 right-4">
              <div
                className="border-1 border-red-400 px-4 py-1 rounded-lg text-red-400 hover:cursor-pointer active:opacity-75"
                onClick={cancel}
              >
                Cancel
              </div>
              <div
                onClick={handleEnter}
                className="shadow-md px-4 py-1 bg-blue-500 rounded-lg text-white border-1 border-blue-500 hover:cursor-pointer active:opacity-90"
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
