import { BsThreeDots } from "react-icons/bs";
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
import ReactionEmoji from "../ReactionEmoji";
import Audio from "./msg_type/Audio";

const ChatMessage = () => {
  const {
    messages,
    suscribeToMessage,
    unsuscribeFromMessage,
    isMessageLoading,
    currentChatingUser,
  } = useMessageStore();
  const {
    onSelectionMessage,
    handleSelectMessage,
    selectMessage,
    isSelectMessage,
    handleSelection,
  } = useFunctionStore();

  const { handleMediaPreview } = useMediaStore();
  const { socket } = useAuthStore();
  const messageEndRef = useRef();

  useEffect(() => {
    suscribeToMessage();
    return () => unsuscribeFromMessage();
  }, [suscribeToMessage, unsuscribeFromMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) return <MessageLoadingSkeleton />;
  return (
    <>
      <div className="flex-1 p-1 space-y-1 overflow-y-scroll overflow-x-hidden h-full">
        {messages.map((message, i) => {
          const { sender, type, data, read, createdAt } = message;
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
                  sender != currentChatingUser
                    ? "justify-end chat-end"
                    : "justify-start chat-start group"
                } `}
              >
                <div
                  className={`chat-bubble rounded-xl max-w-[60%] px-2 py-1 ${
                    sender != currentChatingUser
                      ? "bg-primary/70 text-primary-content"
                      : "bg-base-300 text-base-content "
                  }`}
                >
                  {type == "text" && <p className="text-sm">{data}</p>}
                  {type == "image" && (
                    <Image
                      src={data[0].url}
                      message={message}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "video" && (
                    <Video
                      src={data[0].url}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "file" && <File message={message} />}
                  {type == "multiple-file" && (
                    <Multiplefile
                      message={message}
                      handleMediaPreview={handleMediaPreview}
                    />
                  )}
                  {type == "poll" && <Poll data={data} />}
                  {type == "location" && <LocationPreview message={message} />}
                  {type == "audio" && <Audio message={message} />}
                  <p
                    className={`text-[10px] text-end flex items-end justify-end ${
                      sender != currentChatingUser
                        ? "text-primary-content/70"
                        : "text-base-content/70"
                    }`}
                  >
                    {formatMessageTime(createdAt)}
                    {sender != currentChatingUser && (
                      <BsThreeDots
                        size={16}
                        className={`${
                          read ? "text-blue-500" : "text-base-100"
                        } `}
                      />
                    )}
                  </p>
                </div>
                <div className="dropdown dropdown-top dropdown-right z-20">
                  <button
                    tabIndex={0}
                    className="cursor-pointer rounded-full bg-base-300 w-7 h-7 hidden group-hover:flex items-center justify-center active:block"
                  >
                    <BsEmojiLaughing className="text-primary-content" />
                  </button>
                  <div
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 border mt-3 mr-2 w-56 rounded-box p-2 shadow-lg gap-1"
                  >
                    <ReactionEmoji />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isSelectMessage && (
        <div className="absolute w-full h-[10%] bg-primary left-0 bottom-0 z-10 flex items-center text-base-content overflow-hidden">
          <IoClose
            onClick={() => handleSelection(false)}
            size={30}
            className="ml-4 cursor-pointer"
          />

          <p className="flex gap-x-2 items-center text-xl">
            <span className="">{Object.keys(selectMessage).length}</span>{" "}
            Selected
          </p>
          {Object.keys(selectMessage).length > 0 && (
            <div className="flex justify-end w-full mr-3 gap-x-2 ">
              <IoIosShareAlt
                onClick={() => {
                  handleSelectMessage(true);
                }}
                size={30}
                className="cursor-pointer"
              />
              <LuTrash2 size={30} className="cursor-pointer" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(ChatMessage);
