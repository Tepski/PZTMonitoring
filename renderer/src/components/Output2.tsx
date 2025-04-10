import { useEffect, useState } from "react";

const Output = () => {
  const [table, setTable] = useState<string[][] | null>(null);

  useEffect(() => {
    if (table) return;

    const tempTime = ["Shift"];
    const DS = ["Dayshift"];
    const NS = ["Nightshift"];

    for (let i = 6; i < 18; i++) {
      const time = `${i < 9 ? "0" + i : i}:00-${
        i + 1 < 9 ? "0" + (i + 1) : i + 1
      }:00`;
      tempTime.push(time);
      DS.push("");
      NS.push("");
    }

    setTable((prev) => [...(prev || []), tempTime, DS, NS]);
  }, [table]);

  return (
    <div className="flex h-full flex-1/4 border-1 rounded-2xl">
      <table className="w-full table-auto h-full">
        <tbody className="divide-x divide-y divide-gray-200">
          {table &&
            table.map((row, rowIndex) => {
              return (
                <tr
                  key={rowIndex.toString()}
                  className={`${
                    rowIndex == 0
                      ? "bg-blue-400/40 font-semibold h-[10%]"
                      : "h-12"
                  } text-lg hover:bg-gray-100`}
                >
                  {row.map((cell, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`bor2der-1 ${
                          colIndex > 0 ? "text-center" : "ps-2"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Output;
