import React from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";

const IncomingCallDialog = () => {
  const { answerCall, incomingCall } = useVideoCall();

  return (
    <dialog id="incomingDialog" className="modal">
      <div className="sm:modal-box w-full h-full bg-base-100 relative gap-2 overflow-hidden sm:max-w-xl p-5 flex flex-col">
        <p>call from : {incomingCall}</p>
        <button className="btn" onClick={answerCall}>
          accept
        </button>
        <button className="btn">reject</button>
      </div>
    </dialog>
  );
};

export default IncomingCallDialog;
