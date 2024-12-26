import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useMessageStore = create((set, get) => ({
  messages: [],
  isMessageLoading: false,
  sendMessage: async (data) => {
    let res = await axiosInstance.post(`/message/send/${data.receiver}`, data);
    toast.success("Message Send");
    set({ messages: [...get().messages, res.data] });
  },
  getMessage: async (data) => {
    let res = await axiosInstance.get(`/message/chat/${data}`);
    set({ messages: [...res.data] });
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
}));

export default useMessageStore;
