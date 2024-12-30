import React, { useRef, useEffect } from "react";

const Visualizer = ({ audioStream }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with white background
      canvasCtx.fillStyle = "#FFFFFF";
      canvasCtx.fillRect(0, 0, width, height);

      const barWidth = 3;
      const gap = 2;
      const bars = Math.floor(width / (barWidth + gap));
      const step = Math.floor(bufferLength / bars);

      for (let i = 0; i < bars; i++) {
        const dataIndex = i * step;
        const value = dataArray[dataIndex];
        const percent = value / 255;
        const barHeight = height * percent * 0.8; // 80% of max height

        // Center the bars vertically
        const y = (height - barHeight) / 2;

        canvasCtx.fillStyle = "#00FF7F";
        canvasCtx.fillRect(i * (barWidth + gap), y, barWidth, barHeight);
      }
    };

    draw();

    return () => {
      source.disconnect();
      audioContext.close();
    };
  }, [audioStream]);

  return <canvas ref={canvasRef} height="20" className="w-full" />;
};

export default Visualizer;
