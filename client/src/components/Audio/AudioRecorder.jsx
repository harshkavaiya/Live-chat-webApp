import { useEffect } from "react";
import Visualizer from "./Visualizer";
import useAudioStore from "../../store/useAudioStore";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const AudioRecorder = () => {
  const {
    isRecording,
    recordingDuration,
    setRecordingDuration,
    formatDuration,
    stream,
    audioUrl,
    deleteRecording,
    sendRecording,
  } = useAudioStore();

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(recordingDuration + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingDuration]);

  return (
    <div className="w-full">
      <div className="w-[100%] flex items-center justify-center">
        {isRecording && (
          <span className="text-sm text-gray-500">
            {formatDuration(recordingDuration)}
          </span>
        )}
        <div className="w-[90%]">
          {isRecording && <Visualizer audioStream={stream} />}
        </div>
      </div>
      {audioUrl && (
        <div className="flex space-x-2">
          <audio className="w-full" controls src={audioUrl} />
          <button className="btn btn-error text-error-content rounded-full  p-1 outline-none w-12">
            <FaRegTrashAlt
              onClick={deleteRecording}
              size={20}
              className="cursor-pointer"
            />
          </button>
          <button className="btn btn-primary text-primary-content rounded-full  p-1 outline-none w-12">
            <IoSend
              onClick={sendRecording}
              className="cursor-pointer"
              size={20}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
