import { GrMapLocation } from "react-icons/gr";
import { TiDocumentAdd } from "react-icons/ti";
import { GoPlus } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { MdOutlinePermContactCalendar, MdOutlinePoll } from "react-icons/md";
import { FaRegPauseCircle } from "react-icons/fa";
import { LuCamera } from "react-icons/lu";
import { memo, useCallback, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import CreatePoll from "../Poll/CreatePoll";

import AudioRecorder from "../Audio/AudioRecorder";
import axiosInstance from "../../lib/axiosInstance";
import useFunctionStore from "../../store/useFuncationStore";
import useMessageStore from "../../store/useMessageStore";
import useAudioStore from "../../store/useAudioStore";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [isPollOpen, setIsPollOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const {
    getLocation,
    handelGalleryData,
    onSelectContact,
  } = useFunctionStore();
  const { startRecording, isRecording, stopRecording, audioUrl } =
    useAudioStore();

  const { sendMessage } = useMessageStore();

  const handleCreatPoll = (data) => {
    sendMessage({
      type: "poll",
      data,
    });
    setIsPollOpen(false);
  };

  const handelUploadDocument = useCallback(async (e) => {
    let form = new FormData();

    form.append("file", e.target.files[0]);
 await axiosInstance.post("/upload", form);
  }, []);

  return (
    <>
      {/* input section */}
      <div className="flex items-center space-x-2 px-3 py-2 w-full border-t border-base-300 bg-base-100">
        {!isRecording && !audioUrl && (
          <div className="py-1 px-2 flex w-full items-center space-x-1 rounded-full border border-base-300">
            <input
              className="w-[82%] bg-transparent sm:w-full p-1 md:p-2 focus:outline-none outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your message..."
              type="text"
            />
            <div className="dropdown dropdown-top  dropdown-end">
              <GoPlus
                className="cursor-pointer "
                size={28}
                role="button"
                tabIndex={0}
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 border mt-3 mr-2 w-56 rounded-box z-20 p-2 shadow-lg gap-1"
              >
                <InputMenu
                  icon={<GrGallery size={20} className="opacity-100 " />}
                  lable="Gallery"
                  input={
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handelGalleryData}
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
                      onChangeCapture={handelGalleryData}
                      capture="user"
                      className="hidden"
                      accept="image/*"
                    />
                  }
                />
                <InputMenu
                  icon={<MdOutlinePermContactCalendar size={20} />}
                  lable="Contact"
                  button={onSelectContact}
                />
                <InputMenu
                  icon={<TiDocumentAdd size={20} />}
                  lable="Document"
                  input={
                    <input
                      type="file"
                      className="hidden"
                      onChange={handelUploadDocument}
                      accept=".doc,.docx,.docm,.txt,.pdf"
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
            {text.length <= 0 && (
              <label>
                <span className="flex gap-x-2">
                  <LuCamera className="cursor-pointer" size={20} />
                </span>
                <input
                  type="file"
                  id="imageFile"
                  onChangeCapture={handelGalleryData}
                  capture="user"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            )}
          </div>
        )}
        {(isRecording || audioUrl != null) && (
          <AudioRecorder isRecording={isRecording} />
        )}

        {!audioUrl && (
          <div className="">
            {text.length > 0 ? (
              <button
                onClick={() => {
                  sendMessage({ data: text, type: "text" });
                  setText("");
                }}
                className="btn btn-primary rounded-full w-12 p-1 outline-none"
              >
                <IoSend className="cursor-pointer" size={20} />
              </button>
            ) : !isRecording ? (
              <button
                onClick={() => startRecording(mediaRecorderRef)}
                className="btn btn-primary rounded-full w-12 p-1 outline-none"
              >
                <FaMicrophone className="cursor-pointer" size={20} />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="btn btn-primary rounded-full w-12 p-1 outline-none"
              >
                <FaRegPauseCircle className="cursor-pointer" size={28} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create a Poll */}
      {isPollOpen && (
        <CreatePoll
          close={() => setIsPollOpen(false)}
          handleCreatPoll={handleCreatPoll}
        />
      )}
      
    </>
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

export default memo(ChatInput);
