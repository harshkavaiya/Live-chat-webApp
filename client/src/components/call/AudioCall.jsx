import { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import useVideoCall from "../../store/useVideoCall";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

const AudioCall = ({ name="Hardik" }) => {
  const caller = [1, 2];
  const [isAudioActive, setIsAudioActive] = useState(false);
  const { initializeVideoCall, endCall } = useVideoCall.getState();
  const { socket } = useAuthStore();
  const myVideoRef = useRef(null); // Local video
  const peerVideoRef = useRef(null);

  const handleAudioActivity = (isActive) => {
    setIsAudioActive(isActive);
  };
  useEffect(() => {
    if (myVideoRef.current) {
      initializeVideoCall(myVideoRef.current, peerVideoRef.current);
      console.log("Initialized with audio refs");
    } else {
      console.error("myVideoRef is null during initialization");
    }
  }, []);

  useEffect(() => {
    if (socket) {
      //reject call
      socket.on("callRejected", (data) => {
        document.getElementById("audio_call_modal").close();
        endCall();
        toast.error(`Call rejected by ${data.from}`);
      });

      // Handle ended calls
      socket.on("callEnded", (data) => {
        console.log("Call ended by:", data.from);
        document.getElementById("audio_call_modal").close();
        endCall();
        console.log("cleaning resources");
      });

      return () => {
        socket.off("callRejected");
        socket.off("callEnded");
      };
    }
  }, [socket]);

  return (
    <dialog id="audio_call_modal" className="modal">
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
            <audio ref={myVideoRef} muted></audio>
            <audio ref={peerVideoRef} autoPlay></audio>
          </div>
        ))}
      </div>
      <CallControl model={2} />
    </dialog>
  );
};

export default AudioCall;
