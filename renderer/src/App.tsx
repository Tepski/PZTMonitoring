import { useState, useEffect, useCallback } from "react";

import Header from "./components/Header";
import Output from "./components/Output";
import TotalOutput from "./components/TotalOutput";
import PerModel from "./components/PerModel";

// Use colors #ebebeb and #daebec

const tableDefault: tableProps = [
  [
    "",
    "06:00-07:00",
    "07:00-08:00",
    "08:00-9:00",
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
  ],
  ["Dayshift", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["Nightshift", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const tableTotalDefault: totalProps = [
  ["Dayshift", "NightShift"],
  [0, 0],
];

const tableModelDefault: tableProps = [
  ["", "HP", "5.3", "23W", "23A", "23P", "26MB", "15M"],
  ["Dayshift", 0, 0, 0, 0, 0, 0, 0],
  ["NightShift", 0, 0, 0, 0, 0, 0, 0],
];

function App() {
  const [table, setTable] = useState<tableProps | null>(tableDefault);
  const [tableTotal, setTableTotal] = useState<totalProps | null>(
    tableTotalDefault
  );
  const [tableModel, setTableModel] = useState<tableProps | null>(
    tableModelDefault
  );
  const [dayshift, setDayShift] = useState<boolean>(true);

  const getTime = async (): Promise<TimeProps | undefined> => {
    try {
      const res = await window.electronApi.getTime();
      return res;
    } catch {
      console.log("An error occured");
    }
  };

  const getLocalItem = (key: string): localItemProps | null => {
    const data: string | null = localStorage.getItem(key);
    if (data) {
      const parsedData = JSON.parse(data) as localItemProps;

      return parsedData;
    } else {
      return null;
    }
  };

  const applyValues = useCallback(async () => {
    const time: TimeProps | undefined = await getTime();

    const data = time ? getLocalItem(time.localStorageDate) : null;

    if (data) {
      if (table) {
        const newTable = [...table];
        newTable[1] = data.table[0];
        newTable[2] = data.table[1];

        setTable(newTable as tableProps);
      }

      if (tableTotal) {
        const newTable = [...tableTotal];
        newTable[1] = data.total;

        setTableTotal(newTable as totalProps);
      }

      if (tableModel) {
        const newTable = [...tableModel];
        newTable[1] = data.model[0];
        newTable[2] = data.model[1];

        setTableModel(newTable as tableProps);
      }
    } else {
      setTable(tableDefault);
      setTableTotal(tableTotalDefault);
      setTableModel(tableModelDefault);
    }
  }, [table, tableModel, tableTotal]);

  useEffect(() => {
    applyValues();

    const interval = setInterval(() => {
      getTime().then((time) => {
        setDayShift(time?.time[0] == 18 ? false : true);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [applyValues]);

  const updateTableOnChangeShift = useCallback(() => {
    const newTable: tableProps = table ? [...table] : tableDefault;
    const nsTable = [""];

    const handleTime = (x: number): string => {
      let timer: string = "";
      if (x >= 24) {
        timer = `0${x - 24}`;
      } else {
        timer = String(x);
      }

      return timer;
    };

    for (let i = 18; i < 30; i++) {
      const time = `${handleTime(i)}:00-${handleTime(i + 1)}:00`;
      nsTable.push(time);
    }

    newTable[0] = nsTable;

    setTable(newTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTable]);

  useEffect(() => {
    if (!dayshift) {
      updateTableOnChangeShift();
    }
  }, [dayshift, updateTableOnChangeShift]);

  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center select-none relative bg-gradient-to-rs from-[#e5e7e4]s to-[#daebec]s">
      <div className="w-full h-full bg-red-200/40 absolute top-0 left-0 flex z-0">
        <div className="h-full w-2/5 bg-[#e5e7e4]"></div>
        <div className="h-full w-1/5 bg-gradient-to-r from-[#e5e7e4] to-[#daebec]"></div>
        <div className="h-full w-2/5 bg-[#daebec]"></div>
      </div>
      {/* <TitleBar /> */}
      <div className="container flex flex-col h-full w-[97%] pb-4 z-10">
        <Header
          shift={dayshift}
          getTime={getTime}
          table={table}
          total={tableTotal}
          model={tableModel}
          setTable={setTable}
          setTotal={setTableTotal}
          setModel={setTableModel}
        />
        <TotalOutput table={tableTotal} />
        <Output table={table} />
        <PerModel table={tableModel} />
      </div>
    </div>
  );
}

export default App;
