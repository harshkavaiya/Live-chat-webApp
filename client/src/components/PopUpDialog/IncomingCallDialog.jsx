//after chnages
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";
import VideoCall from "../call/VideoCall";
import AudioCall from "../call/AudioCall";

const IncomingCallDialog = () => {
  const { answerCall, rejectCall, callType } = useVideoCall.getState();

  const incomingCall = useVideoCall((state) => state.incomingCall);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (incomingCall) {
      console.log("IncomingCallDialog: Opening dialog for", incomingCall);
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  const AcceptAnswere = () => {
    document.getElementById("incomingDialog").close();
    answerCall();
    if (callType === "video") {
      document.getElementById("video_call_modal").showModal();
    } else if (callType === "voice") {
      document.getElementById("audio_call_modal").showModal();
    }
  };
  const RejectCall = () => {
    document.getElementById("incomingDialog").close();
    rejectCall(); // Reject the call and notify the caller
  };

  return (
    <>
      {incomingCall && callType === "video" ? (
        <VideoCall name={"harsh"} />
      ) : (
        <AudioCall name={"hk"} />
      )}
      <dialog id="incomingDialog" ref={dialogRef} className={`modal `}>
        <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
          <p>call from : {incomingCall}</p>
          <button className="btn" onClick={AcceptAnswere}>
            accept
          </button>
          <button className="btn" onClick={RejectCall}>
            reject
          </button>
        </div>
      </dialog>
    </>
  );
};

export default IncomingCallDialog;
