interface ModelProps {
  table: (string | number)[][] | null;
}

const PerModel = ({ table }: ModelProps) => {
  return (
    <div className="flex h-full flex-1/8 rounded-2xl shadow-sm shadow-black/60 overflow-hidden border-1 border-gray-800">
      <table className="w-full table-fixed text-gray-600">
        <thead className={`bg-blue-400/40 h-1/7 border-b-2 border-gray-300`}>
          <tr className="">
            {table &&
              table[0]?.map((header, headerIndex) => {
                return (
                  <th
                    className={`text-sm font-semibold text-gray-500 ${
                      headerIndex == 0 && "text-left ps-4"
                    }`}
                    key={headerIndex.toString()}
                  >
                    {header}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-gray-300">
          {table &&
            table.slice(1, 3)?.map((row, rowIndex) => {
              return (
                <tr key={rowIndex.toString()} className={``}>
                  {row.map((col, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`${
                          colIndex == 0 ? "w-[10%] ps-4" : "text-center"
                        }`}
                      >
                        {col}
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

export default PerModel;
