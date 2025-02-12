import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import useMediaStore from "./useMediaStore";
import notification from "../assets/audio/notification.mp3";

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
  sendMessage: async (data, receiver) => {
    let res = await axiosInstance.post(`/message/send/${receiver._id}`, {
      data,
      receiver,
    });
    get().notificationSound();
    set({ messages: [...get().messages, res.data] });
  },
  selectUsertoChat: (data) => {
    set({ currentChatingUser: data });
  },
  closeChat: () => {
    set({ currentChatingUser: false });
  },
  clearChat: async () => {
    const { currentChatingUser } = get();

    await axiosInstance.delete(`/message/clearChat/${currentChatingUser._id}`);
    set({ messages: [] });
  },
  handleExport: async () => {
    const { messages } = get();
    const formatMessage = (msg) => {
      const date = new Date(msg.createdAt);
      const formattedDate = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()} ${
        date.getHours() >= 12 ? "PM" : "AM"
      }`;

      // Handle different types of messages
      if (msg.type === "location") {
        const { latitude, longitude } = msg.data;
        return `${formattedDate} - ${msg.sender}: Location - Latitude: ${latitude}, Longitude: ${longitude}`;
      }

      if (msg.type === "poll") {
        const optionsText = msg.data.options
          .map((option) => `${option.text} (${option.vote} votes)`)
          .join(", ");
        return `${formattedDate} - ${msg.sender}: Poll - ${msg.data.pollTitle} | Options: ${optionsText}`;
      }

      if (msg.type === "image") {
        const imageUrl = msg.data[0].url;
        return `${formattedDate} - ${msg.sender}: [Image: ${imageUrl}]`;
      }

      if (msg.type === "text") {
        return `${formattedDate} - ${msg.sender}: ${msg.data}`;
      }
      if (msg.type === "multiple-file") {
        const filesList = msg.data
          .map((file) => `${file.type.toUpperCase()} - ${file.url}`)
          .join(", ");
        return `${formattedDate} - ${msg.sender}: Multiple files - ${filesList}`;
      }

      if (msg.type === "audio") {
        const { name, size } = msg.data;
        const formattedSize = `${(size / 1024).toFixed(2)} KB`; // Convert bytes to KB
        return `${formattedDate} - ${msg.sender}: Audio - ${name} (${formattedSize})`;
      }

      // Default for unknown types
      return "";
    };

    try {
      let fileContent = "";
      // Format each message and join with newline for text export
      fileContent = messages.map(formatMessage).join("\n");

      // Create a Blob for export
      const blob = new Blob([fileContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `chat_history.txt`; // Filename based on the format
      link.click(); // Trigger the download
    } catch (error) {
      console.error("Error exporting chat history:", error);
      alert("Failed to export chat history");
    }
  },
  getMessagerUser: async () => {
    try {
      let res = await axiosInstance.get("/message/user");
      set({ isLoading: true });
      if (!res.data.success) return set({ messagerUser: [] });
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
      const { newMessage } = data;
      get().notificationSound();
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsuscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
  SendMessageReaction: async (reaction, index) => {
    const { messages } = get();

    await axiosInstance.post("/message/reaction", {
      id: messages[index]._id,
      reaction,
      to: messages[index].sender,
    });
    messages[index].reaction = reaction;
    get().notificationSound();
    set({ messages });
  },
  handleMessageReaction: async (data) => {
    const { id, reaction } = data;
    const { messages } = get();
    messages.forEach((element) => {
      if (element._id == id) {
        element.reaction = reaction;
      }
    });
    get().notificationSound();
    set({ messages });
  },
  hanldeVote: (data) => {
    const { pollId, optionIndex, from } = data;

    const { messages } = get();
    messages?.forEach((element) => {
      if (element._id == pollId) {
        element.data.options[optionIndex].vote++;
        element.data.voted.push({ id: from, ans: optionIndex });
      }
    });
    set({ messages });
  },
  notificationSound: () => {
    const sound = new Audio(notification);
    sound.play();
  },
}));

export default useMessageStore;
