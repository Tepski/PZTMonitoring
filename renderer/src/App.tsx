import { useState, useEffect } from "react";

import Header from "./components/Header";
import TitleBar from "./components/TitleBar";
import Output from "./components/Output";
import TotalOutput from "./components/TotalOutput";
import PerModel from "./components/PerModel";

const tableDefault: (string | number)[][] = [
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

const tableTotalDefault: string[][] = [
  ["Dayshift", "NightShift"],
  ["", ""],
];

const tableModelDefault: string[][] = [
  ["", "HP", "5.3", "23W", "23A", "23P", "26MB", "15M"],
  ["Dayshift", "", "", "", "", "", "", ""],
  ["NightShift", "", "", "", "", "", "", ""],
];

function App() {
  const [table, setTable] = useState<(string | number)[][] | null>(
    tableDefault
  );
  const [tableTotal, setTableTotal] = useState<(string | number)[][] | null>(
    tableTotalDefault
  );
  const [tableModel, setTableModel] = useState<(string | number)[][] | null>(
    tableModelDefault
  );

  const getTime = async (): Promise<string | void> => {
    try {
      const res = await window.electronApi.getTime();

      return res;
    } catch {
      console.log("An error occured");
    }
  };

  useEffect(() => {
    console.log(table);
    const dateObj = new Date();

    // console.log("DATE: ", dateObj.toLocaleDateString());
    console.log(dateObj.getTime())
  }, [table]);

  return (
    <div className="flex h-[100vh] w-[100vw] flex-col items-center select-none relative">
      <TitleBar />
      <div className="container flex flex-col h-full w-[97%] pb-4">
        <Header
          getTime={getTime}
          table={table}
          total={tableTotal}
          model={tableModel}
          setTable={setTable}
          setTotal={setTableTotal}
          setModel={setTableModel}
        />
        <Output table={table} />
        <TotalOutput table={tableTotal} />
        <PerModel table={tableModel} />
      </div>
    </div>
  );
}

export default App;
