import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import useMediaStore from "./useMediaStore";
import notification from "../assets/audio/notification.mp3";
import NotificationToast from "../components/NotificationToast";
import {
  decryptData,
  encryptData,
  generateUniqueId,
} from "../../../server/src/lib/crypto";

const useMessageStore = create((set, get) => ({
  messages: [],
  messagerUser: [],
  isLoading: true,
  isMessageLoading: false,
  currentChatingUser: false,
  setMessagerUser: (messagerUser) => {
    set({ messagerUser });
  },
  setCurrentChatingUser: (currentChatingUser) => {
    set({ currentChatingUser });
  },
  setMessages: (messages) => {
    set({ messages });
    useMediaStore.getState().fetchChatUserMedia(get().messages);
  },
  sendMessage: async (data, notification, queryClient) => {
    const { currentChatingUser, notificationSound } = get();
    const { _id } = useAuthStore.getState().authUser;
    let res = await axiosInstance.post(
      `/message/send/${currentChatingUser._id}`,
      {
        data,
        notification,
        type: currentChatingUser.type,
        members:
          currentChatingUser?.members?.filter((item) => item._id != _id) || [],
      }
    );
    notificationSound();

    queryClient.setQueryData([`chat-${currentChatingUser._id}`], (oldData) => {
      if (!oldData) return { pages: [[res.data]] };
      return {
        ...oldData,
        pages: [[res.data, ...oldData.pages[0]], ...oldData.pages.slice(1)],
      };
    });
  },
  selectUsertoChat: (data) => {
    const { currentChatingUser } = get();
    if (data._id == currentChatingUser?._id) return;
    set({ messages: [] });
    set({ currentChatingUser: data });
  },
  closeChat: () => {
    set({ currentChatingUser: false });
  },
  clearChat: async (queryClient) => {
    const { currentChatingUser } = get();

    await axiosInstance.delete(
      `/message/clearChat/${currentChatingUser._id}?type=${currentChatingUser.type}`
    );
    queryClient.setQueryData([`chat-${currentChatingUser._id}`], { pages: [] });

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
      set({ messagerUser: res.data.usersWithLastMessage });
    } catch (error) {
      console.error("Error fetching messager users:", error);
      toast.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  suscribeToMessage: (queryClient) => {
    const socket = useAuthStore.getState().socket;
    const { currentChatingUser, notificationSound } = get();
    if (!socket) return;
    socket.on("newMessage", (data) => {
      const { newMessage } = data;
      socket.emit(
        "messagesRead",
        newMessage.sender,
        useAuthStore.getState().authUser._id
      );
      queryClient.setQueryData(
        [
          `chat-${
            currentChatingUser.type == "Group"
              ? currentChatingUser._id
              : newMessage.sender
          }`,
        ],
        (oldData) => {
          if (!oldData) return { pages: [[newMessage]] };
          return {
            ...oldData,
            pages: [
              [newMessage, ...oldData.pages[0]],
              ...oldData.pages.slice(1),
            ],
          };
        }
      );
      notificationSound();
      set({ messages: [...get().messages, newMessage] });
    });
  },
  handleNewMessage: (data, queryClient) => {
    const { newMessage, name, profilePic, ChatType } = data;
    const { type, data: message, sender } = newMessage;
    const { currentChatingUser, notificationSound } = get();
    if (currentChatingUser?._id == sender) return;
    if (ChatType == "Group" && currentChatingUser?._id == newMessage.receiver)
      return;
    const qdata = queryClient.getQueryData([
      `chat-${ChatType == "Group" ? newMessage.receiver : sender}`,
    ]);
    if (qdata) {
      queryClient.setQueryData(
        [
          `chat-${
            ChatType == "Group" ? newMessage.receiver : newMessage.sender
          }`,
        ],
        (oldData) => {
          if (!oldData) return { pages: [[newMessage]] };
          return {
            ...oldData,
            pages: [
              [newMessage, ...oldData.pages[0]],
              ...oldData.pages.slice(1),
            ],
          };
        }
      );
    }
    notificationSound();

    let dData = message;
    if (type == "text") {
      const secretkey = generateUniqueId(
        newMessage.sender,
        newMessage.receiver
      );
      dData = decryptData(message, secretkey);
    }

    NotificationToast(dData, type, name, profilePic);
  },
  unsuscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
  SendMessageReaction: async (reaction, index) => {
    const { messages, currentChatingUser, notificationSound } = get();
    const { _id } = useAuthStore.getState().authUser;

    await axiosInstance.post("/message/reaction", {
      id: messages[index]._id,
      userId: _id,
      reaction,
      to: messages[index].sender,
      ChatType: currentChatingUser.type,
      members:
        currentChatingUser?.members?.filter((item) => item._id != _id) || [],
    });
    const reactionItem = messages[index].reaction.find(
      (item) => item.user.toString() === _id.toString()
    );

    if (reactionItem) {
      reactionItem.id = reaction.id;
      reactionItem.label = reaction.label;
    } else {
      messages[index].reaction.push({
        id: reaction.id,
        label: reaction.label,
        user: _id,
      });
    }
    notificationSound();
    set({ messages: messages });
  },
  handleMessageReaction: async (id, reaction, queryClient) => {
    const { messages } = get();
    const { label, user, ChatType } = reaction;
    const data = messages.find((item) => item._id.toString() === id.toString());

    if (!data) return;

    const reactionItem = data.reaction.find(
      (item) => item.user.toString() === user.toString()
    );
    if (reactionItem) {
      reactionItem.id = reaction.id;
      reactionItem.label = label;
    } else {
      data.reaction.push({
        id: reaction.id,
        label,
        user,
      });
    }

    set({ messages });
    queryClient.setQueryData(
      [ChatType == "Group" ? data.receiver : data.sender],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) =>
              msg._id.toString() === id.toString()
                ? { ...msg, reaction: [...data.reaction] }
                : msg
            ),
          })),
        };
      }
    );
  },
  sendVote: async (pollId, selectedOption, to, data, sender) => {
    const { currentChatingUser } = get();
    const { _id } = useAuthStore.getState().authUser;

    const { messages } = get();
    const secretkey = generateUniqueId(to, sender);

    data.options[selectedOption].vote++;
    data.voted.push({ id: _id, ans: selectedOption });
    const encrypt = encryptData(data, secretkey);
    messages?.forEach((element) => {
      if (element._id == pollId) {
        element.data = encrypt;
      }
    });

    await axiosInstance.post(`/message/sendVote/${pollId}`, {
      pollId,
      to,
      data: encrypt,
      members:
        currentChatingUser?.members?.filter((item) => item._id != _id) || [],
    });

    set({ messages });
  },
  handleVote: (item) => {
    const { data, pollId } = item;

    const { messages } = get();
    messages?.forEach((element) => {
      if (element._id == pollId) {
        element.data = data;
      }
    });
    set({ messages });
  },
  notificationSound: async () => {
    try {
      const sound = new Audio(notification);
      await sound.play();
    } catch (error) {
      console.error("Playback failed:", error);
    }
  },
  handleMessageRead: (id) => {
    const { messages } = get();
    messages.forEach((element) => {
      if (!element.read.includes(id)) {
        element.read.push(id);
      }
    });
    set({ messages });
  },
}));

export default useMessageStore;
