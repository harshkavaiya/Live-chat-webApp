import { RxCross2 } from "react-icons/rx";
import { renderMessageContent } from "../chat/ChatMessage";
import { formatMessageTime } from "../../function/TimeFormating";
import { PiChecksBold } from "react-icons/pi";
import useMessageStore from "../../store/useMessageStore";

const MessageInfo = ({ messageInfoData, setMessageInfoData }) => {
  const { type, data, sender, createdAt, handleMediaPreview, _id, read } =
    messageInfoData;
  const { currentChatingUser } = useMessageStore();
  const closeDialog = () => {
    setMessageInfoData(false);
    document.getElementById("message_info_modal").close();
  };

  return (
    <dialog id="message_info_modal" className="modal">
      {messageInfoData && (
        <div className="modal-box w-[90%] h-full sm:h-[75%] flex p-5 bg-base-100 flex-col">
          {/* header */}
          <div className="flex justify-between gap-2 items-center ">
            <h3 className="font-bold text-lg">Message Info</h3>
            <RxCross2
              size={25}
              className="cursor-pointer"
              onClick={closeDialog}
            />
          </div>
          <div className="max-h-[50%] chat justify-end chat-end">
            <div className="chat-bubble rounded-xl max-w-[70%] px-3 my-1 py-1 bg-primary/70 text-primary-content">
              {renderMessageContent(
                type,
                data,
                sender,
                handleMediaPreview,
                _id
              )}
              <span className="text-xs text-primary-content/80">
                {formatMessageTime(createdAt)}
              </span>
            </div>
          </div>
          {currentChatingUser.type == "Single" && (
            <div className="space-y-5 mt-5">
              <div className="flex flex-col gap-x-2 text-md ">
                <span className="flex items-center gap-x-2">
                  <PiChecksBold size={25} className="text-sky-500" />
                  Read
                </span>
                {read?.length > 0 ? (
                  <span>{formatMessageTime(read[0].seenAt)}</span>
                ) : (
                  <span>Not Read</span>
                )}
              </div>
              <div className="flex flex-col  gap-x-2 text-md">
                <span className="flex items-center gap-x-2">
                  <PiChecksBold size={25} className="text-base-300" />
                  Delivered
                </span>
                <span>{formatMessageTime(createdAt)}</span>
              </div>
            </div>
          )}

          {currentChatingUser.type == "Group" && (
            <div className="space-y-5 mt-5">
              <div className="flex flex-col gap-x-2 text-md ">
                <span className="flex items-center gap-x-2">
                  <PiChecksBold size={25} className="text-sky-500" />
                  Read
                </span>
                {read?.length > 0 ? (
                  read.map((user, index) => (
                    <span key={index}>
                      {currentChatingUser?.members?.find(
                        (member) => member._id === user.user
                      )?.fullname || "Unknown"}{" "}
                      - {formatMessageTime(user.seenAt)}
                    </span>
                  ))
                ) : (
                  <span>Not Read</span>
                )}
              </div>
              <div className="flex flex-col  gap-x-2 text-md">
                <span className="flex items-center gap-x-2">
                  <PiChecksBold size={25} className="text-base-300" />
                  Delivered
                </span>
                <span>{formatMessageTime(createdAt)}</span>
              </div>
            </div>
          )}
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
};

export default MessageInfo;
