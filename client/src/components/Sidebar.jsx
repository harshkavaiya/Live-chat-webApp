import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const Sidebar = () => {
  const receiveMessage = true; //if messeage is receiver or not seen
  const users = [...Array(20).keys()];
  return (
    <div className="h-full w-full flex flex-col gap-2  relative transition-all duration-200 ">
      {/* user online */}
      <div className="flex flex-col w-full pl-2 py-2">
        <div className="flex justify-between items-center pr-2 pb-2">
          <p className="text-lg font-bold cursor-default">
            Online Now
            <div className="badge p-0 ml-1 w-6 h-6 badge-primary">
              {users.length}
            </div>
          </p>
          <p className="flex items-center text-sm gap-2 cursor-pointer">
            More <FaAngleRight className="text-accent" />
          </p>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pl-2 cursor-pointer">
          {users.map((i) => (
            <div key={i} className="indicator relative ">
              <span className="indicator-item badge badge-success rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
              <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                  alt="user"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* search */}
      <div className="relative px-4">
        <span className="absolute inset-y-0 left-7 flex items-center text-gray-500">
          <CiSearch size={20} />
        </span>
        <input
          type="search"
          className="input input-primary h-9 w-full pl-10"
          placeholder="Search messages..."
        />
      </div>

      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <p className="text-lg font-bold pl-2 pb-3 cursor-default">
          Messages
          <div className="badge p-0 ml-1 w-6 h-6 badge-primary">
            {users.length}
          </div>
        </p>
        {/* messeages list */}
        <div className="overflow-y-auto scrollbar-small overflow-x-hidden">
          {users.map((i) => (
            <div className="flex justify-between pl-4 pr-2 border-b border-primary/20 py-2 transition-all duration-75 group hover:bg-primary/10 items-center">
              <div className="flex items-center">
                <div className="bg-base-300 grid w-14 h-14 border-2 border-primary place-items-center rounded-full overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                    alt="user"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col ml-3 gap-1">
                  <p className="text-xl font-semibold">Username</p>
                  <p className="text-xs text-gray-500">
                    User message show here!
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {!receiveMessage ? (
                  <div className="flex justify-start">
                    <GoDotFill size={20} className="text-blue-500" />
                    <GoDotFill size={20} className="text-blue-500" />
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs">10:20 PM</p>

                  <div
                    className={`flex items-center gap-2 group-hover:translate-x-0  transition-all duration-75
                    ${receiveMessage ? "translate-x-7" : "translate-x-10"}`}
                  >
                    {receiveMessage ? (
                      <>
                        <div className="badge badge-primary w-6 h-6">4</div>
                        <FaAngleDown className="cursor-pointer" size={20} />
                      </>
                    ) : (
                      <FaAngleDown className="cursor-pointer" size={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
