interface TotalProps {
  table: (string | number)[][] | null;
}

const TotalOutput = ({ table }: TotalProps) => {
  // const tableCotents = [
  //   ["DAYSHIFT", "NIGHTSHIFT"],
  //   [null, null],
  // ];

  return (
    <div className=" my-2 flex justify-centes w-full flex-col h-full flex-1/2 border-1 border-gray-800 rounded-2xl shadow-sm shadow-black-50 border-b-2xl overflow-hidden">
      <p className="text-4xl text-[#443838] py-4 font-semibold bg-blue-400/40 w-full text-center border-b-1 border-gray-800 rounded-t-2xl">
        Total Output
      </p>
      <table className="w-full table-fixed h-full text-gray-600">
        <tbody>
          {table &&
            table.map((row, rowIndex) => {
              return (
                <tr
                  key={rowIndex.toString()}
                  className={`text-center ${
                    rowIndex == 0
                      ? "font-semibold bg-gray-300 h-8 border-b-1 border-gray-800"
                      : "h-auto font-bold text-7xl text-shadow-md text-shadow-black/50"
                  }`}
                >
                  {row.map((cell, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`border-1 border-gray-300 ${
                          colIndex == 0 && rowIndex == 1
                            ? "text-yellow-500"
                            : "text-gray-500"
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

export default TotalOutput;
