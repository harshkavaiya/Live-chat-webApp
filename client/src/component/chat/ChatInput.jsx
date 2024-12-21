import { GrMapLocation } from "react-icons/gr";
import { TiDocumentAdd } from "react-icons/ti";
import { GoPlus } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { MdOutlinePermContactCalendar, MdOutlinePoll } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import { LuCamera } from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import { OpenCloseMenu } from "../../function/function";
import { IoSend } from "react-icons/io5";
import CreatePoll from "../Poll/CreatePoll";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [isEmojiSelect, setIsEmojiSelect] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const InputMenuRef = useRef();

  const getContactData = async () => {
    // Pending
    console.log("Contact");
  };
  const onEmojiClick = (data) => {
    setText((pre) => pre + data.emoji);
  };
  const getLocation = async () => {
    //Pending
  };

  const handleCreatPoll = (data) => {
    console.log(data);
    setIsPollOpen(false);
  };

  return (
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
            <InputMenu
              icon={<GrGallery size={20} className="opacity-100 " />}
              lable="Gallery"
              input={<input type="file" className="hidden" />}
            />
            <InputMenu
              icon={<LuCamera size={20} />}
              lable="Camera"
              input={
                <input
                  type="file"
                  id="imageFile"
                  capture="user"
                  className="hidden"
                  accept="image/*"
                />
              }
            />
            <InputMenu
              icon={<MdOutlinePermContactCalendar size={20} />}
              lable="Contact"
              button={getContactData}
            />
            <InputMenu
              icon={<TiDocumentAdd size={20} />}
              lable="Document"
              input={
                <input
                  type="file"
                  className="hidden"
                  accept=".doc,.docx,.docm,.dot,.txt,.rtf,.pdf,.xlsx,.7"
                />
              }
            />
            <InputMenu
              icon={<MdOutlinePoll size={20} />}
              lable="Poll"
              button={() => setIsPollOpen(!isPollOpen)}
            />
            <InputMenu icon={<GrMapLocation size={20} />} lable="Location" />
          </ul>
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
      {/* Create a Poll */}
      {isPollOpen && (
        <CreatePoll
          close={() => setIsPollOpen(false)}
          handleCreatPoll={handleCreatPoll}
        />
      )}
    </div>
  );
};

const InputMenu = ({ icon, lable, button = null, input = null }) => {
  return (
    <li>
      <label onClick={button}>
        <span className="flex gap-x-2">
          {icon}
          {lable}
        </span>
        {input}
      </label>
    </li>
  );
};

export default ChatInput;
