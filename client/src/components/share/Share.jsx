import { IoSend } from "react-icons/io5";
import { BsCheckSquare } from "react-icons/bs";
import { FiSquare } from "react-icons/fi";
import { useState } from "react";
import useFunctionStore from "../../store/useFuncationStore";
import useAuthStore from "../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

const Share = () => {
  const { handleSelectMessage, sendSelectionMessage, setSelectMessage } =
    useFunctionStore();
  const queryClient = useQueryClient();

  const { friends } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState([]);

  const toggleChat = (id, name) => {
    let check = selectedUser.filter((item) => item.id == id);

    if (check.length) {
      setSelectedUser((prev) => prev.filter((item) => item.id !== id));
    } else {
      setSelectedUser((prev) => [...prev, { id, name }]);
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
        <div className="p-2 max-h-[70vh] overflow-y-auto">
          <h2 className="text-primary font-medium mb-4">RECENT CHATS</h2>

          <div className="space-y-2 h-full ">
            {friends.map((user, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => toggleChat(user.userId, user.savedName)}
              >
                <div className="flex-shrink-0">
                  {selectedUser.filter((item) => item.id == user.userId)
                    .length ? (
                    <BsCheckSquare className="text-primary" size={20} />
                  ) : (
                    <FiSquare className="" size={20} />
                  )}
                </div>

                <div className="indicator relative ">
                  <span className="indicator-item rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
                  <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium truncate">
                    {user.savedName}
                  </p>
                  <p className="text-sm truncate">{user.description}</p>
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
                {selectedUser.map((item) => {
                  if (selectedUser.length == 1) return item.name;

                  return `${item.name},`;
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
