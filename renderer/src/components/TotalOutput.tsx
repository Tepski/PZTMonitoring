interface TotalProps {
  table: (string | number)[][] | null;
}

const TotalOutput = ({ table }: TotalProps) => {
  // const tableCotents = [
  //   ["DAYSHIFT", "NIGHTSHIFT"],
  //   [null, null],
  // ];

  return (
    <div className=" mb-2 flex justify-centes w-full flex-col h-full flex-1/2 rounded-2xl shadow-sm shadow-black/50 overflow-hidden ">
      <p className="text-4xl text-gray-300 py-4 font-semibold bg-[#4f52b2] w-full text-center border-b-1 border-gray-800 rounded-t-2xl">
        Total Output
      </p>
      <table className="w-full table-fixed h-full text-gray-600">
        <tbody className="">
          {table &&
            table.map((row, rowIndex) => {
              return (
                <tr
                  key={rowIndex.toString()}
                  className={`text-center ${
                    rowIndex == 0
                      ? "font-semibold bg-[#dce0fa] h-8 "
                      : "h-auto font-bold text-7xl text-shadow-md text-shadow-black/50 bg-[#ffffff]"
                  }`}
                >
                  {row.map((cell, colIndex) => {
                    return (
                      <td
                        key={colIndex.toString()}
                        className={`border-r-1 border-gray-300 ${
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
