import { IoSettingsOutline } from "react-icons/io5";
import { TbCircleDashed } from "react-icons/tb";
import { MdChat } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import useHomePageNavi from "../store/useHomePageNavi";
import useAuthStore from "../store/useAuthStore";

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
  const { SetActivePage, activePage } = useHomePageNavi.getState();
  const { authUser } = useAuthStore.getState();
  return (
    <div className="h-screen w-full flex flex-col justify-between items-center py-5">
      {/* top */}
      <div className="flex flex-col items-center w-full gap-5">
        {sideIcon.map((item, idx) => (
          <div
            key={idx}
            className="tooltip tooltip-right"
            data-tip={item.page.toUpperCase()}
          >
            <span
              className={`${
                activePage === item.page &&
                "bg-gradient-to-r from-primary/10 to-primary/0 border-l-2 border-primary"
              } w-16 h-12 grid place-items-center cursor-pointer`}
              onClick={() => SetActivePage(item.page)}
            >
              <item.icon
                size={25}
                className="text-primary absolute inset-x-5"
              />
            </span>
          </div>
        ))}
      </div>
      {/* bottom */}
      <div className="flex flex-col items-center gap-7">
        {/* setting */}
        <div className="tooltip tooltip-right" data-tip="SETTINGS">
          <span
            className={`${
              activePage === "settings" &&
              "bg-gradient-to-r from-primary/10 to-primary/0 border-l-2 border-primary"
            } w-16 h-12 grid place-items-center cursor-pointer`}
            onClick={() => SetActivePage("settings")}
          >
            <IoSettingsOutline
              size={25}
              className="cursor-pointer absolute inset-x-5 text-primary"
            />
          </span>
        </div>
        {/* User */}
        <div
          className={`tooltip w-16 h-12 grid py-2 place-content-center tooltip-right ${
            activePage === "myprofile" &&
            "bg-gradient-to-r from-primary/10 to-primary/0 border-2 border-y-transparent border-r-transparent border-primary"
          }`}
          data-tip="MY PROFILE"
        >
          <div
            className="w-10 h-10 rounded-full cursor-pointer overflow-hidden"
            onClick={() => SetActivePage("myprofile")}
          >
            <img
              src={
                authUser?.profilePic ||
                 "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
              }
              className="object-cover object-center w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideSetting;
