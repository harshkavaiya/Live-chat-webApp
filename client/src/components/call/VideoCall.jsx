import React, { useEffect, useRef, useState } from "react";
import { BsMicMuteFill } from "react-icons/bs";
import { FaMicrophone, FaUser } from "react-icons/fa6";
import { IoMic } from "react-icons/io5";
import { LuSwitchCamera } from "react-icons/lu";
import { MdCallEnd, MdMic, MdMicOff } from "react-icons/md";

const VideoCall = ({ name }) => {
  const smallSize = false;
  const [miccontroll, setmic] = useState(true);
  const micHanlder = () => {
    setmic(!miccontroll);
  };
  const endCall = () => {
    document.getElementById("my_modal_1").close();
  };

  // const videoRef = useRef(null);
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: false })
  //     .then((stream) => {
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error accessing the camera: ", error);
  //     });
  // }, []);

  return (
    <dialog id="my_modal_1" className="modal">
      <div
        className={`bg-base-300 relative ${
          smallSize ? "w-10/12" : "w-full h-full"
        }`}
      >
        {/* video screen */}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="btn w-12 h-12 shadow-lg group rounded-full absolute top-3 left-3">
            <FaUser size={20} />
            {/* <h3 className="font-bold bg-black text-lg">{name}</h3> */}
          </div>

          <video
            // ref={videoRef}
            src="https://cdn.pixabay.com/video/2016/08/22/4723-179738625_large.mp4"
            autoPlay
            className="h-full sm:h-auto sm:w-1/2 sm:rounded-r-box object-cover"
          />

          <video
            // ref={videoRef}
            src="https://cdn.pixabay.com/video/2023/07/12/171272-845168271_large.mp4"
            autoPlay
            className="w-36 h-36 sm:h-auto sm:w-1/2 object-cover sm:rounded-r-box rounded-box absolute sm:static bottom-32 right-5"
          />
        </div>

        <div className="flex w-full bottom-5 items-center gap-3 justify-evenly absolute">
          <button className="btn w-20 h-20 shadow-lg group rounded-full border-none">
            <LuSwitchCamera
              size={25}
              className="text-primary group-hover:rotate-180 transition-all duration-200"
            />
          </button>
          <button
            className="btn w-20 h-20 bg-red-700 group hover:bg-red-800 border-none shadow-lg rounded-full"
            onClick={endCall}
          >
            <MdCallEnd
              size={30}
              className="text-white group-hover:-rotate-45 transition-all duration-300"
            />
          </button>
          <button
            className="btn w-20 h-20 shadow-lg group rounded-full border-none"
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
    </dialog>
  );
};

export default VideoCall;
