interface OutputProps {
  table: (string | number)[][] | null;
}

const Output = ({ table }: OutputProps) => {
  // useEffect(() => {
  //   if (table) return;

  //   const tempTime = ["Shift"];
  //   const DS = ["Dayshift"];
  //   const NS = ["Nightshift"];

  //   for (let i = 6; i < 18; i++) {
  //     const time = `${i < 9 ? "0" + i : i}:00-${
  //       i + 1 < 9 ? "0" + (i + 1) : i + 1
  //     }:00`;
  //     tempTime.push(time);
  //     DS.push("");
  //     NS.push("");
  //   }

  //   setTable((prev) => [...(prev || []), tempTime, DS, NS]);
  // }, [table]);

  return (
    <div className="flex h-full flex-1/4 rounded-2xl mb-2 overflow-hidden shadow-sm shadow-black/50 bg-[#ffffff]">
      <table className="w-full table-fixed h-full">
        <thead className="bg-[#4f52b2]">
          <tr>
            {table &&
              table[0].map((head, headIndex) => {
                return (
                  <th
                    key={headIndex.toString()}
                    className={`text-gray-300 font-semibold text-xs py-1 ${
                      headIndex == 0 && "text-left border-none ps-4"
                    }`}
                  >
                    {head}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table &&
            table.slice(1, 3).map((row, rowIndex) => {
              return (
                <tr
                  key={rowIndex.toString()}
                  className={`font-semibold h-12  text-lg hover:bg-gray-200/20`}
                >
                  {row.map((cell, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`font-normal text-gray-600 border-r-1 border-gray-200 ${
                          colIndex > 0 ? "text-center font-semibold" : "ps-4 "
                        }`}
                      >
                        {cell == 0 ? "" : cell}
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
