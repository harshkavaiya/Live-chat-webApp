import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useMessageStore = create((set, get) => ({
  messages: [],
  messagerUser: [],
  isMessageLoading: false,
  isGalleryDataUpload: false,
  sendMessage: async (data) => {
    let res = await axiosInstance.post(`/message/send/${data.receiver}`, data);
    toast.success("Message Send");
    set({ messages: [...get().messages, res.data] });
  },
  getMessage: async (data) => {
    set({ isMessageLoading: true });
    let res = await axiosInstance.get(`/message/chat/${data}`);
    set({ messages: [...res.data], isMessageLoading: false });
  },

  getMessagerUser: async () => {
    try {
      let res = await axiosInstance.get("/message/user");
      const sortedUsers = res.data.sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      set({ messagerUser: [...sortedUsers] });
    } catch (error) {
      console.error("Error fetching messager users:", error);
      toast.error(error);
    }
  },

  suscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newMessage", (data) => {
      set({ messages: [...get().messages, data] });
    });
  },
  unsuscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
  handelGalleryDataUpload: async (data) => {
    let dataUrl = [];
    try {
      set({ isGalleryDataUpload: true });
      for (let i = 0; i < data.length; i++) {
        let check = data[i].type.split("/")[0] === "image" ? "image" : "video";
        let form = new FormData();

        form.append("file", data[i]);
        form.append("upload_preset", `Real-time-chat-${check}`);
        let res = await axios.post(
          `https://api.cloudinary.com/v1_1/dr9twts2b/${check}/upload`,
          form
        );

        dataUrl.push(res.data.secure_url);
        set({ isGalleryDataUpload: false });
      }
    } catch (err) {
      set({ isGalleryDataUpload: true });
      console.log(err);
    }
  },
}));

export default useMessageStore;
