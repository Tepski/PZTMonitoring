import { Square, Minus, X, Copy } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logonpi.png";

interface NavBarProps {
  FS: boolean;
}

const NavBar = ({ FS }: NavBarProps) => {
  const [isMax, setIsMax] = useState<boolean>(true);

  const close = async () => {
    await window.electronApi.winClose();
  };

  const minimize = async () => {
    await window.electronApi.minimize();
  };

  const maximize = async () => {
    window.electronApi.maximize();

    setIsMax(!isMax);
  };

  return (
    <div className="navBarTitle absolute w-full items-center right-0 top-0 flex justify-between ps-2">
      <img src={logo} alt="" className="h-8 pt-2" />
      {!FS && (
        <div className="navBarButtons flex items-center">
          <div
            className="hover:bg-gray-400 ease-linear transition-all transition-2 py-2  hover:cursor-pointerss px-4"
            onClick={minimize}
          >
            <Minus color="gray" size={15} />
          </div>
          <div
            className="hover:bg-gray-400 ease-linear transition-all transition-2 py-2  hover:cursor-pointerss px-4"
            onClick={maximize}
          >
            {isMax ? (
              <Copy color="gray" size={15} />
            ) : (
              <Square color="gray" size={15} />
            )}
          </div>
          <div
            className="hover:bg-gray-400 ease-linear transition-all transition-2 py-2  hover:cursor-pointerss px-4"
            onClick={close}
          >
            <X color="gray" size={15} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
