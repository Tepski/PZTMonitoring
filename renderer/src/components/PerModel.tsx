interface ModelProps {
  table: (string | number)[][] | null;
}

const PerModel = ({ table }: ModelProps) => {
  return (
    <div className="flex h-full flex-1/4 rounded-2xl shadow-sm shadow-black/60 overflow-hidden bg-[#ffffff]">
      <table className="w-full table-fixed text-gray-600">
        <thead className={`bg-[#4f52b2] h-1/7 border-b-2 border-gray-300`}>
          <tr className="">
            {table &&
              table[0]?.map((header, headerIndex) => {
                return (
                  <th
                    className={`text-sm font-semibold text-gray-300 ${
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
        <tbody className="divide-y-2 divide-gray-200">
          {table &&
            table.slice(1, 3)?.map((row, rowIndex) => {
              return (
                <tr key={rowIndex.toString()} className={` hover:bg-gray-200/20 bg-[#ffffff]`}>
                  {row.map((col, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`border-r-1 border-gray-200 ${
                          colIndex == 0 ? "w-[10%] ps-4" : "text-center"
                        }`}
                      >
                        {col == 0 ? "" : col}
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
