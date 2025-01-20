import React, { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";

const VideoCall = ({ name }) => {
  const { initializeVideoCall, peer } = useVideoCall.getState();
  const myVideoReff = document.getElementById("myVideo");
  // const peerVideoReff = document.getElementById("peerVideo");

  // const remoteRef = useRef();
  const myVideoRef = useRef(null); // Local video
  const peerVideoRef = useRef(null); // Remote video

  useEffect(() => {
    initializeVideoCall(myVideoRef.current, peerVideoRef.current);
    console.log("Video call initialized");
  }, [initializeVideoCall]);

  const { localStream } = useVideoCall.getState();
  useEffect(() => {
    // Handle incoming call (when another user call
    console.log(localStream)
    if (localStream) {
      peer.on("call", (call) => {
        console.log("localStream", localStream);
        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          console.log("Remote Stream Received", remoteStream);
          peerVideoRef.current.srcObject = remoteStream;
        });
      });
    }
  }, [localStream]);

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
            // id="myVideo"
            ref={myVideoRef}
            autoPlay
            className="h-full sm:h-auto sm:w-1/2 sm:rounded-r-box object-cover"
          />

          <video
            // Video 2
            ref={peerVideoRef}
            // id="peerVideo"
            autoPlay
            className="w-36 h-36 sm:h-auto sm:w-1/2 object-cover sm:rounded-r-box rounded-box absolute sm:static bottom-32 right-5"
          />
        </div>

        <CallControl model={1} />
      </div>
    </dialog>
  );
};

export default VideoCall;
