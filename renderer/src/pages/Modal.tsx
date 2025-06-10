interface ErrorProps {
  setWarningSet: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorMessage = ({ setWarningSet }: ErrorProps) => {
  return (
    <div
      className={`bg-[rgba(0,0,0,0.1)] w-screen h-screen absolute left-0 flex justify-center items-center`}
    >
      <div className="bg-white h-[50%] w-[50%] rounded-3xl shadow-2xl flex relative justify-center items-center">
        <p className="text-2xl text-center">
          The excel file might be open from a network computer, please close
          excel file to send data.
        </p>
        <p className="absolute top-10 left-10 text-3xl text-red-500/80">
          WARNING!
        </p>
        <p
          onClick={() => setWarningSet(false)}
          className="absolute bottom-10 right-10 text-2xl bg-[#4f52b2] text-white px-10 rounded-xl"
        >
          OK
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
