import React, { useEffect, useRef, useState } from "react";
import CallControl from "./CallControl";

const VideoCall = ({ name }) => {
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
    <dialog id="my_modal_1" className="modal overflow-hidden">
      <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
        {/* Video Screen */}
        <div className="w-full h-full sm:h-screen flex sm:gap-1">
          <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
            <h3 className="font-bold text-base">{name}</h3>
          </div>

          <video
            // Video 1
            src="https://cdn.pixabay.com/video/2016/08/22/4723-179738625_large.mp4"
            autoPlay
            className="h-full sm:h-auto sm:w-1/2 sm:rounded-r-box object-cover"
          />

          <video
            // Video 2
            src="https://cdn.pixabay.com/video/2016/08/22/4723-179738625_large.mp4"
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
