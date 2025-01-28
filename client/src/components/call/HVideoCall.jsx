import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCallStore from "../../store/useVideoCallStore";
import ReactPlayer from "react-player";

const VideoCall = () => {
  const { socket } = useAuthStore();
  const {
    callUser,
    handleRequestCall,
    handleAcceptedCall,
    myStream,
    peer,
    trackRemoteStream,
    remoteStream,
    isCalling,
    handleNegotiatiton,
    handlleIcegatheringstatechange,
  } = useVideoCallStore();

  useEffect(() => {
    if (socket) {
      socket.on("request_call", handleRequestCall);
      socket.on("call_accepted", handleAcceptedCall);
      peer.addEventListener("track", trackRemoteStream);
      peer.addEventListener(
        "icegatheringstatechange",
        handleNegotiatiton
      );
      peer.addEventListener("negotiationneeded", handleNegotiatiton);
      return () => {
        socket.off("request_call");
        socket.off("call_accepted");
        peer.removeEventListener(
          "icegatheringstatechange",
          handleNegotiatiton
        );
        peer.removeEventListener("track", trackRemoteStream);
        peer.removeEventListener("negotiationneeded", handleNegotiatiton);
      };
    }
  }, [
    peer,
    socket,
    handleRequestCall,
    handleAcceptedCall,
    trackRemoteStream,
    callUser,
  ]);

  const [isStreamReady, setIsStreamReady] = useState(false);

  useEffect(() => {
    if (myStream && remoteStream) {
      setIsStreamReady(true);
    }
  }, [myStream, remoteStream]);

  return (
    // <dialog id="my_modal_1" className="modal overflow-hidden">
    <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
      {/* Video Screen */}

      <button
        disabled={isCalling}
        className="w-20 h-16 bg-primary disabled:bg-base-300"
        onClick={() => callUser("676ccfa646ccd0eedd02d05c")}
      >
        Call
      </button>
      <div className="w-full h-full sm:h-screen flex sm:gap-1">
        {/* <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
          <h3 className="font-bold text-base">{name}</h3>
        </div> */}
        <div>
          <h3>My Video</h3>
          {myStream && (
            <ReactPlayer
              url={myStream}
              playing={true}
              muted={true}
              controls={true}
              width="100%"
              height="100%"
            />
          )}
        </div>
        <div>
          <h3>Remote Video</h3>
          {remoteStream && (
            <ReactPlayer
              url={remoteStream}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>
      {!isStreamReady && <p>Waiting for the call to be connected...</p>}
      {/* <CallControl model={1} /> */}
    </div>
    // </dialog>
  );
};

export default VideoCall;
