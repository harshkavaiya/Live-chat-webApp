import { BsThreeDots } from "react-icons/bs";
import { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { GoPlus } from "react-icons/go";

const ChatMessage = () => {
  const emojiRef = useRef();
  const [customEmojiPopup, setCustomEmojiPopup] = useState({
    id: 0,
    x: 0,
    y: 0,
    open: false,
  });
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
  }, [suscribeToMessage, socket, unsuscribeFromMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCustomEmoji = useCallback((e, id) => {
    if (customEmojiPopup.open && customEmojiPopup.id == id) {
      setCustomEmojiPopup({ x: 0, y: 0, open: false });
    } else {
      setCustomEmojiPopup({
        id: id,
        x: e.nativeEvent.pageX,
        y: e.nativeEvent.pageY,
        open: true,
      });
    }
  }, []);

  if (isMessageLoading) return <MessageLoadingSkeleton />;
  return (
    <>
      <ReactionEmoji ref={emojiRef} position={customEmojiPopup}  setPosition={setCustomEmojiPopup}/>

      <div
        className={`relative flex-1 p-1 space-y-1 overflow-y-scroll  h-full`}
      >
        {messages.map((message, i) => (
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
                message.sender != currentChatingUser
                  ? "justify-end chat-end"
                  : "justify-start chat-start group"
              } `}
            >
              <div
                className={`chat-bubble rounded-xl max-w-[80%] px-2 py-1 ${
                  message.sender != currentChatingUser
                    ? "bg-primary/70 text-primary-content"
                    : "bg-base-300 text-base-content "
                }`}
              >
                {message.type == "text" && (
                  <p className="text-sm">{message.data}</p>
                )}
                {message.type == "image" && (
                  <Image
                    src={message.data[0].url}
                    message={message}
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
                {message.type == "location" && (
                  <LocationPreview message={message} />
                )}
                {message.type == "audio" && <Audio message={message} />}
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
              <div className="dropdown dropdown-top  dropdown-right group hidden group-hover:block">
                <button
                  className="cursor-pointer rounded-full w-7 h-7 bg-base-200   grid place-items-center"
                  role="button"
                  tabIndex={0}
                >
                  <BsEmojiLaughing className="text-primary-content" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 border mt-3 mr-2 w-56 rounded-box z-20 p-2 shadow-lg gap-1"
                >
      <ReactionEmoji />
                  
                </ul>
              </div>
              {/* {message.sender == currentChatingUser && !isSelectMessage && (
                <div className="dropdown dropdown-top  dropdown-end">
                <button
                role="button"
                tabIndex={0}
          
                  className="bg-base-300  p-2 rounded-full hidden group-hover:block"
                >
                  <BsEmojiLaughing className="text-primary-content" />
                  hk
                </button>
                <div className="" tabIndex={0}>
                  <p>hash</p>
                </div>
                </div>
              )} */}
            </div>
          </div>
        ))}
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
