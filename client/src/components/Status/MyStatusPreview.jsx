import { FaArrowLeft } from "react-icons/fa6";
import {
  MdModeEdit,
  MdOutlinePhotoCamera,
  MdOutlineDeleteForever,
} from "react-icons/md";
import useStatusStore from "../../store/useStatusStore";
import ReactTimeAgo from "react-time-ago";
import StatusProgressBar from "./StatusProgressBar";
import StatusViewer from "./StatusViewer";
import { useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import WhoSeenStatus from "./WhoSeenStatus";
import { SelectFile } from "../../pages/Status";

const MyStatusPreview = () => {
  const {
    myStatus,
    setIsStatusPageOpen,
    isProcess,
    setIsProcess,
    onDeleteStatus,
  } = useStatusStore();
  const [currentStatusIndex, setCurrentStatusIndex] = useState(null);
  const [deleteStatusData, setDeleteStatusData] = useState(0);
  const [isStatusViewer, setIsStatusViewer] = useState(false);

  const onPrevious = useCallback(() => {
    if (myStatus[currentStatusIndex - 1]) {
      setCurrentStatusIndex((pre) => pre - 1);
    } else {
      setCurrentStatusIndex(null);
    }
    setIsProcess(0);
  });

  const onNext = useCallback(() => {
    if (myStatus.length - 1 > currentStatusIndex) {
      setCurrentStatusIndex((pre) => pre + 1);
    } else {
      setCurrentStatusIndex(null);
    }
    setIsProcess(0);
  });

  const deleteStatus = () => {
    onDeleteStatus(deleteStatusData);
    document.getElementById("my_modal_1").close();
  };

  return (
    <>
      <div className="absolute w-full h-full flex flex-col items-center bg-base-200 z-40">
        {currentStatusIndex == null && (
          <div className="relative flex flex-col h-screen w-full sm:w-[70%]  bg-primary/25">
            {/* Status Header */}
            <div className=" flex items-center p-3 bg-primary-content/90 text-primary shadow-md">
              <button
                onClick={() => setIsStatusPageOpen(false)}
                className="btn btn-ghost btn-circle"
              >
                <FaArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold ml-4">My Status</h1>
            </div>

            {/* Status Content */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide">
              {myStatus.map((item, i) => {
                const { seen, type, url, time } = item;
                return (
                  <div
                    key={i}
                    className="flex items-center cursor-pointer px-3 py-2 border-b"
                  >
                    <div
                      className="avatar"
                      onClick={() => setCurrentStatusIndex(i)}
                    >
                      <div className="w-14 h-14 rounded-full">
                        {type == "image" ? (
                          <img
                            src={url}
                            alt="Profile picture"
                            className="object-cover"
                          />
                        ) : (
                          <video src={`${url}#0.1`} />
                        )}
                      </div>
                    </div>
                    <div
                      className="ml-4 flex-1"
                      onClick={() => setCurrentStatusIndex(i)}
                    >
                      <div className="text-lg font-semibold">
                        <span className="mr-2">{seen.length}</span>Views
                      </div>
                      <div className="text-xs">
                        <ReactTimeAgo date={time} />
                      </div>
                    </div>
                    <label
                      onClick={() => {
                        document.getElementById("my_modal_1").showModal();
                        setDeleteStatusData(i);
                      }}
                      className="btn text-error hover:text-error-content hover:bg-error btn-circle btn-ghost"
                    >
                      <MdOutlineDeleteForever className="h-7 w-7" />
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-6 right-6 flex flex-col items-center gap-4">
              <button className="btn btn-circle bg-primary/60  hover:bg-primary h-12 w-12 shadow-lg transition-all duration-300 hover:scale-110">
                <MdModeEdit className="h-6 w-6" />
              </button>
              <label htmlFor="selectfile" className="btn btn-circle bg-primary-content/80 hover:bg-primary-content h-16 w-16 shadow-lg transition-all duration-300 hover:scale-110">
                <MdOutlinePhotoCamera className="h-8 w-8" />

            <SelectFile/>
              </label>
            </div>
          </div>
        )}
        {currentStatusIndex != null && (
          <div className="fixed w-full h-full sm:w-[40%] sm:h-full flex items-center justify-center bg-black">
            <IoClose
              size={30}
              className="absolute top-6 z-10 right-5 cursor-pointer text-white"
              onClick={() => {
                setCurrentStatusIndex(null);
                setIsProcess(0);
              }}
            />
            <StatusProgressBar
              isProcess={isProcess}
              currentRunningStatus={myStatus}
              currentStatusIndex={currentStatusIndex}
            />

            <StatusViewer
              currentRunningStatus={myStatus}
              currentStatusIndex={currentStatusIndex}
              onPrevious={onPrevious}
              onNext={onNext}
              isMyStatus={true}
              isStatusViewer={isStatusViewer}
            />
            <div
              onClick={() => setIsStatusViewer(true)}
              className="bottom-0 w-full h-16 absolute flex items-start justify-center"
            >
              <IoIosArrowUp
                size={30}
                className="z-10 cursor-pointer text-white"
              />
            </div>
          </div>
        )}
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="sfont-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
            <button className="btn btn-error" onClick={deleteStatus}>
              Delete
            </button>
          </div>
        </div>
      </dialog>

      {isStatusViewer && (
        <WhoSeenStatus
          viewers={myStatus[currentStatusIndex].seen}
          close={() => setIsStatusViewer(false)}
        />
      )}
    </>
  );
};

export default MyStatusPreview;
