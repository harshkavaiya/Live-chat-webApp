import toast from "react-hot-toast";
import { create } from "zustand";
import useMessageStore from "./useMessageStore";
import axiosInstance from "../lib/axiosInstance";
import useAuthStore from "./useAuthStore";

const useAudioStore = create((set, get) => ({
  isRecording: false,
  audioUrl: null,
  stream: null,
  audioBlob: null,
  recordingDuration: 0,
  mediaRecorder: null,
  setRecordingDuration: (recordingDuration) => set({ recordingDuration }),
  setAudioUrl: (audioUrl) => set({ audioUrl }),
  setAudioBlob: (audioBlob) => set({ audioBlob }),
  resetAudio: () => set({ audioUrl: null, audioBlob: null }),
  startRecording: async (mediaRecorderRef) => {
    try {
      get().resetAudio();
      set({ isRecording: true });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      set({ stream });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        get().handleDataAvailable(e);
      };
      mediaRecorderRef.current.start();
      set({ mediaRecorder: mediaRecorderRef });
    } catch (error) {
      set({ recordingDuration: 0, isRecording: false });
      console.error("Error accessing microphone:", error);
      toast.error(error.message);
    }
  },
  stopRecording: () => {
    const { isRecording, stream, mediaRecorder } = get();
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      stream.getTracks().forEach((track) => track.stop());

      set({ recordingDuration: 0, isRecording: false });
    }
  },
  handleDataAvailable: (event) => {
    if (event.data.size > 0) {
      const blob = new Blob([event.data], { type: "audio/webm" });
      get().setAudioBlob(blob);
      get().setAudioUrl(URL.createObjectURL(blob));
    }
  },
  deleteRecording: () => {
    get().resetAudio();
    set({ recordingDuration: 0 });
  },
  sendRecording: async () => {
    const { audioBlob } = get();
    let date = new Date();
    let formData = new FormData();
    formData.append("name", date.getTime());
    formData.append("audio", audioBlob);
    const res = await axiosInstance.post(`/audio/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { profilePic, fullname } = useAuthStore.getState().authUser;
    const { currentChatingUser } = useMessageStore.getState();

    useMessageStore.getState().sendMessage(
      currentChatingUser,
      {
        type: "audio",
        data: {
          name: res.data.name,
          size: res.data.size,
        },
      },
      {
        profilePic,
        fullname,
      }
    );

    get().deleteRecording();
  },
  formatDuration: (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  },
}));

export default useAudioStore;
