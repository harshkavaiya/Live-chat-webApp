import { BsFileText, BsThreeDots } from "react-icons/bs";
import { memo, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { LuTrash2 } from "react-icons/lu";
import { BiDownload } from "react-icons/bi";
import Poll from "../Poll/Poll";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import useMessageStore from "../../store/useMessageStore";
import useAuthStore from "../../store/useAuthStore";
import { formatMessageTime } from "../../function/TimeFormating";
import MessageLoadingSkeleton from "../Skeleton/MessageLoginSkeleton";
import useFunctionStore from "../../store/useFuncationStore";
import useMediaStore from "../../store/useMediaStore";
import Image from "./msg_type/image";
import Video from "./msg_type/video";
import File from "./msg_type/file";
import Multiplefile from "./msg_type/multiplefile";

const ChatMessage = () => {
  const {
    messages,
    suscribeToMessage,
    unsuscribeFromMessage,
    isMessageLoading,
    currentChatingUser,
  } = useMessageStore();
  const { onSelectMessage, selectMessage, isSelectMessage, closeSelection } =
    useFunctionStore();

  const { handleMediaPreview } = useMediaStore();
  const { socket } = useAuthStore();
  const messageEndRef = useRef();

  useEffect(() => {
    suscribeToMessage();
    return () => unsuscribeFromMessage();
  }, [suscribeToMessage, socket, unsuscribeFromMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) return <MessageLoadingSkeleton />;
  return (
    <>
      <div className="flex-1 p-1 space-y-1 overflow-y-scroll h-full">
        {messages.map((message, i) => (
          <div
            ref={messageEndRef}
            key={i}
            className="flex w-full items-center scroll-smooth"
          >
            {isSelectMessage && (
              <input
                type="checkbox"
                onClick={() => onSelectMessage(message)}
                className="checkbox ml-2 checkbox-primary text-primary-content"
              />
            )}
            <div
              className={`chat w-full h ${
                message.sender != currentChatingUser ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble rounded-xl  max-w-[80%] px-2 py-1 ${
                  message.sender != currentChatingUser
                    ? "bg-primary/70 text-primary-content"
                    : "bg-base-300 text-base-content"
                }`}
              >
                {message.type == "text" && (
                  <p className="text-sm">{message.data}</p>
                )}
                {message.type == "image" && (
                  <Image
                    src={message.data[0].url}
                    handleMediaPreview={handleMediaPreview}
                  />
                )}
                {message.type == "video" && (
                  <Video
                    src={message.data[0].url}
                    handleMediaPreview={handleMediaPreview}
                  />
                )}
                {message.type == "file" && <File message={message} />}
                {message.type == "multiple-file" && (
                  <Multiplefile
                    message={message}
                    handleMediaPreview={handleMediaPreview}
                  />
                )}
                {message.type == "poll" && <Poll data={message.data} />}
                {message.type == "location" && <Location message={message} />}
                <p
                  className={`text-[10px] text-end flex items-end justify-end ${
                    message.sender != currentChatingUser
                      ? "text-primary-content/70"
                      : "text-base-content/70"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                  {message.sender != currentChatingUser && (
                    <BsThreeDots
                      size={16}
                      className={`${
                        message.read ? "text-blue-500" : "text-base-100"
                      } `}
                    />
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isSelectMessage && (
        <div className="absolute w-full h-[10%] bg-primary left-0 bottom-0 z-50 flex items-center text-base-content overflow-hidden">
          <IoClose
            onClick={closeSelection}
            size={30}
            className="ml-4 cursor-pointer"
          />
          <p className="flex gap-x-2 items-center text-xl">
            <span className="">{Object.keys(selectMessage).length}</span>{" "}
            Selected
          </p>
          {Object.keys(selectMessage).length > 0 && (
            <div className="flex justify-end w-full mr-3 gap-x-2 ">
              <IoIosShareAlt size={30} className="" />
              <LuTrash2 size={30} className="" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(ChatMessage);
