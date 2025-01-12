import React, { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import AudioWave from "./audioWave";
import Peer from "peerjs";
import io from "socket.io-client";

const AudioCall = ({ name, isCallActive, setIsCallActive }) => {
  const caller = [1, 2,5,4,5,8];
  const [isAudioActive, setIsAudioActive] = useState(false);

  // const [peerId, setPeerId] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);

  // const localAudioRef = useRef(null);
  // const remoteAudioRef = useRef(null);

  // const peerInstance = useRef(null);
  // const callInstance = useRef(null);
  let socket;

  // socket = io("http://localhost:4000");
  // useEffect(() => {
  //   if (isCallActive) {
  //     socket.emit("join-room", "room1", 12);
  //   }

  //   socket.on("user-connected", (data) => {
  //     console.log(data);
  //   });
  // }, [isCallActive]);

  const handleAudioActivity = (isActive) => {
    setIsAudioActive(isActive);
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div
        className={`bg-base-200 w-full h-full grid gap-2 sm:gap-4 p-2 overflow-y-auto
        ${
          caller.length === 2
            ? "sm:grid-cols-2 grid-cols-1"
            : "sm:grid-cols-3 grid-cols-2"
        }
        `}
      >
        {caller.map((i, index) => (
          <div
            key={index}
            className="bg-base-100 flex flex-col pb-10 items-center justify-center relative rounded-box p-3"
          >
            <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-0 sm:justify-evenly">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1735533673~exp=1735537273~hmac=84847f1fa605ea9435463f9b4ef4bb57da7a30b64601b1076f57fef7e0e73d85&w=360"
                  alt=""
                  className="object-cover"
                />
              </div>
              <h3 className="sm:text-lg sm:font-semibold capitalize">{name}</h3>
              <div
                className={`${
                  index == 0
                    ? "w-20 justify-between pl-3 p-[2px]"
                    : "w-8 justify-center"
                } h-8 rounded-full flex items-center bg-base-300 absolute top-2 right-2 sm:top-5 sm:right-5`}
              >
                <p className={`text-xs ${!index == 0 && "hidden"}`}>10:12</p>
                <div className="w-7 h-7 rounded-full bg-base-100 grid place-items-center">
                  <HiMiniSpeakerWave
                    size={20}
                    className={isAudioActive ? "text-primary" : "text-gray-500"}
                  />
                </div>
              </div>
            </div>
            {/* <AudioWave
              startCall={isCallActive}
              onAudioActivity={handleAudioActivity}
            /> */}
          </div>
        ))}
      </div>
      <CallControl
        model={2}
        setIsCallActive={setIsCallActive}
        isCallActive={isCallActive}
      />
    </dialog>
  );
};

export default AudioCall;
