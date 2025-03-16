import { CiSearch } from "react-icons/ci";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { useEffect, useState } from "react";
import useMessageStore from "../store/useMessageStore";
import { formatMessageTime } from "../function/TimeFormating";
import SidebarUser from "./Skeleton/SidebarUser";
import ContactDialog from "./PopUpDialog/ContactDialog";
import useContactList from "../store/useContactList";
import GroupDialog from "./PopUpDialog/GroupDialog";
import useSearch from "../function/SearchFunc";
import { MdMenuOpen } from "react-icons/md";
import useAuthStore from "../store/useAuthStore";
import { IoQrCodeOutline } from "react-icons/io5";
import useHomePageNavi from "../store/useHomePageNavi";
import { decryptData, generateUniqueId } from "../function/crypto";

import QRScanner from "./Group/ScannerQR";

const Sidebar = () => {
  const receiveMessage = true; //if messeage is receiver or not seen
  const [activeTab, setActiveTab] = useState("all");
  const [isOpenScanner, setIsOpenScanner] = useState(false);

  const { getMessagerUser, messagerUser, isLoading, selectUsertoChat } =
    useMessageStore();
  const [activeTabData, setActiveTabData] = useState(messagerUser);
  const { FetchOnlineUsers, onlineUsers } = useAuthStore();
  const { activePage } = useHomePageNavi.getState();
  useEffect(() => {
    FetchOnlineUsers();
  }, []);

  const openQRscanner = () => {
    setIsOpenScanner(true);
    document.getElementById("Qr_scanner").showModal();
  };

  useEffect(() => {
    if (!messagerUser) return;

    if (activeTab === "all") {
      setActiveTabData(messagerUser);
    } else if (activeTab === "Individual") {
      setActiveTabData(messagerUser.filter((i) => i.type === "Single"));
    } else if (activeTab === "group") {
      setActiveTabData(messagerUser.filter((i) => i.type === "Group"));
    }
  }, [activeTab, messagerUser]);

  const { setDialogOpen } = useContactList();
  const { searchQuery, filteredData, handleSearchChange } =
    useSearch(activeTabData);

  const Opendialog = (dialog) => {
    if (dialog === 4) setDialogOpen(true);

    document.getElementById(`my_modal_${dialog}`).showModal();
  };

  useEffect(() => {
    getMessagerUser();
  }, [getMessagerUser]);

  if (isLoading) return <SidebarUser />;

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <ContactDialog />
      <GroupDialog />
      <QRScanner open={isOpenScanner} setOpen={setIsOpenScanner} />

      {/* user online */}
      <div className="flex flex-col w-full pl-2 py-2">
        <div className="flex justify-between items-center pr-2 pb-2">
          <div className="text-lg flex items-center font-bold gap-px cursor-default">
            Online Now
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {onlineUsers.length}
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1">
              <MdMenuOpen size={23} className="text-primary cursor-pointer" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu text-primary bg-primary-content/90 rounded-lg z-[1] w-48 p-1 shadow font-semibold"
            >
              <li>
                <div className="flex items-center" onClick={openQRscanner}>
                  <IoQrCodeOutline size={20} />
                  <p className="text-sm">Scan to join group</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pl-2 cursor-pointer">
          {onlineUsers.length === 0 ? (
            <p className="text-center badge badge-outline">
              No any users online
            </p>
          ) : (
            onlineUsers.map((i, index) => (
              <div key={index} className="indicator relative">
                <span className="indicator-item badge badge-success rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
                <div className="bg-base-300 grid w-14 h-14 place-items-center rounded-full overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                    alt="user"
                    className="object-cover"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <div className="text-lg flex flex-col gap-1 justify-between font-bold px-2 py-2 cursor-default">
          <span className="text-lg flex items-center font-bold gap-px cursor-default">
            Messages
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {filteredData.length}
            </div>
          </span>
          {/* search */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <CiSearch size={20} />
            </span>
            <input
              type="search"
              className="input font-normal text-sm input-primary h-9 w-full pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search name or number"
            />
          </div>
          <div className="flex w-full gap-2 p-2 select-none">
            <div
              className={`badge badge-lg cursor-pointer border-none ${
                activeTab == "all"
                  ? "badge-primary"
                  : "bg-base-100/40 text-opacity-70"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </div>
            <div
              className={`badge badge-lg cursor-pointer border-none ${
                activeTab == "Individual"
                  ? "badge-primary"
                  : "bg-base-100/40 text-opacity-70"
              }`}
              onClick={() => setActiveTab("Individual")}
            >
              Individual
            </div>
            <div
              className={`badge badge-lg cursor-pointer border-none ${
                activeTab == "group"
                  ? "badge-primary"
                  : "bg-base-100/40 text-opacity-70"
              }`}
              onClick={() => setActiveTab("group")}
            >
              Groups
            </div>
            {/* <div
              className={`badge badge-lg cursor-pointer border-none ${
                activeTab == "unread"
                  ? "badge-primary"
                  : "bg-base-100/40 text-opacity-70"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </div> */}
          </div>
        </div>

        {/* messeages list */}
        <div className="overflow-y-auto w-full relativ scrollbar-small overflow-x-hidden">
          {filteredData.length === 0 ? (
            <p className="text-center inset-x-0 inset-y-1/2 absolute">
              No contacts found
            </p>
          ) : (
            filteredData.map((i, idx) => {
              const {
                lastMessageTime,
                fullname,
                profilePic,
                sender,
                receiver,
                lastMessageType,
              } = i;

              const secretKey = generateUniqueId(sender, receiver);

              const data =
                lastMessageType == "text"
                  ? decryptData(i.lastMessage, secretKey)
                  : i.lastMessage;
              const lastMessage = data || i.lastMessage;

              return (
                <div
                  key={idx}
                  onClick={() => selectUsertoChat(i)}
                  className={`flex justify-between pl-4 md:border-b w-full pr-2 border-primary/20 py-2 group hover:bg-primary/10 items-center
                ${idx == messagerUser.length - 1 && "border-b"}`}
                >
                  <div className="flex items-center w-full">
                    <div className="bg-base-300 grid w-14 h-14 border-2 border-primary place-items-center rounded-full overflow-hidden">
                      <img
                        src={
                          profilePic ||
                          "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                        }
                        alt="user"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col w-2/3 ml-3 gap-1">
                      <p className="text-lg font-semibold">{fullname}</p>
                      <p className="text-sm truncate text-primary-content">
                        {lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!receiveMessage && (
                      <div className="flex justify-start">
                        <GoDotFill size={20} className="text-blue-500" />
                        <GoDotFill size={20} className="text-blue-500" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 items-center w-14">
                      <p className="text-xs w-full">
                        {formatMessageTime(lastMessageTime)}
                      </p>

                      <div className="items-center flex">
                        <div
                          className={`${
                            i.unseen > 0 ? "badge badge-primary" : ""
                          } w-6 h-6`}
                        >
                          {i.unseen || ""}
                        </div>

                        <FaAngleDown
                          className="cursor-pointer  group-hover:block hidden"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {messagerUser.length != 0 && (
            <div className="mb-36 md:mb-5">
              <div className="divider text-xs">end-to-end encrypted</div>
            </div>
          )}
        </div>
      </div>

      {/* menus */}
      <div
        className={`${
          activePage === "chat" ? "block" : "hidden"
        } fixed sm:absolute right-2 bottom-20 sm:bottom-1`}
      >
        <div className="dropdown dropdown-top dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn w-16 h-16 shadow-lg rounded-full m-1"
          >
            <GoPencil size={23} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-20 p-2 shadow-lg gap-1"
          >
            <li>
              <button className="btn btn-ghost" onClick={() => Opendialog(4)}>
                Contacts
              </button>
            </li>
            <li>
              <button className="btn btn-ghost" onClick={() => Opendialog(5)}>
                Groups
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
