import  { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";
import VideoCall from "../call/VideoCall";
import AudioCall from "../call/AudioCall";

const IncomingCallDialog = ({ dialoghandler, open }) => {
  const { answerCall, incomingCall, rejectCall, callType } =
    useVideoCall.getState();

  const AcceptAnswere = () => {
    dialoghandler(false);
    answerCall();
    if (callType === "video") {
      document.getElementById("my_modal_1").showModal();
    } else if (callType === "voice") {
      document.getElementById("my_modal_2").showModal();
    }
  };
  const RejectCall = () => {
    dialoghandler(false); // Close the dialog when rejected
    rejectCall(); // Reject the call and notify the caller
  };

  return (
    <>
      {incomingCall && callType === "video" ? (
        <VideoCall name={"harsh"} />
      ) : (
        <AudioCall name={"hk"} />
      )}
      <dialog id="incomingDialog" className={`modal ${open && "modal-open"}`}>
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
