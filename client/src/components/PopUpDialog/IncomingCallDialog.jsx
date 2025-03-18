//after chnages
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import useVideoCall from "../../store/useVideoCall";
import VideoCall from "../call/VideoCall";
import AudioCall from "../call/AudioCall";
import { HiArrowSmallLeft, HiPhone } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";

const IncomingCallDialog = () => {
  const { answerCall, rejectCall, callType, userInfo } =
    useVideoCall.getState();

  const incomingCall = useVideoCall((state) => state.incomingCall);

  const dialogRef = useRef(null);

  useEffect(() => {
    console.log("user data is --->>", userInfo);
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
  }, [incomingCall, userInfo]);

  if (!incomingCall) return null;

  const AcceptAnswere = () => {
    document.getElementById("incomingDialog").close();
    answerCall();
    if (callType === "video") {
      document.getElementById("video_call_modal").showModal();
    } else {
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
        <VideoCall Username={userInfo.fullname} />
      ) : (
        <AudioCall Username={userInfo.fullname} photo={userInfo.photo}/>
      )}
      <dialog id="incomingDialog" ref={dialogRef} className="modal">
        <div className="sm:modal-box w-full select-none h-full bg-base-100 relative flex flex-col items-center justify-center gap-6 sm:max-w-lg">
          {/* Header */}
          <div className="absolute top-4 left-4">
            <HiArrowSmallLeft size={24} className="cursor-pointer" />
          </div>
          <p className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg font-semibold">
            Incoming {callType === "video" ? "Video" : "Voice"} Call
          </p>

          {/* Profile Photo & Name */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-800">
              <img
                src={
                  userInfo.photo
                    ? userInfo.photo
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSc74iwal7QiOS_hvo6cdhH-5g4AHSqzmTTuBVZfdJ1EHWpx7mArp30GfR5BkGCg_WTkk&usqp=CAU"
                }
                alt="profile photo"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <p className="mt-4 text-lg font-semibold">{userInfo.fullname}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 fixed bottom-10">
            <span className="flex flex-col items-center gap-1">
              <button
                onClick={AcceptAnswere}
                className="btn w-16 h-16 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-700 text-white shadow-lg"
              >
                <HiPhone size={28} />
              </button>
              <p>Confirm</p>
            </span>
            <span className="flex flex-col items-center gap-1">
              <button
                onClick={RejectCall}
                className="btn w-16 h-16 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-700 text-white shadow-lg"
              >
                <IoMdClose size={28} />
              </button>
              <p>Reject</p>
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default IncomingCallDialog;
