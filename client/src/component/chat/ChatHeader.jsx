import React, { useRef } from "react";
import { IoEllipsisVerticalSharp, IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import { OpenCloseMenu } from "../../function/function";

const ChatHeader = ({ setIsSelectMessage }) => {
  const headerMenuRef = useRef();

  return (
    <>
      <div className="flex items-center justify-between p-3 shadow border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-20 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
              J
            </div>
            <Link
              to={"/profile/12"}
              className="ml-4 font-semibold text-2xl w-full"
            >
              Hardik
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <IoVideocam className="cursor-pointer" size={20} />
          <IoEllipsisVerticalSharp
            onClick={() => OpenCloseMenu(headerMenuRef)}
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
            <Link to={"/profile/12"}>Profile</Link>
          </li>
          <li onClick={() => setIsSelectMessage(true)}>
            <p>Select Messages</p>
          </li>
          <li>
            <p>Close Chat</p>
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
