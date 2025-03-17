import { memo, useRef } from "react";
import { IoEllipsisVerticalSharp, IoVideocam } from "react-icons/io5";
import { Link } from "react-router-dom";
import { OpenCloseMenu } from "../../function/function";
import useFunctionStore from "../../store/useFuncationStore";
import { IoChevronBackOutline } from "react-icons/io5";
import useMessageStore from "../../store/useMessageStore";
import { useQueryClient } from "@tanstack/react-query";
import useVideoCall from "../../store/useVideoCall";

const ChatHeader = ({ setIsProfileOpen }) => {
  const headerMenuRef = useRef();
  const queryClient = useQueryClient();
  const { handleSelection } = useFunctionStore();
  const { startCall } = useVideoCall();
  const { closeChat, clearChat, currentChatingUser } = useMessageStore();

  return (
    <>
      <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 bg-base-100 h-full">
        <div className="flex items-center gap-2">
          <IoChevronBackOutline
            onClick={closeChat}
            size={24}
            className="cursor-pointer"
          />
          <div className="flex items-center">
            <div className="indicator relative ">
              <span className="indicator-item rounded-full absolute w-3 h-3 p-0 top-2 right-2"></span>
              <div className="bg-base-300 grid w-12 h-12 place-items-center rounded-full overflow-hidden">
                <img
                  src={
                    currentChatingUser.profilePic ||
                    "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg"
                  }
                  alt="user"
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
            <Link
              onClick={() => {
                setIsProfileOpen(true);
              }}
              className="ml-4 font-semibold text-2xl w-full"
            >
              {currentChatingUser.fullname}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          {currentChatingUser.type == "Single" && (
            <IoVideocam
              onClick={() => {
                startCall(currentChatingUser._id, "video");
                document.getElementById("video_call_modal").showModal();
              }}
              className="cursor-pointer"
              size={20}
            />
          )}

          <div className="dropdown dropdown-bottom dropdown-end">
            <IoEllipsisVerticalSharp
              onClick={() => {
                OpenCloseMenu(headerMenuRef);
              }}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              size={20}
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 border mt-3 mr-2 w-56 rounded-box z-[1] p-2 shadow-lg gap-1"
            >
              <li>
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                  }}
                >
                  Profile
                </button>
              </li>
              <li
                onClick={() => {
                  handleSelection(true);
                }}
              >
                <p>Select Messages</p>
              </li>
              <li>
                <button onClick={closeChat}>Close Chat</button>
              </li>
              <li>
                <button onClick={() => clearChat(queryClient)}>
                  Clear Chat
                </button>
              </li>
              <li>
                <p>Report</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/*Header menu */}
    </>
  );
};

export default memo(ChatHeader);
