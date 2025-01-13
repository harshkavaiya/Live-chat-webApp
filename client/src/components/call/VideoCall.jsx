import { useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCallStore from "../../store/useVideoCallStore";
import CallControl from "./CallControl";
import ReactPlayer from "react-player";

const VideoCall = ({ name }) => {
  const { socket } = useAuthStore();
  const {
    callUser,
    handleRequestCall,
    handleAccpetedCall,
    myStream,
    peer,
    trackRemoteStream,
    remoteStream,
    handleNegotiation,
  } = useVideoCallStore();

  useEffect(() => {
    if (socket) {
      socket.on("request_call", handleRequestCall);

      peer.addEventListener("track", trackRemoteStream);
      peer.addEventListener(
        "negotiationneeded",
        async () => await handleNegotiation("676ccfa646ccd0eedd02d05c", socket)
      );

      return () => {
        socket.off("request_call", handleRequestCall);
        socket.off("call_accepted", handleAccpetedCall);

        peer.removeEventListener("track", trackRemoteStream);
        peer.removeEventListener("negotiationneeded", () =>
          handleNegotiation("676ccfa646ccd0eedd02d05c")
        );
      };
    }
  }, [
    peer,
    handleRequestCall,
    handleAccpetedCall,
    trackRemoteStream,
    callUser,
  ]);

  return (
    // <dialog id="my_modal_1" className="modal overflow-hidden">
    <div className={`bg-base-300 relative overflow-hidden w-full h-full`}>
      {/* Video Screen */}

      <button
        className="w-20 h-16 bg-primary "
        onClick={() => callUser("676ccfa646ccd0eedd02d05c", socket)}
      >
        Call
      </button>
      <div className="w-full h-full sm:h-screen flex sm:gap-1">
        {/* <div className="w-auto h-10 bg-base-100 shadow-lg rounded-btn p-3 flex items-center justify-center absolute top-4 left-4">
          <h3 className="font-bold text-base">{name}</h3>
        </div> */}

        <ReactPlayer url={myStream} playing muted />
        <ReactPlayer url={remoteStream} playing />
      </div>

      <CallControl model={1} />
    </div>
    // </dialog>
  );
};

export default VideoCall;
