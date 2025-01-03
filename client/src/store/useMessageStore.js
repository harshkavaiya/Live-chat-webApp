import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import useMediaStore from "./useMediaStore";

const useMessageStore = create((set, get) => ({
  messages: [],
  messagerUser: [],
  isMessageLoading: false,
  currentChatingUser: false,
  sendMessage: async (data) => {
    let res = await axiosInstance.post(
      `/message/send/${get().currentChatingUser}`,
      data
    );
    toast.success("Message Send");
    set({ messages: [...get().messages, res.data] });
  },
  getMessage: async () => {
    set({ isMessageLoading: true });
    let res = await axiosInstance.get(
      `/message/chat/${get().currentChatingUser}`
    );
    set({ messages: [...res.data], isMessageLoading: false });
    useMediaStore.getState().fetchChatUserMedia(get().messages);
  },
  selectUsertoChat: (data) => {
    set({ currentChatingUser: data });
  },
  closeChat: () => {
    set({ currentChatingUser: false });
  },
  getMessagerUser: async () => {
    try {
      let res = await axiosInstance.get("/message/user");

      if (!res.data) {
        return set({ messagerUser: [] });
      }
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
}));

export default useMessageStore;
