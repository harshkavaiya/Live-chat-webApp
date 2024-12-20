import { FaRegSmile } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoVideocam, IoEllipsisVerticalSharp, IoSend } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { MdOutlinePermContactCalendar, MdOutlinePoll } from "react-icons/md";
import { useRef, useState } from "react";
import { LuCamera } from "react-icons/lu";
import { OpenCloseMenu } from "../function/function";
import EmojiPicker from "emoji-picker-react";
import { GrMapLocation, GrAttachment } from "react-icons/gr";
import { TiDocumentAdd } from "react-icons/ti";

const ChatPage = () => {
  const [messages] = useState([
    {
      read: false,
      id: 1,
      sender: "Josephin",
      content: "Hi I am Josephin, can you help me to find best chat app?",
      timestamp: "01:40 AM",
    },
    {
      read: true,
      id: 2,
      sender: "Josephin",
      content: "it should from elite auther 😊",
      timestamp: "01:40 AM",
    },
    {
      read: false,
      id: 3,
      sender: "Alan josheph",
      content:
        "Sure, chitchat is best theme for chating project, you can it check here.",
      timestamp: "01:40 AM",
    },
  ]);
  const [text, setText] = useState("");
  const [isEmojiSelect, setIsEmojiSelect] = useState(false);
  const headerMenuRef = useRef();
  const InputMenuRef = useRef();

  const onEmojiClick = (data) => {
    setText((pre) => pre + data.emoji);
  };
  return (
    <div className="flex flex-col h-screen bg-base-100 ">
      {/* Header */}
      <div className="flex items-center justify-between p-3 shadow border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
              J
            </div>
            <p className="ml-4 font-semibold text-2xl">Hardik</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <IoVideocam className="cursor-pointer" size={20} />
          <IoEllipsisVerticalSharp
            onClick={() => OpenCloseMenu(headerMenuRef)}
            className="cursor-pointer"
            size={20}
          />
        </div>
      </div>
      {/*Header menu */}
      <div
        ref={headerMenuRef}
        className="absolute right-2 z-20 top-[50px] hidden"
      >
        <ul className="menu bg-base-100 rounded-md border border-base-300 w-56 p-0 [&_li>*]:rounded-none">
          <li>
            <p>Profile</p>
          </li>
          <li>
            <p>Select Messages</p>
          </li>
          <li>
            <p>Close Chat</p>
          </li>
          <li>
            <p>Clear Chat</p>
          </li>
          <li>
            <p>Report</p>
          </li>
        </ul>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4 bg-base-100">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`chat ${
              message.sender == "Josephin" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble rounded-xl  w-[78%] px-3 py-1 ${
                message.sender == "Josephin"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              <p className="text-sm">
                It was said that you would, destroy the Sith, not join them.
              </p>
              <p
                className={`
                                 text-[10px] mt-1.5 text-end flex items-end justify-end gap-1
                                 ${
                                   message.sender == "Josephin"
                                     ? "text-primary-content/70"
                                     : "text-base-content/70"
                                 }
                               `}
              >
                12:00 PM{" "}
                {message.sender == "Josephin" && (
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
        ))}
      </div>

      {/* Input Area */}
      <div className="p-2 border-t bg-base-100">
        <div className="flex items-center space-x-2">
          <label className="input input-bordered py-1 px-2 flex w-full items-center space-x-1 rounded-full">
            <FaRegSmile
              onClick={() => setIsEmojiSelect(!isEmojiSelect)}
              className="cursor-pointer"
              size={20}
            />
            <input
              className="grow"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your message..."
              type="text"
            />
            <GoPlus
              onClick={() => OpenCloseMenu(InputMenuRef)}
              className="cursor-pointer"
              size={28}
            />
            {text.length <= 0 && (
              <LuCamera className="cursor-pointer" size={20} />
            )}
          </label>

          <button className="btn btn-primary rounded-full w-12 p-1 outline-none">
            {text.length > 0 ? (
              <IoSend className="cursor-pointer" size={20} />
            ) : (
              <FaMicrophone className="cursor-pointer" size={20} />
            )}
          </button>
          {/* input menu */}
          <div
            ref={InputMenuRef}
            className="absolute right-24 z-20 bottom-[50px] hidden"
          >
            <ul className="menu bg-base-100 rounded-md font-medium border border-base-300 w-40 p-0 [&_li>*]:rounded-none">
              <li>
                <p>
                  <GrGallery size={20} /> Gallery
                </p>
              </li>
              <li>
                <p>
                  <LuCamera size={20} />
                  Camera
                </p>
              </li>
              <li>
                <p>
                  <MdOutlinePermContactCalendar size={20} />
                  Contact
                </p>
              </li>
              <li>
                <p>
                  <GrMapLocation size={20} />
                  Location
                </p>
              </li>
              <li>
                <p>
                  <TiDocumentAdd size={20} />
                  Document
                </p>
              </li>
              <li>
                <p>
                  <MdOutlinePoll size={20} />
                  Poll
                </p>
              </li>
              <li>
                <p>
                  <GrAttachment size={20} />
                  Attach
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emoji Select */}
      <div className="absolute left-0 bottom-16">
        <EmojiPicker
          open={isEmojiSelect}
          searchDisabled={true}
          lazyLoadEmojis={true}
          onEmojiClick={onEmojiClick}
          // reactionsDefaultOpen={true}
        />
      </div>
    </div>
  );
};

export default ChatPage;
