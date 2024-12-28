import React from "react";
import { FiPhoneCall } from "react-icons/fi";
import { MdChat } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbCircleDashed } from "react-icons/tb";

const BottomBar = ({ activePage, setActivePage }) => {
  const sideIcon = [
    {
      icon: MdChat,
      page: "chat",
    },
    {
      icon: TbCircleDashed,
      page: "status",
    },
    {
      icon: FiPhoneCall,
      page: "call",
    },
    {
      icon: IoSettingsOutline,
      page: "settings",
    },
  ];
  return (
    <div className="flex items-center w-full justify-around">
      {sideIcon.map((icon, idx) => (
        <div
          className={`flex flex-col cursor-pointer w-20 rounded-t-btn items-center ${
            activePage === icon.page && "bg-primary/10"
          }`}
          key={idx}
          onClick={() => setActivePage(icon.page)}
        >
          <span className=" w-12 h-12 grid place-items-center cursor-pointer">
            <icon.icon size={25} className="text-primary" />
          </span>
          <p className="text-base text-primary capitalize">{icon.page}</p>
        </div>
      ))}
    </div>
  );
};

export default BottomBar;
