import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { TbCircleDashed } from "react-icons/tb";
import { MdChat } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";

const SideSetting = () => {
  const sideIcon = [
    {
      icon: MdChat,
      page: "chat",
      active: true,
    },
    {
      icon: TbCircleDashed,
      page: "status",
      active: false,
    },
    {
      icon: FiPhoneCall,
      page: "call",
      active: false,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-primary-content justify-between items-center py-5">
      {/* top */}
      <div className="flex flex-col items-center gap-7">
        {sideIcon.map((item, idx) => (
          <span
            key={idx}
            className={`${
              item.active
                ? "w-12 h-12 grid place-items-center cursor-pointer bg-secondary-content rounded-full"
                : "cursor-pointer"
            }`}
          >
            <item.icon size={25} className="text-primary" />
          </span>
        ))}
      </div>
      {/* bottom */}
      <div className="flex flex-col items-center gap-7">
        {/* setting */}
        <IoSettingsOutline size={25} className="cursor-pointer text-primary" />
        {/* User */}
        <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden">
          <img
            src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
            alt="user"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SideSetting;
