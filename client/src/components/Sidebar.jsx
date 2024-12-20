import React from "react";
import { CiMenuKebab, CiSearch } from "react-icons/ci";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { GoDot, GoDotFill } from "react-icons/go";

const Sidebar = () => {
  const receiveMessage = true; //if messeage is receiver or not seen
  return (
    <div className="h-screen w-full flex flex-col gap-2  relative transition-all duration-200 ">
      {/* user online */}
      <div className="flex flex-col w-full pl-2 py-2">
        <div className="flex justify-between items-center pr-2 pb-2">
          <p className="text-lg font-semibold cursor-default">Online Now</p>
          <p className="flex items-center text-sm gap-2 cursor-pointer">
            More <FaAngleRight className="text-accent" />
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pl-2 cursor-pointer">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="indicator relative ">
              <span className="indicator-item badge badge-success absolute top-3 right-3"></span>
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
          className="input input-primary h-9 w-full pl-12"
          placeholder="Search messages..."
        />
      </div>

      {/* user message */}
      <div className="">
        <p className="text-lg font-semibold pl-2 cursor-default">
          Messages <div className="badge badge-primary">99</div>
        </p>
        {/* messeages list */}
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          {[1, 2, 3, 5, 5, 5, 4].map((i) => (
            <div className="flex justify-between pl-4 pr-2 border-b border-primary/20 py-2 transition-all duration-200 group hover:bg-primary/10 items-center">
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
                ) : null}
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-xs">10:20 PM</p>

                  {receiveMessage ? (
                    <div className="flex items-center gap-2 group-hover:translate-x-0 transition-all duration-200 translate-x-7">
                      <div className="badge badge-primary w-6 h-6">4</div>
                      <FaAngleDown className="cursor-pointer" size={20} />
                    </div>
                  ) : null}
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
