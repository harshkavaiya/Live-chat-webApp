import React, { useState } from "react";
import { LuSwitchCamera } from "react-icons/lu";
import { MdCallEnd, MdMic, MdMicOff } from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { BiSolidPhoneCall } from "react-icons/bi";
import useVideoCall from "../../store/useVideoCall";

const CallControl = ({ model }) => {
  const [miccontroll, setmic] = useState(true);
  const [speaker, setSpeaker] = useState(true);

  const { endCallByPeer, toggleMic } = useVideoCall
  const micHanlder = () => {
    setmic(!miccontroll);
    toggleMic(!miccontroll);
  };

  const speakerHandler = () => {
    setSpeaker(!speaker);
  };

  return (
    <div className="flex w-full bottom-5 items-center justify-center absolute z-50">
      <div className="bg-base-300 flex items-center gap-5 sm:gap-10 px-3 py-2 bg-opacity-70 rounded-box">
        <button
          className={`btn w-14 h-14 shadow-lg group rounded-full border-none bg-white hover:bg-white/90`}
          onClick={model == 2 ? speakerHandler : undefined}
        >
          {model == 2 ? (
            speaker ? (
              <HiMiniSpeakerWave size={25} className="text-primary" />
            ) : (
              <BiSolidPhoneCall size={25} className="text-primary" />
            )
          ) : (
            <LuSwitchCamera
              size={25}
              className="text-primary sm:group-hover:rotate-180 transition-all duration-200"
            />
          )}
        </button>
        <button
          className="btn w-14 h-14 bg-red-700 group hover:bg-red-800 border-none shadow-lg rounded-full"
          onClick={()=>handleEndCall(socket)}
        >
          <MdCallEnd
            size={30}
            className="text-white group-hover:-rotate-0 -rotate-45 transition-all duration-300"
          />
        </button>
        <button
          className={`btn w-14 h-14 shadow-lg group rounded-full border-none ${
            miccontroll ? "bg-white hover:bg-white/90" : "bg-black"
          }`}
          onClick={micHanlder}
        >
          {miccontroll ? (
            <MdMic size={30} className="text-primary" />
          ) : (
            <MdMicOff size={30} className="text-primary" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CallControl;
