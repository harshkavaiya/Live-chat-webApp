import { FiPhoneCall } from "react-icons/fi";
import { MdChat } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbCircleDashed } from "react-icons/tb";
import useHomePageNavi from "../store/useHomePageNavi";

const BottomBar = () => {
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
  const { SetActivePage, activePage } = useHomePageNavi.getState();
  return (
    <div className="flex items-center w-full justify-around">
      {sideIcon.map((icon, idx) => (
        <div
          key={idx}
          className="flex flex-col cursor-pointer w-20 rounded-t-btn items-center"
          onClick={() => SetActivePage(icon.page)}
        >
          <span
            className={`w-11 h-11 grid place-items-center rounded-box cursor-pointer ${
              activePage == icon.page && "bg-primary/15"
            }`}
          >
            <icon.icon
              size={25}
              className={`${
                activePage == icon.page ? "text-primary" : "text-primary/40"
              }`}
            />
          </span>
          <p className="text-base text-primary capitalize">{icon.page}</p>
        </div>
      ))}
    </div>
  );
};

export default BottomBar;
