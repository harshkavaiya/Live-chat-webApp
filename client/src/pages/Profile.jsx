import { IoChevronDownOutline } from "react-icons/io5";
import { FiShare2 } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import {
  MdOutlineFileDownload,
  MdOutlineBlock,
  MdNotificationsActive,
} from "react-icons/md";
import { IoClose, IoVolumeMuteSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { OpenCloseMenu } from "../function/function";

const Profile = ({ setIsProfileOpen }) => {
  const [isdocumentRotate, setIsdocumentRotate] = useState(false);
  const [ismediaRotate, setIsmediaRotate] = useState(false);
  const documentRef = useRef();
  const mediaRef = useRef();

  return (
    <div className="w-full mx-auto z-20  bg-base-100 text-base-content/80 font-medium absolute left-0 top-0">
      {/* Header */}
      <div className="relative p-2 border-b text-center border-base-300 ">
        <button className="absolute right-4 top-4">
          <IoClose
            onClick={() => setIsProfileOpen(false)}
            className="h-5 w-5 "
          />
        </button>
        <h2 className="text-2xl font-bold ">Profile</h2>
      </div>

      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-base-300 ">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-semibold">Josephin water</h1>
        <p className="text-sm ">91+ 9191919191</p>
      </div>

      {/* Shared Documents */}
      <div className="border-b border-base-300">
        <button
          onClick={() => {
            OpenCloseMenu(documentRef);
            setIsdocumentRotate(!isdocumentRotate);
          }}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center gap-2 ">
            <span className="font-medium">Shared Document</span>
            <span className=" text-xs px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <IoChevronDownOutline
            className={`h-5 w-5 transition-all duration-300 ${
              isdocumentRotate ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        <div ref={documentRef} className="px-4 pb-4 hidden">
          <div className="space-y-3 h-[120px] overflow-y-scroll">
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Simple_practice_project.zip
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Word_Map.jpg
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Latest_Design_portfolio.pdf
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Simple_practice_project.zip
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Word_Map.jpg
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Latest_Design_portfolio.pdf
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Simple_practice_project.zip
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Word_Map.jpg
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Latest_Design_portfolio.pdf
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Simple_practice_project.zip
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Word_Map.jpg
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="">📄</span>
              Latest_Design_portfolio.pdf
            </div>
          </div>
        </div>
      </div>

      {/* Shared Media */}
      <div className="border-b border-base-300  ">
        <button
          onClick={() => {
            OpenCloseMenu(mediaRef);
            setIsmediaRotate(!ismediaRotate);
          }}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Shared Media</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full">7</span>
          </div>
          <IoChevronDownOutline
            className={`h-5 w-5 transition-all duration-300 ${
              ismediaRotate ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        <div ref={mediaRef} className="p-2 hidden">
          <div className="grid grid-cols-3 gap-3 h-[270px] overflow-y-scroll">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => (
              <div key={item} className="avatar">
                <div className="w-30 h-30 rounded-md">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-4">
        <ActionMenu icon={<MdOutlineBlock />} lable={"Block"} />
        <ActionMenu icon={<IoVolumeMuteSharp />} lable={"Mute"} />
        <ActionMenu
          icon={<MdNotificationsActive />}
          lable={"Get Notification"}
        />
        <ActionMenu icon={<FiShare2 />} lable={"Share Contact"} />
        <ActionMenu icon={<MdOutlineFileDownload />} lable={"Export Chat"} />

        <ActionMenu icon={<LuTrash2 />} lable={"Clear Chat"} />
      </div>
    </div>
  );
};

const ActionMenu = ({ icon, lable }) => {
  return (
    <button className="flex items-center gap-2 w-full py-1">
      {icon}
      <span>{lable}</span>
    </button>
  );
};
export default Profile;
