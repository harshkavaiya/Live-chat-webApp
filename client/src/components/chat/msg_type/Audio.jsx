import WavesurferPlayer from "@wavesurfer/react";
import { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

const Audio = ({ message }) => {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={onPlayPause}
        className="btn btn-primary text-primary-content rounded-full outline-none w-12 h-10 p-0.5"
      >
        {isPlaying ? (
          <FaPause size={13} className="cursor-pointer" />
        ) : (
          <FaPlay size={13} className="cursor-pointer" />
        )}
      </button>
      <WavesurferPlayer
        waveColor={"inherit"}
        width={220}
        height={40}
        progressColor={"red"}
        url={`${import.meta.env.VITE_SERVER_HOST}/upload/audio/${
          message.data.name
        }`}
        onReady={onReady}
        barWidth={3}
        barGap={2}
        barRadius={10}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Audio;
