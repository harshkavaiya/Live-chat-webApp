import { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import useAuthStore from "../../store/useAuthStore";
import { GoDotFill } from "react-icons/go";
import useVideoCall from "../../store/useVideoCall";
import toast from "react-hot-toast";

const VideoCall = () => {
  const {
    initializeVideoCall,
    localStream,
    isCallInProgress,
    endCall,
    Ringing,
    setRinging,
    Username,
  } = useVideoCall();
  const { socket } = useAuthStore();

  const myVideoRef = useRef(null); // Local video
  const peerVideoRef = useRef(null); // Remote video

  useEffect(() => {
    if (myVideoRef.current) {
      initializeVideoCall(myVideoRef.current, peerVideoRef.current);
    } else {
      console.error("myVideoRef is null during initialization");
    }
  }, [endCall, socket]);

  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    let interval;
    if (Ringing) {
      interval = setInterval(() => {
        setActiveDot((prev) => (prev + 1) % 3);
        if (isCallInProgress) {
          setRinging(false);
          console.log(isCallInProgress, "----", Ringing);
          clearInterval(interval);
        }
      }, 400);
    } else {
      setActiveDot(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [Ringing, isCallInProgress]);

  useEffect(() => {
    if (myVideoRef.current && localStream) {
      myVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <dialog id="video_call_modal" className={`modal overflow-hidden`}>
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}
        <div className="flex h-full w-full sm:gap-1 sm:h-screen">
          <div className="flex bg-base-100 h-7 justify-center p-3 rounded-btn shadow-lg w-auto absolute items-center left-4 sm:h-10 top-4 z-[11]">
            <h3 className="text-xs font-bold sm:text-base">{"You"}</h3>
          </div>
          {Ringing && (
            <div className="flex bg-opacity-20 bg-primary h-10 justify-center p-3 rounded-btn shadow-lg w-auto -translate-x-1/2 absolute gap-2 items-center left-1/2 top-4 transform z-20">
              {Array.from({ length: 3 }).map((_, i) => (
                <GoDotFill
                  key={i}
                  size={activeDot === i ? 30 : 20}
                  className={`transition-all duration-300 ${
                    activeDot === i
                      ? "text-primary -translate-y-1"
                      : "text-gray-700"
                  }`}
                />
              ))}
            </div>
          )}

          <video
            // Video 1
            ref={myVideoRef}
            autoPlay
            muted
            className={`transition-all z-10 duration-500 ease-in-out sm:h-auto ${
              isCallInProgress
                ? "sm:w-1/2 w-36 h-36 rounded-box sm:rounded-none absolute sm:static bottom-32 right-5 scale-90 sm:scale-100"
                : "w-full h-full scale-100"
            }  sm:rounded-r-box object-cover`}
          />
          <div
            className={`w-auto sm:h-10 h-7 bg-base-100 z-[11] shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 right-7 ${
              !isCallInProgress ? "hidden" : "sm:block hidden"
            } `}
          >
            <h3 className="text-xs font-bold sm:text-base">{Username}</h3>
          </div>
          <video
            // Video 2
            ref={peerVideoRef}
            autoPlay
            className={`w-full h-full sm:h-auto z-0 ${
              !isCallInProgress && "hidden"
            } sm:w-1/2 object-cover sm:rounded-l-box`}
          />
        </div>
        <CallControl model={1} />
      </div>
    </dialog>
  );
};

export default VideoCall;
