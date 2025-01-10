import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import useMediaStore from "./useMediaStore";

const useMessageStore = create((set, get) => ({
  messages: [],
  messagerUser: [],
  isLoading: true,
  isMessageLoading: false,
  currentChatingUser: false,
  setMessages: (messages) => {
    set({ messages });
    useMediaStore.getState().fetchChatUserMedia(get().messages);
  },
  sendMessage: async (data) => {
    let res = await axiosInstance.post(
      `/message/send/${get().currentChatingUser}`,
      data
    );
    set({ messages: [...get().messages, res.data] });
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
      set({ isLoading: true });
      if (!res.data.success) {
        return set({ messagerUser: [] });
      }

      const sortedUsers = res.data.usersWithLastMessage.sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      set({ messagerUser: [...sortedUsers] });
    } catch (error) {
      console.error("Error fetching messager users:", error);
      toast.error(error);
    } finally {
      set({ isLoading: false });
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
