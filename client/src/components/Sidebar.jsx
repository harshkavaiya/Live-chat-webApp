import { CiSearch } from "react-icons/ci";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { useEffect } from "react";
import useMessageStore from "../store/useMessageStore";
import { formatMessageTime } from "../function/TimeFormating";
import SidebarUser from "./Skeleton/SidebarUser";
import ContactDialog from "./PopUpDialog/ContactDialog";
import useContactList from "../store/useContactList";

const Sidebar = () => {
  const receiveMessage = true; //if messeage is receiver or not seen
  const loading = false;
  const { getMessagerUser, messagerUser, selectUsertoChat } = useMessageStore();
  const users = [...Array(20).keys()];
  const { setDialogOpen } = useContactList();

  const Opendialog = (dialog) => {
    setDialogOpen(true);
    document.getElementById(`my_modal_${dialog}`).showModal();
  };

  useEffect(() => {
    getMessagerUser();
  }, [getMessagerUser]);

  if (loading) return <SidebarUser />;
  return (
    <div className="h-full w-full flex flex-col gap-2">
      <ContactDialog />
      {/* user online */}
      <div className="flex flex-col w-full pl-2 py-2">
        <div className="flex justify-between items-center pr-2 pb-2">
          <div className="text-lg flex items-center font-bold gap-px cursor-default">
            Online Now
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {users.length}
            </div>
          </div>
          <p className="flex items-center text-sm gap-2 cursor-pointer">
            More <FaAngleRight className="text-primary" />
          </p>
        </div>
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pl-2 cursor-pointer">
          {users.map((i, index) => (
            <div key={index} className="indicator relative ">
              <span className="indicator-item badge badge-success rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
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

      {/* user message */}
      <div className="flex-1 h-0 flex flex-col">
        <div className="text-lg flex items-center justify-between font-bold pl-2 py-2 cursor-default">
          <span className="text-lg flex items-center font-bold gap-px cursor-default">
            Messages
            <div className="badge p-0 ml-1 w-5 h-5 badge-primary">
              {messagerUser.length}
            </div>
          </span>
          {/* search */}
          <div className="relative w-full px-4">
            <span className="absolute inset-y-0 left-7 flex items-center text-gray-500">
              <CiSearch size={20} />
            </span>
            <input
              type="search"
              className="input input-primary h-9 w-full pl-10"
              placeholder="Search messages..."
            />
          </div>
        </div>

        {/* messeages list */}
        <div className="overflow-y-auto scrollbar-small overflow-x-hidden">
          {messagerUser.map((i, idx) => {
            const { lastMessageTime, fullname, lastMessage } = i;
            return (
              <div
                key={idx}
                onClick={() => selectUsertoChat(i._id)}
                className={`flex justify-between pl-4 md:border-b pr-2 border-primary/20 py-2 transition-all duration-75 group hover:bg-primary/10 items-center
                ${idx == users.length - 1 && "border-b"}`}
              >
                <div className="flex items-center">
                  <div className="bg-base-300 grid w-14 h-14 border-2 border-primary place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col ml-3 gap-1">
                    <p className="text-lg font-semibold">{fullname}</p>
                    <p className="text-sm text-gray-500">{lastMessage}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!receiveMessage && (
                    <div className="flex justify-start">
                      <GoDotFill size={20} className="text-blue-500" />
                      <GoDotFill size={20} className="text-blue-500" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-xs">
                      {formatMessageTime(lastMessageTime)}
                    </p>

                    <div
                      className={`flex items-center gap-3 group-hover:translate-x-0  transition-transform duration-75
                    ${receiveMessage ? "translate-x-7" : "translate-x-10"}`}
                    >
                      {receiveMessage ? (
                        <>
                          <div className="badge badge-primary w-6 h-6">4</div>
                          <FaAngleDown className="cursor-pointer" size={20} />
                        </>
                      ) : (
                        <FaAngleDown className="cursor-pointer" size={20} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mb-36 md:mb-5">
            <div className="divider text-xs">end-to-end encrypted</div>
          </div>
        </div>
      </div>

      {/* menus */}
      <div className="fixed sm:absolute right-2 bottom-20 sm:bottom-1">
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
            className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow-lg gap-1"
          >
            <li>
              <button className="btn btn-ghost" onClick={() => Opendialog(4)}>
                Contacts
              </button>
            </li>
            <li>
              <button className="btn btn-ghost">Groups</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
