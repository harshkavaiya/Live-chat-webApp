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
      <div className="absolute w-full h-full flex flex-col items-center">
        {currentStatusIndex == null && (
          <div className="relative flex flex-col h-screen w-full sm:w-[70%] bg-primary/50 text-primary ">
            {/* Status Header */}
            <div className=" flex items-center p-3 bg-primary-content/90 shadow-md">
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
                    className="flex items-center cursor-pointer bg-primary-content p-3.5 rounded-lg shadow-lg hover:shadow-xl"
                  >
                    <div
                      className="avatar"
                      onClick={() => setCurrentStatusIndex(i)}
                    >
                      <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-[#233138] ring-offset-2">
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
                      <div className="text-lg font-semibold text-base-100 ">
                        <span className="mr-2">{seen.length}</span>Views
                      </div>
                      <div className="text-sm text-base-100/70">
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
              <button className="btn btn-circle bg-primary/6  0 text-primary-content hover:bg-primary h-12 w-12 shadow-lg transition-all duration-300 hover:scale-110">
                <MdModeEdit className="h-6 w-6" />
              </button>
              <button className="btn btn-circle bg-primary-content/80 hover:bg-primary-content text-base-100 h-16 w-16 shadow-lg transition-all duration-300 hover:scale-110">
                <MdOutlinePhotoCamera className="h-8 w-8" />
              </button>
            </div>
          </div>
        )}
        {currentStatusIndex != null && (
          <div className="fixed sm:w-96 w-[40%] h-full flex items-center justify-center bg-black">
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
            />
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
    </>
  );
};

export default MyStatusPreview;
