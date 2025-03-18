import { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import useVideoCall from "../../store/useVideoCall";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

const AudioCall = ({ name = "Hardik" }) => {
  const caller = [1, 2];
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0); // Time tracking state
  const {
    initializeVideoCall,
    endCall,
    isCallInProgress,
    incomingCall,
    callStartTime,
  } = useVideoCall.getState();
  const { socket } = useAuthStore();

  const myVideoRef = useRef(null); // Local audio
  const peerVideoRef = useRef(null);
  const timerRef = useRef(null); // Timer reference

  const handleAudioActivity = (isActive) => {
    setIsAudioActive(isActive);
  };

  // Timer calculation based on shared callStartTime
  useEffect(() => {
    if (callStartTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
        setCallDuration(elapsed);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }

    return () => clearInterval(timerRef.current);
  }, [callStartTime]);

  // Timer ko format karna (HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
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
      // Jab call reject ho
      socket.on("callRejected", (data) => {
        document.getElementById("audio_call_modal").close();
        endCall();
        toast.error(`Call rejected by ${data.from}`);
      });

      // Jab call end ho
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
        className={`bg-base-200 w-full h-full flex sm:flex-row flex-col gap-2 sm:gap-4 p-2 overflow-y-auto`}
      >
        {caller.map((i, index) => (
          <div
            key={index}
            className={`bg-base-100 flex flex-col pb-10 items-center justify-center relative rounded-box p-3 ${
              index === 1 ? (isCallInProgress ? "block" : "hidden") : "block"
            } ${index === 0 && isCallInProgress ? "w-full" : "w-full"} `}
          >
            <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-0 sm:justify-evenly">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-black rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1735533673~exp=1735537273~hmac=84847f1fa605ea9435463f9b4ef4bb57da7a30b64601b1076f57fef7e0e73d85&w=360"
                  alt=""
                  className="object-cover w-full h-full object-center"
                />
              </div>
              <h3 className="sm:text-lg sm:font-semibold capitalize">
                {index === 0 ? "hardik" : name}
              </h3>

              {/* Timer Show section */}
              <div
                className={`justify-center p-2 rounded-full flex items-center bg-base-300 absolute top-2 right-2 sm:top-5 sm:right-5 ${
                  index === 1 ? "hidden" : "block"
                }`}
              >
                <p>{formatTime(callDuration)}</p>
              </div>
            </div>

            {/* Audio Elements */}
            <audio
              ref={index === 0 ? myVideoRef : peerVideoRef}
              autoPlay
              muted={index === 0}
            />
          </div>
        ))}
      </div>

      <CallControl model={2} />
    </dialog>
  );
};

export default AudioCall;
