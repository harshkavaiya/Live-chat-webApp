import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa6";
import StatusViewer from "./StatusViewer";
import StatusProgressBar from "./StatusProgressBar";
import useStatusStore from "../../store/useStatusStore";
import axiosInstance from "../../lib/axiosInstance";
import { useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";

const StatusShow = () => {
  const {
    onCloseCurrentStatus,
    currentRunningStatus,
    currentStatusIndex,
    onPrevious,
    onNext,
    friendStatus,
    currentUserRunningStatus,
    isProcess,
  } = useStatusStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    handleStatusSeen();
  }, [currentStatusIndex]);

  const handleStatusSeen = async () => {
    const date = new Date();
    await axiosInstance.post(
      `status/seen/${friendStatus[currentUserRunningStatus]._id}`,
      {
        index: currentStatusIndex,
        userId: authUser._id,
        userName: authUser.fullname,
        time: date.getTime(),
      }
    );
  };

  return (
    <dialog id="my_modal_3" className="modal modal-open">
      <div className="w-full h-full bg-base-300 flex items-center flex-col">
        <FaArrowLeft
          size={20}
          className="absolute hidden sm:inline top-6 z-10 left-5 cursor-pointer"
          onClick={onCloseCurrentStatus}
        />
        <div className="fixed sm:w-96 w-[40%] h-full flex items-center justify-center bg-black">
          <StatusProgressBar
            isProcess={isProcess}
            currentRunningStatus={currentRunningStatus}
            currentStatusIndex={currentStatusIndex}
          />
          <StatusViewer
            currentRunningStatus={currentRunningStatus}
            currentStatusIndex={currentStatusIndex}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
        <span
          className="absolute sm:hidden top-6 p-1 bg-base-300 rounded-full right-5 cursor-pointer"
          onClick={onCloseCurrentStatus}
        >
          <RxCross2 size={18} />
        </span>
      </div>
    </dialog>
  );
};

export default StatusShow;
