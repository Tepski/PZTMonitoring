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

const finalDataDefaultValue: FinalDataInterface = {
  TrayNumber: "",
  Quantity: 0,
  TimeStamp: "",
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
  const [prevValue, setPrevValue] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [onEdit, setOnEdit] = useState<boolean>(false);
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

  const loggingFunc = useCallback(
    async (value: string | number) => {
      const date: TimeProps | undefined = await getTime();
      const time = date?.time[0];

      const setToLocal = async (value: string) => {
        localStorage.setItem(date ? date.localStorageDate : "", value);

        console.log(value);
      };

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
          let updatedTotal = table ? (newTotal[1][index] as number) : 0;
          updatedTotal = updatedTotal + (value as number);
          newTotal[1][index] = updatedTotal;
          setTotal(() => {
            return newTotal;
          });
        }
      }

      const hourly = localStorage.getItem(date ? date.localStorageDate : "");
      let hrlyArr: localItemProps | undefined = undefined;
      if (hourly) {
        hrlyArr = JSON.parse(hourly);
        hrlyArr?.hourly.push(finalData);

        console.log("HourlyFound", hrlyArr);
      } else {
        console.log("No hourly found");
      }

      const dataToStore = {
        table: table ? [table[1], table[2]] : null,
        total: total ? total[1] : null,
        model: model ? [model[1], model[2]] : null,
        hourly: hrlyArr ? hrlyArr.hourly : [finalData],
      };

      const stringed = JSON.stringify(dataToStore);

      setToLocal(stringed);
    },
    [finalData, getTime, model, setTable, setTotal, shift, table, total]
  );

  // const handleDeleteLocal = async () => {
  //   const time: TimeProps | undefined = await getTime();
  //   localStorage.removeItem(time ? time.day : "");
  // };

  const handleEdit = () => {
    setScanned(true);
    setOnEdit(true);
  };

  const handleEnter = useCallback(() => {
    setScanned((prev) => !prev);
    if (!onEdit) {
      loggingFunc(Number(finalData?.Quantity ?? ""));

      setPrevValue(finalData.Quantity);

      ref.current?.focus();
    } else {
      console.log("on edit mode");
      const valueToAdd: number = finalData.Quantity - prevValue;

      loggingFunc(valueToAdd);
      const setPrev: number = prevValue + (finalData.Quantity - prevValue);
      setPrevValue(setPrev);

      console.log(finalData.Quantity, prevValue);
      setOnEdit(false);
    }

    if (ref.current) {
      ref.current.value = "";
    }
  }, [finalData, loggingFunc, onEdit, prevValue]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const time: TimeProps | undefined = await getTime();

    setFinalData((prev: FinalDataInterface) => ({
      ...prev,
      TrayNumber: e.target.value,
      TimeStamp: time ? `${time.time[0]}:${time.time[1]}` : "",
    }));
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFinalData((prev) => ({ ...prev, Quantity: Number(e.target.value) }));
    setInputValue(e.target.value);
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
  }, []);

  useEffect(() => {
    if (prevValue != 0) {
      setInputValue(prevValue.toString());
    }
  }, [prevValue]);

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
    <div className="flex justify-between pb-2 py-10 items-center">
      <div className="w-1/3 flex items-center gap-4">
        <input
          ref={ref}
          type="text"
          // value={finalData && finalData.TrayNumber}
          onChange={(e) => handleChange(e)}
          className="border-2 px-2 py-1 rounded-md caret-transparent focus:bg-white"
          placeholder="Scan JO Batch Barcode"
        />
        {prevValue != 0 && (
          <p
            className="text-sm text-gray-500 hover:text-shadow-xs hover:text-shadow-black/20 hover:cursor-pointer active:opacity-80"
            onClick={handleEdit}
          >
            Edit previous value
          </p>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-purple-600">
          PZT Output monitoring
        </p>
      </div>

      <div className="flex w-1/3 justify-end">
        <input
          type="date"
          className="border-2 px-2 py-1 rounded-md"
          defaultValue={new Date().toISOString().split("T")[0]}
        />

        <button className="bg-[#4f52b2] ms-2 px-2 py-1 border-2 border-[#4f52b2] hover:bg-[#4649a0] shadow-sm active:opacity-90 rounded-md hover:cursor-pointer hover:shadow-md hover:shadow-black/50 transition-shadow ease-linear text-white">
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
              // type="number"
              ref={inputRef}
              value={inputValue}
              className="border-2 border-gray-400 rounded-lg px-4 h-20 text-xl text-gray-600 bg-gray-100"
              onChange={(e) => handleQuantityChange(e)}
              placeholder="Enter Quantity"
            />

            <div className="flex items-center w-full flex-col text-lg text-gray-500 py-4 gap-4">
              <div className="flex w-full justify-between items-center">
                <p className="font-semibold">JO Batch: </p>
                <p className="text-sm">
                  {finalData?.TrayNumber ? finalData.TrayNumber : ""}
                </p>
              </div>

              <div className="flex w-full justify-between items-center">
                <p className="font-semibold">Timestamp:</p>
                <p className="text-sm">
                  {finalData?.TimeStamp ? finalData.TimeStamp : ""}
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
