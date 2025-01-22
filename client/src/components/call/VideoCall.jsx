import React, { useCallback, useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";

const VideoCall = ({ name }) => {
  const { initializeVideoCall, isCallInProgress,endCall } = useVideoCall.getState();
  const { socket } = useAuthStore();

  const myVideoRef = useRef(null); // Local video
  const peerVideoRef = useRef(null); // Remote video

  useEffect(() => {
    initializeVideoCall(myVideoRef.current, peerVideoRef.current);
    console.log("Video call initialized");
  }, [initializeVideoCall]);

  useEffect(() => {
    if (socket) {
      // Handle ended calls
      socket.on("callEnded", (data) => {
        console.log("Call ended by:", data.from);
        document.getElementById("my_modal_1").close();
      endCall();
      });
    }
  }, []);

  return (
    <dialog id="my_modal_1" className="modal overflow-hidden">
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
            <h3 className="font-bold text-base">{name}</h3>
          </div>

          <video
            // Video 1
            ref={myVideoRef}
            autoPlay
            muted
            className={`transition-all duration-500 ease-in-out sm:h-auto ${
              isCallInProgress
                ? "sm:w-1/2 w-36 h-36 rounded-box sm:rounded-none absolute sm:static bottom-32 right-5 scale-90 sm:scale-100"
                : "w-full h-full scale-100"
            }  sm:rounded-r-box object-cover`}
          />

          <video
            // Video 2
            ref={peerVideoRef}
            autoPlay
            className={`w-full h-full sm:h-auto ${
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
