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
import Location from "../Location";
import SendFilePreview from "../SendFilePreview";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [isEmojiSelect, setIsEmojiSelect] = useState(false);
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [GalleryData, setGalleryData] = useState([]);

  const inputMenuRef = useRef();
  const locationRef = useRef();

  const getContactData = async () => {
    // Pending
    console.log("Contact");
  };
  const onEmojiClick = (data) => {
    setText((pre) => pre + data.emoji);
  };
  const getLocation = async () => {
    if (latitude && longitude) {
      locationRef.current.classList.remove("hidden");
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          locationRef.current.classList.remove("hidden");
        });
      } else {
        setLatitude(false);
        setLongitude;
      }
    }
  };

  const handleCreatPoll = (data) => {
    console.log(data);
    setIsPollOpen(false);
  };

  const handelImageData = (e) => {
    setGalleryData([...e.target.files]);
    console.log(e.target.files);
  };

  return (
    <div className="border-t bg-base-100">
      <div className="flex items-center space-x-2 px-3 py-2">
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
            onClick={() => OpenCloseMenu(inputMenuRef)}
            className="cursor-pointer"
            size={28}
          />
          {text.length <= 0 && (
            <label>
              <span className="flex gap-x-2">
                <LuCamera className="cursor-pointer" size={20} />
              </span>
              <input
                type="file"
                id="selectImage"
                capture="user"
                className="hidden"
                onChangeCapture={(e) => console.log(e)}
                accept="image/*"
              />
            </label>
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
          ref={inputMenuRef}
          className="absolute right-24 z-20 bottom-[50px] hidden"
        >
          <ul className="menu bg-base-100 rounded-md font-medium border border-base-300 w-40 p-0 [&_li>*]:rounded-none">
            <InputMenu
              icon={<GrGallery size={20} className="opacity-100 " />}
              lable="Gallery"
              input={
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handelImageData}
                  accept=".jpg,.png,.jpeg,.mp4,.mkv"
                />
              }
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
            <InputMenu
              icon={<GrMapLocation size={20} />}
              lable="Location"
              button={getLocation}
            />
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

      {/* Location Send */}
      <div ref={locationRef} className="hidden">
        {latitude && longitude && (
          <Location
            latitude={latitude}
            longitude={longitude}
            close={() => OpenCloseMenu(locationRef)}
            shareLocation={() => console.log("Share")}
          />
        )}
      </div>

      {/* Gallery Data preview*/}
      {GalleryData.length > 0 && <SendFilePreview GalleryData={GalleryData} setGalleryData={setGalleryData} />}
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
