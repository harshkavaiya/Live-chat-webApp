import { PiChecksBold } from "react-icons/pi";
import { memo, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown, IoIosShareAlt } from "react-icons/io";
import Poll from "../Poll/Poll";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";
import { formatMessageTime } from "../../function/TimeFormating";
import MessageLoadingSkeleton from "../Skeleton/MessageLoginSkeleton";
import useFunctionStore from "../../store/useFuncationStore";
import useMediaStore from "../../store/useMediaStore";
import Image from "./msg_type/Image";
import Video from "./msg_type/Video";
import File from "./msg_type/File";
import Multiplefile from "./msg_type/Multiplefile";
import LocationPreview from "./msg_type/LocationPreview";
import { BsEmojiLaughing } from "react-icons/bs";
import ReactionEmoji, { reactions } from "../ReactionEmoji";
import Audio from "./msg_type/Audio";
import { useQueryClient } from "@tanstack/react-query";
import { MemeberProfilePic } from "../../function/function";
import { Link } from "react-router-dom";
import MessageInfo from "../PopUpDialog/MessageInfo";
import { LuTrash2 } from "react-icons/lu";

const ChatMessage = ({
  isLoading,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) => {
  const {
    messages,
    suscribeToMessage,
    unsuscribeFromMessage,
    currentChatingUser,
  } = useMessageStore();

  const {
    onSelectionMessage,
    handleSelectMessage,
    selectMessage,
    isSelectMessage,
    handleSelection,
    decryptData,
    generateUniqueId,
    setSelectMessage,
  } = useFunctionStore();
  const { authUser } = useAuthStore();
  const myId = authUser._id;
  const { handleMediaPreview } = useMediaStore();
  const [messageInfoData, setMessageInfoData] = useState({});
  const messageEndRef = useRef();
  const queryClient = useQueryClient();

  useEffect(() => {
    suscribeToMessage(queryClient);
    return () => unsuscribeFromMessage();
  }, [queryClient]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView();
    }
  }, [messages]);

  if (isLoading) return <MessageLoadingSkeleton />;

  const handleScroll = (event) => {
    if (
      event.target.scrollTop === 0 &&
      !isFetchingNextPage &&
      hasNextPage &&
      !isLoading
    ) {
      fetchNextPage();
    }
  };
  return (
    <>
      <div
        onScroll={handleScroll}
        className="flex-1 p-1 space-y-1 overflow-y-auto overflow-x-hidden h-full"
      >
        {isFetchingNextPage && (
          <div className="w-full flex justify-center">
            <span className="text-center loading loading-dots loading-lg" />
          </div>
        )}
        {messages?.map((message, i) => {
          const { _id, sender, receiver, type, read, createdAt, reaction } =
            message;
          let secretKey = generateUniqueId(sender, receiver) || null;
          const data = decryptData(message?.data, secretKey);
          return (
            <div
              ref={messageEndRef}
              key={i}
              className="flex w-full items-center scroll-smooth "
            >
              {isSelectMessage && type != "poll" && (
                <input
                  type="checkbox"
                  defaultChecked={selectMessage[_id]}
                  onClick={() => onSelectionMessage(message)}
                  className="checkbox ml-2 checkbox-primary text-primary-content"
                />
              )}

              <div
                className={`relative h-full chat w-full px-2 flex items-center  ${
                  sender == myId
                    ? "justify-end chat-end"
                    : "justify-start chat-start group"
                } `}
              >
                {currentChatingUser.type == "Group" && (
                  <div
                    className={`chat-image avatar ${
                      sender == myId && currentChatingUser.type == "Group"
                        ? "order-2"
                        : "order-1"
                    }`}
                  >
                    <div className="w-5 rounded-full">
                      <img
                        src={
                          MemeberProfilePic(
                            currentChatingUser.members,
                            sender
                          ) ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`chat-bubble group relative rounded-xl max-w-[70%] px-3 my-1 py-1 ${
                    sender == myId
                      ? "bg-primary/70 text-primary-content "
                      : "bg-base-300 text-base-content"
                  } ${
                    sender == myId
                      ? "order-1"
                      : currentChatingUser.type == "Group"
                      ? "order-2"
                      : "order-1"
                  }`}
                >
                  {/*See Message Info */}
                  {sender == myId && (
                    <div className="dropdown dropdown-bottom dropdown-end absolute top-1 right-1 ">
                      <IoIosArrowDown
                        size={20}
                        role="button"
                        tabIndex={0}
                        className="group-focus-within:block group-hover:block hidden"
                      />
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu text-sm bg-base-100 text-base-content border w-44 rounded-xl z-30 p-2 shadow-lg gap-1"
                      >
                        <li>
                          <button
                            onClick={() => {
                              setMessageInfoData({
                                type: type,
                                createdAt: createdAt,
                                data: data,
                                sender: sender,
                                handleMediaPreview: handleMediaPreview,
                                _id: _id,
                                read: read,
                              });
                              document
                                .getElementById("message_info_modal")
                                .showModal();
                            }}
                          >
                            Message Info
                          </button>
                          <button
                            onClick={() => {
                              onSelectionMessage(message);
                              handleSelection(true);
                            }}
                          >
                            Forward
                          </button>
                          <button
                            onClick={() => {
                              onSelectionMessage(message);
                              handleSelection(true);
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {reaction.length > 0 && (
                    <div
                      className={`badge bg-transparent border-none absolute -bottom-3 p-0.5  ${
                        sender == myId ? "left-1" : "right-1 "
                      }`}
                    >
                      {reaction.map((item, i) => (
                        <img
                          className="w-4 h-4"
                          key={i}
                          src={reactions[item.id - 1].emoji}
                        />
                      ))}
                    </div>
                  )}
                  {renderMessageContent(
                    type,
                    data,
                    sender,
                    handleMediaPreview,
                    _id
                  )}
                  <p
                    className={`text-[10px] text-end flex items-end justify-end ${
                      sender == myId
                        ? "text-primary-content/70"
                        : "text-base-content/70"
                    }`}
                  >
                    {formatMessageTime(createdAt)}

                    {sender == myId && (
                      <PiChecksBold
                        size={13}
                        className={`${
                          currentChatingUser.type == "Single" && read.length > 0
                            ? "text-sky-500"
                            : read.length == message.members.length - 1
                            ? "text-sky-500"
                            : "text-base-100"
                        }  ml-1`}
                      />
                    )}
                  </p>
                </div>
                <div
                  className={`dropdown dropdown-right  dropdown-end ${
                    currentChatingUser.type == "Group" ? "order-3" : "order-2"
                  }`}
                >
                  <button
                    tabIndex={0}
                    className="cursor-pointer rounded-full bg-base-300 w-7 h-7 hidden group-focus-within:flex group-hover:flex items-center justify-center active:block"
                  >
                    <BsEmojiLaughing className="text-base-content/80" />
                  </button>
                  <div className="dropdown-content z-50 bg-base-100 border mt-3 mr-2 w-56 rounded-box p-2 shadow-lg gap-1">
                    <ReactionEmoji index={i} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isSelectMessage && (
        <div className=" absolute bg-base-100 w-full h-[10%] z-10 left-0 bottom-0">
          <div className="w-full h-full bg-primary/80  flex items-center text-primary-content overflow-hidden">
            <IoClose
              onClick={() => handleSelection(false)}
              className="ml-4 btn btn-ghost btn-circle btn-sm"
            />

            <p className="flex gap-x-2 items-center text-lg md:text-xl">
              <span className="">{Object.keys(selectMessage).length}</span>{" "}
              Selected
            </p>
            {Object.keys(selectMessage).length > 0 && (
              <div className="flex justify-end w-full mr-8 ">
                <IoIosShareAlt
                  onClick={() => {
                    handleSelectMessage(true);
                  }}
                  className=" btn btn-ghost btn-circle btn-md p-2"
                />
                <LuTrash2
                  onClick={() => {
                    document
                      .getElementById("message_deleteConfirm")
                      .showModal();
                  }}
                  className="btn btn-ghost btn-circle btn-md p-2"
                />
              </div>
            )}
          </div>
        </div>
      )}
      <MessageInfo
        messageInfoData={messageInfoData}
        setMessageInfoData={setMessageInfoData}
      />
      <DeleteMessageConfirmationModal queryClient={queryClient} />
    </>
  );
};

export const renderMessageContent = (
  type,
  data,
  sender,
  handleMediaPreview,
  _id
) => {
  switch (type) {
    case "text":
      return <p className="text-sm">{data}</p>;

    case "link":
      return (
        <Link to={data} target="_blank" className="text-sm text-blue-600">
          {data}
        </Link>
      );

    case "image":
      return (
        <Image src={data[0].url} handleMediaPreview={handleMediaPreview} />
      );

    case "video":
      return (
        <Video src={data[0].url} handleMediaPreview={handleMediaPreview} />
      );

    case "file":
      return <File sender={sender} data={data} />;

    case "multiple-file":
      return (
        <Multiplefile data={data} handleMediaPreview={handleMediaPreview} />
      );

    case "poll":
      return <Poll id={_id} data={data} sender={sender} />;

    case "location":
      return <LocationPreview data={data} />;

    case "audio":
      return <Audio data={data} />;

    default:
      return null; // Handle unknown types gracefully
  }
};

const DeleteMessageConfirmationModal = ({ queryClient }) => {
  const { deleteSelectedMessage, isDeletingMessage } = useFunctionStore();
  return (
    <dialog id="message_deleteConfirm" className="modal">
      <div className="modal-box bg-base-100 relative w-fit gap-5 p-10 flex items-center flex-col">
        <span>
          <p className="text-lg text-center font-semibold">
            Are you sure you want to delete this contact?
          </p>
          <p className="text-xs text-center">
            This contact will be deleted permanently.
          </p>
        </span>
        <div className="grid grid-cols-1 gap-3 w-full">
          <button
            className="btn btn-error disabled:cursor-not-allowed"
            disabled={isDeletingMessage}
            onClick={() => deleteSelectedMessage(queryClient)}
          >
            {isDeletingMessage ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              "Yes, sure"
            )}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => document.getElementById("deleteConfirm").close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};
export default memo(ChatMessage);
