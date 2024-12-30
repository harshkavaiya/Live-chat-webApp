import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const audioWave = ({ audioStream }) => {
  const wavesurferRef = useRef(null);
  const [waveSurferInstance, setWaveSurferInstance] = useState(null);

  useEffect(() => {
    if (audioStream) {
      // Initialize wavesurfer instance
      const ws = WaveSurfer.create({
        container: wavesurferRef.current,
        waveColor: "blue",
        progressColor: "green",
        height: 100,
        barWidth: 2,
        cursorWidth: 1,
        cursorColor: "transparent",
        responsive: true,
      });

      // Set audio stream source to wavesurfer
      ws.loadDecodedBuffer(audioStream);
      setWaveSurferInstance(ws);
    }
  }, [audioStream]);

  return <div ref={wavesurferRef} id="waveform" />;
};

export default audioWave;
