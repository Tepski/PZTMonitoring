import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";

interface HeaderProps {
  shift: boolean;
  getTime: () => Promise<TimeProps | undefined>;
  table: tableProps | null;
  total: totalProps | null;
  model: tableProps | null;
  setTable: React.Dispatch<React.SetStateAction<tableProps | null>>;
  setTotal: React.Dispatch<React.SetStateAction<totalProps | null>>;
  setModel: React.Dispatch<React.SetStateAction<tableProps | null>>;
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

const Header = ({
  getTime,
  setTable,
  table,
  total,
  model,
  setTotal,
  shift,
}: HeaderProps) => {
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

  const loggingFunc = async (value: string | number) => {
    const date: TimeProps | undefined = await getTime();
    const time = date?.time[0];

    if (table) {
      const newTable: tableProps = [...table];
      const index = Number(time) - 5;
      newTable[1][index] += value;

      setTable(() => {
        return newTable;
      });
    }

    if (total) {
      const newTotal: totalProps = [...total];
      const index = shift ? 0 : 1;
      if (typeof newTotal[1][index] === "number") {
        let updatedTotal = table
          ? (newTotal[1][index] as unknown as number)
          : 0;
        updatedTotal = updatedTotal + (value as number);
        newTotal[1][index] = updatedTotal;
        setTotal(() => {
          return newTotal;
        });
      }
    }

    const dataToStore = {
      table: table ? [table[1], table[2]] : null,
      total: total ? total[1] : null,
      model: model ? [model[1], model[2]] : null,
      hourly: finalData ? finalData : null,
    };

    const stringed = JSON.stringify(dataToStore);

    setToLocal(stringed);
  };

  const enterDeps = [setScanned, setFinalData, finalData];

  const handleEnter = useCallback(() => {
    setScanned((prev) => !prev);

    loggingFunc(Number(finalData?.Quantity ?? ""));

    // setFinalData((prev) => ({
    //   ...prev,
    //   TrayNumber: "",
    // }));

    if (ref.current) {
      ref.current.value = "";
    }

    // loggingFunc(finalData?.Quantity ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, enterDeps);

  // const handleLocalStorage = (): void => {
  //   return
  // }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const time: TimeProps | undefined = await getTime();

    setFinalData((prev: FinalDataInterface) => ({
      ...prev,
      TrayNumber: e.target.value,
      Timestamp: time?.day as string,
    }));
  };

  const setToLocal = async (value: string) => {
    const time: TimeProps | undefined = await getTime();
    localStorage.setItem(time ? time.day : "", value);

    console.log(value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFinalData((prev) => ({ ...prev, Quantity: e.target.value }));
  };

  useEffect(() => {
    const scannerListener = (e: KeyboardEvent) => {
      if (e.key == "ArrowDown") {
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
          // value={finalData && finalData.TrayNumber}
          onChange={(e) => handleChange(e)}
          className="border-2 px-2 py-1 rounded-md caret-transparent"
          placeholder="Scan JO Batch Barcode"
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
          onClick={() => loggingFunc(finalData?.Quantity ?? "")}
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
              <div className="flex w-full justify-between items-center">
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
