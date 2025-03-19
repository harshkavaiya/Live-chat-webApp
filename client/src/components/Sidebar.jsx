import { CiSearch } from "react-icons/ci";
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
                    src={
                      i.profilePhoto ||
                      "data:image/png;base64,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"
                    }
                    alt="user"
                    className="object-cover w-full h-full object-center"
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
                          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEVVYIDn7O3///9TXn/r8PBPW31BTnRLV3pGU3fIztV+h53u8/PW3OBfaYddZ4b09PaOlqikqbh7gppmcIzo6e25vsiGjaKZnrBxepPDxs+ytsPe4Oalrbnh5uiaorLJy9XT1d0+l9ETAAAHqklEQVR4nMWciY6rOgyGQ0NIKEtatrJ0evr+T3kDdKUsv9PCtTTS0dEMfDiO4zh22O4b0Vlzzc+nokzjmLE4TsvidM6vTaa/eiyzB/KPRRkJpaQU3Ahj5ocLKZUSUVkcfXswO6isOnHPMzDMsHxKB+d5/FRlW0FldRIpOUozYJMqSmoLLipUlpeeAoAeYMoryVw0qKaIlMCJehEqKpq1oHSeeoKgpFcuL80Jdg9D6TqVZCW9YMm0hrFAKJ3Hnp2SHsK9GMXCoP6lluP2jiXTfz+DaopvtfTA8hLE5Jeh9JF/YUtDEfy4PIaLUGGqfofUikqv30L9VE29CH5ZUNY8VLb3fo3UitrP+/hZKF/8XE29CDE7DeegjsiqaydcHq2g9OHHFv4u6jBtWJNQupRrMjEmy0mqKagmXcmcniLSKUc6AZVFK+upo4omJuE4VBgT9NTG5VKI/kdSFkkRj/vRUagMZeJCeSpNDuc6z6sqz+vzIUnNf6Fkgo3qagyqiTAmEyMVdegEQeAGbifmH0HghHWBxl4iGrOrESiN2bj09n5oeJwPMWRhtVeQVcoUgtIlwiTZxRkDeoL9XWIES4x4hk+oA/AorvbhDNGNK9wj7lcelqGOwIMEq+a09NRWxQCtq48VZwj1D9CTiPxgGamVwEfmjByuzgOoDJjMZsYAaropC5nJXGRzUDoBHhH7MJOh8mPgM/dzUBfAoDx07G4jWAFxonechroCjlgWJCZDVSDTOZyCQrwmj0Iak/EMETCAqZ6AQryBvBAM6kZ1AVT15hdeoBpkFfX+6FB/yO6DN6NQBeBSREK0qFYCZOESxRjUP+R7ZE1WlIGqkeXG+/cJpVMoBvLpTI7jI0/mT1t/QNXIks7TxgYqhD5Y5kMoDTheA1XaMDlOCT081gOoGtqfi72FSZn5t4fCRi9/hwItShR2UMjEfrGqG1SO7ajWhXpY1Q0K3HquO3xmsXmFasCMz8pQzGteoED1rg51c+sdVBZhf7M6FO838h0UtAxsAcVU/YCCdnqbQInyDpXBic3VoZiX3aDg0dsASuU3qATO3qwPxZMeCp57W0Cxdv4ZqApPuG4ApaoO6oRnEjeAkqcOiuMJwQ2gOG+hNOGkYwMo5mkD5VOgEjsoIEXxhPIN1JGQnJaU3MYLlE95x9FAoRFC+/u1xa6vlQDalvRiIgWmoaC+E17+2TE5zh8Wbvdv0YzgOuXFUlFGVUg+4QYVZazBjwhUZWVRrbg57KE5b9gV9+eenZl3UIQ5rq4M/4TNoHJ2xufFRlDyzAgr31ZQJ0ZwUxtBiYLhbmorKJ4w3KttBpWyGP7lzaBiBuWlNoWi6Gk7KJJsB0UYPpXbL8iEhcMMH2EAxcEe6kCIPVOKS2DR8hntuLghHiC1LoHgPJk42UaeyMH04y0lZZkxpm5z4OC4LpZ7vkMVlAW5/QOL4NN1KAbVLciE0IW1Z/9kqOAsaMU8JnShzFUj3pU6gAG1Xs0EeYRwuBV5JKqK7stNOEzYOLQiEqKiXJpB9RsHwharF+L4ISfI71Bmi0XYjHZC3PwFtInE+s0oZdveU5GgXMLa2ku7bSclOFpROWH8sJPaN+kSHNTZwUmmTjQOdksFUZJmnUh8907JtjygNDG92IlIcasiW9QtvUhJxPYCW5VLtVf2SMQSUta9CDBP5YZkpEfKmuw+UV8FVW4MhN+S+4RjkLsIJAR1Laz8cQyyIwYKDFsBXd+mreVxYIQfrT0ESMm6FoP3crSGH0I+RS3uAZECsw95HkJajJ/Zbs1DuaFV7Xg3eveDbfLoy2UoC4t6PdgmRwprQb2WAMDFEmtDvRVL0E19FajezB9QFdUsV4EaFOCApUrrQg1LlXY50arWgBoWde000SusAMWjYfkbWtZ1l2XnSfcyH4WC1AkolnbK5FhKjJRU7q4kq1oM1P+oXsZsGD6hSG6ds6Xg073QoMbLdHcNYQehFvMcRKPiEwXNlOogIEoPkEry51fWu3Eo2NZVChWAE7oW7wvMCFSDPUAcsKJ09wK35vLrJNTuvDwDuVdW6GbU9fceVqA703ix2y0VpXBZ1khz0Z3Kve6BJqP5FpVdNn6pxh1J8TOxncB1/GRJWwvNPMaFzjxAxpfMImMdhMm8tuSwH/KjQWzSLwhVhISR+9DW5BAsN4hN5TuE2IfWx0VGW9f91ExEWul2Ovmk4l5aOdaHfR2WO6GtsXbksZ7RYVs0l2luN3ADbRWfvfJge6aZgu/V6dJMOfuRe8UytjVovIUbWdsw9EnVNYf+AqnDGmhLxKOt5OPN0fdWQd5Oua8H7g3rVVsiDkdfP9FGrlPZGdM3U24KK/APvbZkNNFyP9Vwnxlrl7H/3ZSbwnL8UnFj48SGeyN777IKUocV1LEqJ189c4lDtRJRj3U9WVziYOTn5vQqcxeWzF4Mov8fpqV7XVYyKnf+rUuXzawyhMHCS5fvCvo90+IrgVuVfqysJTVhUD+1rAVrIkD9Dgu7qgu90+wn3gG91Ay//e1rLPz6N8o9efqLQXQpNzESbxS0LeqivYV89yJdXSQl2UERuehEllAtF2T2geWVnvaXjO504E6qzHVtgb6EurNp7d7p2uuC9HdXsbbyH8oqgTWWktC8AAAAAElFTkSuQmCC"
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
