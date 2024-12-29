import React, { useEffect, useRef, useState } from "react";
import { IoEllipsisVerticalSharp, IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import { OpenCloseMenu } from "../../function/function";
import useFunctionStore from "../../store/useFuncationStore";

const ChatHeader = ({ setIsProfileOpen }) => {
  const headerMenuRef = useRef();
  const [key, setKey] = useState(0);
  const { openSelection } = useFunctionStore();
  useEffect(() => {
    headerMenuRef.current.classList.add("hidden");
  }, [key]);

  return (
    <>
      <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 bg-base-100 h-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-20 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
              J
            </div>
            <Link
              onClick={() => {
                setIsProfileOpen(true);
              }}
              className="ml-4 font-semibold text-2xl w-full"
            >
              Hardik
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <IoVideocam className="cursor-pointer" size={20} />
          <IoEllipsisVerticalSharp
            onClick={() => {
              OpenCloseMenu(headerMenuRef);
            }}
            className="cursor-pointer"
            size={20}
          />
        </div>
      </div>
      {/*Header menu */}
      <div
        ref={headerMenuRef}
        className="absolute right-2 z-20 top-[50px] hidden"
      >
        <ul className="menu bg-base-100 rounded-md border border-base-300 w-56 p-0 [&_li>*]:rounded-none">
          <li>
            <button
              onClick={() => {
                setIsProfileOpen(true);
              }}
            >
              Profile
            </button>
          </li>
          <li
            onClick={() => {
              openSelection();
              setKey(Math.random());
            }}
          >
            <p>Select Messages</p>
          </li>
          <li>
            <Link to={"/"}>Close Chat</Link>
          </li>
          <li>
            <p>Clear Chat</p>
          </li>
          <li>
            <p>Report</p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ChatHeader;
