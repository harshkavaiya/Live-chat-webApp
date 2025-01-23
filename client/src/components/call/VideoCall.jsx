import React, { useCallback, useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import useAuthStore from "../../store/useAuthStore";
import { GoDotFill } from "react-icons/go";
import useVideoCall from "../../store/useVideoCall";

const VideoCall = ({ name }) => {
  const { initializeVideoCall, localStream, isCallInProgress, endCall } =
    useVideoCall.getState();
  const { socket } = useAuthStore();

  const myVideoRef = useRef(null); // Local video
  const peerVideoRef = useRef(null); // Remote video
  const [Ringing, setRinging] = useState(true);

  useEffect(() => {
    initializeVideoCall(myVideoRef.current, peerVideoRef.current);
    console.log("Video call initialized");
    return () => {
      // Cleanup video refs when the component unmounts
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = null;
      }
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Handle ended calls

      socket.on("callEnded", (data) => {
        console.log("Call ended by:", data.from);
        setRinging(false); // Stop ringing
        document.getElementById("my_modal_1").close();
        endCall();
        console.log("cleaning resources");
      });

      // Clean up socket events on unmount
      return () => {
        socket.off("callEnded");
      };
    }
  }, [socket]);
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

  return (
    <dialog id="my_modal_1" className="modal overflow-hidden">
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="w-auto h-10 bg-base-100 z-10 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
            <h3 className="font-bold text-base">{name}</h3>
          </div>
          {Ringing && (
            <div className="flex items-center justify-center absolute z-20 top-4 left-1/2 transform -translate-x-1/2 gap-2 bg-primary backdrop-blur-sm bg-opacity-20 shadow-lg rounded-btn w-auto h-10 p-3">
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
