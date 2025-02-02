import { memo, useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";
import useStatusStore from "../../store/useStatusStore";

const StatusViewer = ({
  currentRunningStatus,
  currentStatusIndex,
  onPrevious,
  onNext,
}) => {
  const videoRef = useRef();
  const [duration, setDuration] = useState(15);
  const { isProcess, setIsProcess } = useStatusStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isProcess <= 100) {
        let process = isProcess + 10 / duration;
        setIsProcess(process);
      } else {
        setIsProcess(0);
        onNext();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [
    currentStatusIndex,
    currentRunningStatus,
    setIsProcess,
    isProcess,
    duration,
  ]);

  const handleMetadataCapture = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  return (
    <div className="relative h-full w-full">
      {currentRunningStatus[currentStatusIndex].type == "video" ? (
        <video
          src={currentRunningStatus[currentStatusIndex].url}
          autoPlay
          ref={videoRef}
          onLoadedMetadataCapture={handleMetadataCapture}
          className="w-full h-full object-contain"
        />
      ) : (
        <img
          src={
            currentRunningStatus[currentStatusIndex].url || "/placeholder.svg"
          }
          alt="Status"
          className="w-full h-full object-contain"
        />
      )}

      <div className="absolute z-10  left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center text-white">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <FaUser className="text-gray-600" />
          </div>
          <div>
            <h2 className="font-semibold">
              {currentRunningStatus[currentStatusIndex].user}
            </h2>
            <ReactTimeAgo
              className="text-sm opacity-75"
              date={currentRunningStatus[currentStatusIndex].time}
            />
          </div>
        </div>
      </div>
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        onClick={onPrevious}
      ></div>
      <div className="absolute inset-y-0 right-0 w-1/2" onClick={onNext}></div>
    </div>
  );
};

export default StatusViewer;
