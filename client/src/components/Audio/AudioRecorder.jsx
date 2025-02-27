import { useEffect, useState } from "react";
import Visualizer from "./Visualizer";
import useAudioStore from "../../store/useAudioStore";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import WavesurferPlayer from "@wavesurfer/react";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioRecorder = () => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

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
        <div className="flex space-x-2 w-full h-full">
          <button
            onClick={onPlayPause}
            className="btn btn-primary text-primary-content rounded-full  p-1 outline-none w-12"
          >
            {isPlaying ? (
              <FaPause size={20} className="cursor-pointer" />
            ) : (
              <FaPlay size={20} className="cursor-pointer" />
            )}
          </button>
          <div className="w-[90%] sm:w-[50%] lg:w-[80%] overflow-x-scroll">
            <WavesurferPlayer
              waveColor={"black"}
              width={520}
              height={50}
              progressColor={"red"}
              url={audioUrl}
              onReady={onReady}
              barWidth={3}
              barGap={2}
              barRadius={10}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
          <button
            onClick={deleteRecording}
            className="btn btn-error text-error-content rounded-full  p-1 outline-none w-12"
          >
            <FaRegTrashAlt size={20} className="cursor-pointer" />
          </button>
          <button
            onClick={sendRecording}
            className="btn btn-primary text-primary-content rounded-full  p-1 outline-none w-12"
          >
            <IoSend className="cursor-pointer" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
