import React, { useContext } from "react";
import ThemeDialog from "../components/setting/ThemeDialog";
import { MdLogout } from "react-icons/md";

const Setting = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* setting logo */}
      <div className="p-5">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* user profile */}
      <div className="flex px-5 items-center gap-3">
        <div className="rounded-full cursor-pointer bg-primary-content overflow-hidden w-20 h-20">
          <img
            src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
            alt="myprofile"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Harsh Kavaiya</p>
          <p className="text-sm">User Description</p>
        </div>
      </div>

      {/* theme button */}
      <button
        className="btn mx-5 my-5"
        onClick={() => document.getElementById("theme").showModal()}
      >
        Change Theme
      </button>
      <ThemeDialog />

      {/* others options */}
      <div className="flex flex-col">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-10 cursor-pointer hover:bg-primary/10"
          >
            <span className="col-span-2 grid place-items-center">
              <MdLogout size={20} />
            </span>
            <span className="col-span-8 border-b border-base-300 py-4">
              <p className="">Logout</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Setting;
