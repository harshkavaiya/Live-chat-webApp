import React, { useContext } from "react";
import ThemeDialog from "../components/setting/ThemeDialog";
import { MdLogout } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import useAuthStore from "../store/useAuthStore";
import useHomePageNavi from "../store/useHomePageNavi";

const Setting = () => {
  const icons = [
    {
      icon: MdLockOutline,
      name: "privacy",
    },
    {
      icon: MdLogout,
      name: "Logout",
    },
  ];
  const { SetActivePage } = useHomePageNavi.getState();
  const { logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* setting logo */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* user profile */}
      <div
        className="flex px-5 py-2 items-center cursor-pointer gap-3 hover:bg-primary/10"
        onClick={() => SetActivePage("myprofile")}
      >
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
        {icons.map((i, idx) => (
          <div
            key={idx}
            className="grid grid-cols-10 cursor-pointer hover:bg-primary/10"
            onClick={
              i.name == "Logout" ? () => logout() : () => alert("Privacy")
            }
          >
            <span className="col-span-2 grid place-items-center">
              <i.icon
                size={22}
                className={`${i.name == "Logout" && "text-red-500"}`}
              />
            </span>
            <span className="col-span-8 border-b border-base-300 py-4">
              <p
                className={`text-[1.1rem] capitalize ${
                  i.name == "Logout" && "text-red-500"
                }`}
              >
                {i.name}
              </p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Setting;
