import { PiChecksBold } from "react-icons/pi";
import { memo, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";
import Poll from "../Poll/Poll";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";
import { formatMessageTime } from "../../function/TimeFormating";
import MessageLoadingSkeleton from "../Skeleton/MessageLoginSkeleton";
import useFunctionStore from "../../store/useFuncationStore";
import useMediaStore from "../../store/useMediaStore";
import Image from "./msg_type/Image";
import Video from "./msg_type/video";
import File from "./msg_type/file";
import Multiplefile from "./msg_type/multiplefile";
import LocationPreview from "./msg_type/LocationPreview";
import { BsEmojiLaughing } from "react-icons/bs";
import ReactionEmoji, { reactions } from "../ReactionEmoji";
import Audio from "./msg_type/Audio";
import { useQueryClient } from "@tanstack/react-query";
import { MemeberProfilePic } from "../../function/function";
import { Link } from "react-router-dom";

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
    setSelectMessage,
    selectMessage,
    isSelectMessage,
    handleSelection,
    decryptData,
    generateUniqueId,
  } = useFunctionStore();
  const { authUser } = useAuthStore();
  const myId = authUser._id;
  const { handleMediaPreview } = useMediaStore();

  const messageEndRef = useRef();
  const queryClient = useQueryClient();
  useEffect(() => {
    suscribeToMessage(queryClient);
    return () => unsuscribeFromMessage();
  }, [suscribeToMessage, unsuscribeFromMessage]);

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
              {isSelectMessage && (
                <input
                  type="checkbox"
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
                  className={`chat-bubble relative rounded-xl max-w-[70%] px-2 my-1 py-1 ${
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
                  {/* reaction emoji */}
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
                  {type == "text" && <p className="text-sm">{data}</p>}
                  {type == "link" && (
                    <Link
                      to={data}
                      target="_blank"
                      className="text-sm text-blue-600"
                    >
                      {data}
                    </Link>
                  )}
                  {type == "image" && (
                    <Image
                      src={data[0].url}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "video" && (
                    <Video
                      src={data[0].url}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "file" && <File sender={sender} data={data} />}
                  {type == "multiple-file" && (
                    <Multiplefile
                      data={data}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "poll" && (
                    <Poll id={_id} data={data} sender={sender} />
                  )}
                  {type == "location" && <LocationPreview data={data} />}
                  {type == "audio" && <Audio data={data} />}
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
                          read.includes(myId) ? "text-sky-500" : "text-base-100"
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
                    handleSelectMessage(false), setSelectMessage([]);
                  }}
                  className="btn btn-ghost btn-circle btn-md p-2"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ChatMessage);
