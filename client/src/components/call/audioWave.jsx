import React, { useEffect, useRef, useState } from "react";

const AudioWave = ({ startCall, onAudioActivity }) => {
  const mediaStreamRef = useRef(null); // To store the audio stream
  const audioContextRef = useRef(null); // To store AudioContext instance
  const analyserRef = useRef(null); // To store AnalyserNode

  useEffect(() => {
    if (startCall) {
      const startVoiceCall = async () => {
        try {
          // Capture audio from mic
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaStreamRef.current = stream;

          // Setup AudioContext and AnalyserNode
          const audioContext = new AudioContext();
          audioContextRef.current = audioContext;
          const mediaSource = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;

          mediaSource.connect(analyser);
          analyser.connect(audioContext.destination);
          analyserRef.current = analyser;

          // Detect audio activity
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const detectAudio = () => {
            analyser.getByteFrequencyData(dataArray);
            const isActive = dataArray.some((value) => value > 50); // Adjust threshold as needed
            onAudioActivity(isActive);
            requestAnimationFrame(detectAudio);
          };
          detectAudio();
        } catch (error) {
          console.error("Mic access error:", error);
        }
      };

      startVoiceCall();
    } else {
      // Cleanup mic stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      // Cleanup AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [startCall, onAudioActivity]);

  return <div style={{ display: "none" }} />; // Hidden, since it's for detecting audio activity
};

export default AudioWave;
