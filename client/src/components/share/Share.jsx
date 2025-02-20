import { IoSend } from "react-icons/io5";
import { BsCheckSquare } from "react-icons/bs";
import { FiSquare } from "react-icons/fi";
import { useState } from "react";
import useFunctionStore from "../../store/useFuncationStore";
import useAuthStore from "../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import useMessageStore from "../../store/useMessageStore";
import useContactList from "../../store/useContactList";

const Share = () => {
  const { handleSelectMessage, sendSelectionMessage, setSelectMessage } =
    useFunctionStore();
  const { messagerUser } = useMessageStore();
  const queryClient = useQueryClient();
  const { authUser } = useAuthStore();
  const { contacts } = useContactList();

  const uniqueUsers = Array.from(
    new Map(
      [...contacts, ...messagerUser].map((user) => [user._id, user])
    ).values()
  );
  const [selectedUser, setSelectedUser] = useState([]);

  const toggleChat = (i) => {
    if (!i.type) {
      i.type = "Single";
      i.fullname = i.savedName;
      (i.lastMessage = null),
        (i.lastMessageTime = null),
        (i.lastMessageType = null);
      i.receiver = i._id;
      i.sender = authUser._id;
    }
    if (selectedUser.some((item) => item._id == i._id)) {
      setSelectedUser((prev) => prev.filter((item) => item._id !== i._id));
    } else {
      if (selectedUser.length) {
        setSelectedUser((prev) => [...prev, i]);
      } else {
        setSelectedUser([i]);
      }
    }
  };
  return (
    <dialog className="modal modal-open w-full h-full absolute top-0 left-0 z-20 bg-transparent text-base-content">
      <div className="modal-box w-[90%] md:w-[40%] md:h-fit border border-base-300 p-0 bg-base-100">
        {/* Header */}
        <div className="bg-primary text-primary-content p-3 flex items-center justify-between ">
          <h1 className="text-lg font-medium">Forward message to</h1>

          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              handleSelectMessage(false), setSelectMessage([]);
            }}
            className="btn btn-sm text-lg btn-circle btn-ghost absolute right-4 top-3"
          >
            ✕
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="p-2 max-h-[70vh] w-[80%] overflow-y-auto">
          <h2 className="text-primary font-medium mb-4">RECENT CHATS</h2>

          <div className="space-y-2 h-full ">
            {uniqueUsers.map((user, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => toggleChat(user)}
              >
                <div className="flex-shrink-0">
                  {selectedUser.some((item) => item._id == user._id) ? (
                    <BsCheckSquare className="text-primary" size={20} />
                  ) : (
                    <FiSquare className="" size={20} />
                  )}
                </div>

                <div className="indicator relative ">
                  <span className="indicator-item rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src={
                        user.profilePic ||
                        "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      }
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium truncate">
                    {user.savedName || user.fullname}
                  </p>
                  <p className="text-sm truncate">{user.description || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Receiver Names */}
        <div className="border-t border-base-300 ">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="flex-1">
              <p className="text-sm t">
                {selectedUser.map((item, i) => {
                  if (i == 0) return item.fullname;

                  return `,${item.fullname}`;
                })}
              </p>
            </div>
            {selectedUser.length > 0 && (
              <button
                onClick={() => sendSelectionMessage(selectedUser, queryClient)}
                className="bg-primary p-3 rounded-full"
              >
                <IoSend size={25} />
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Share;
