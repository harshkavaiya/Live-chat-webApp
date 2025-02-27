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
} from "../function/crypto";

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
  sendMessage: async (receiver, data, notification) => {
    const { messagerUser, notificationSound, messages } = get();

    const { _id } = useAuthStore.getState().authUser;
    let res = await axiosInstance.post(`/message/send/${receiver._id}`, {
      data,
      notification,
      type: receiver.type || "Single",
      members:
        receiver?.members?.filter(
          (item) => item._id.toString() !== _id.toString()
        ) || [],
    });
    notificationSound();
    set({ messages: [...messages, res.data] });
    let isExits = messagerUser.some((user) => user._id == receiver._id);

    let updateData = messagerUser;
    if (!isExits) {
      updateData = [receiver, ...updateData];
    }
    updateData.forEach((user) => {
      if (user._id == receiver._id) {
        user.lastMessage = data.type == "text" ? res.data.data : data.type;
        user.lastMessageType = data.type;
        user.sender = _id;
        user.receiver = receiver._id;
        user.lastMessageTime = new Date();
      }
    });
    set({ messagerUser: updateData });
  },
  handleNewMessage: async (data, queryClient) => {
    const { newMessage, name, profilePic, ChatType } = data;

    const { type, data: message, sender } = newMessage;
    const { _id: myId } = useAuthStore.getState().authUser;
    const { currentChatingUser, notificationSound, messagerUser } = get();

    let isExits = messagerUser.some(
      (user) =>
        user._id ==
        (ChatType == "Group"
          ? newMessage.receiver
          : sender == myId
          ? newMessage.receiver
          : sender)
    );

    let updateData = messagerUser;
    if (!isExits) {
      if (
        currentChatingUser._id == newMessage.receiver &&
        ChatType == "Single"
      ) {
        updateData = [currentChatingUser, ...updateData];
      } else {
        let fetchUser = await axiosInstance.get(`/auth/user/${sender}`);
        if (!fetchUser.data.success) return;
        const { phone, email, fullname } = fetchUser.data.user;
        updateData = [
          {
            _id: sender,
            phone: phone,
            email: email,
            fullname: fullname,
            profilePic: profilePic,
            savedName: fullname,
            sender: sender,
            receiver: newMessage.receiver,
            type: "Single",
            lastMessage: null,
            lastMessageTime: null,
            lastMessageType: null,
          },
          ...updateData,
        ];
      }
    }

    updateData.forEach((user) => {
      let id =
        ChatType == "Group"
          ? newMessage.receiver
          : sender == myId
          ? newMessage.receiver
          : sender;
      if (user._id == id) {
        user.lastMessage =
          newMessage.type == "text" ? newMessage.data : newMessage.type;
        user.sender = sender;
        user.receiver = newMessage.receiver;
        user.lastMessageType = newMessage.type;
        user.lastMessageTime = new Date();
      }
    });
    set({ messagerUser: updateData });

    const qdata = queryClient.getQueryData([
      `chat-${
        ChatType == "Group"
          ? newMessage.receiver
          : sender == myId
          ? newMessage.receiver
          : sender
      }`,
    ]);
    if (qdata) {
      queryClient.setQueryData(
        [
          `chat-${
            ChatType == "Group"
              ? newMessage.receiver
              : newMessage.sender == myId
              ? newMessage.receiver
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
    }
    if (myId == sender) return;

    let dData = message;
    if (type == "text") {
      const secretkey = generateUniqueId(
        newMessage.sender,
        newMessage.receiver
      );
      dData = decryptData(message, secretkey);
    }

    updateData.forEach((user) => {
      let id =
        ChatType == "Group"
          ? newMessage.receiver
          : sender == myId
          ? newMessage.receiver
          : sender;
      if (user._id == id) {
        user.unseen = user.unseen ? user.unseen + 1 : 1;
      }
    });

    set({ messagerUser: updateData });
    if (
      (ChatType == "Group" && currentChatingUser?._id == newMessage.receiver) ||
      (ChatType == "Single" && currentChatingUser?._id == sender)
    )
      return;

    notificationSound();
    NotificationToast(dData, type, name, profilePic);
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
    const { currentChatingUser, messagerUser } = get();

    await axiosInstance.delete(
      `/message/clearChat/${currentChatingUser._id}?type=${currentChatingUser.type}`
    );
    queryClient.setQueryData([`chat-${currentChatingUser._id}`], { pages: [] });

    messagerUser.forEach((user) => {
      if (user._id == currentChatingUser._id) {
        user.lastMessage = null;
        user.lastMessageType = null;
      }
    });

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

      if (msg.type === "text" || msg.type === "link") {
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
  suscribeToMessage: () => {
    const { socket, authUser } = useAuthStore.getState();
    const { currentChatingUser, notificationSound, messagerUser } = get();
    if (!socket) return;

    messagerUser.forEach((user) => {
      if (user._id == currentChatingUser._id) {
        if (user.unseen) {
          socket.emit(
            "messagesRead",
            currentChatingUser.type,
            user.sender,
            useAuthStore.getState().authUser._id,
            currentChatingUser._id
          );
          user.unseen = 0;
        }
      }
    });

    socket.on("newMessage", (data) => {
      const { newMessage } = data;

      if (
        currentChatingUser.type == "Group" &&
        currentChatingUser._id != newMessage.receiver
      )
        return;
      if (
        currentChatingUser.type == "Single" &&
        currentChatingUser._id != newMessage.sender
      )
        return;

      if (authUser._id == newMessage.sender) return;

      socket.emit(
        "messagesRead",
        currentChatingUser.type,
        newMessage.sender,
        authUser._id,
        currentChatingUser._id
      );

      notificationSound();
    });
  },
  unsuscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
  SendMessageReaction: async (reaction, index, queryClient) => {
    const { messages, currentChatingUser, notificationSound } = get();
    const { _id } = useAuthStore.getState().authUser;

    // Clone the message to avoid direct mutation
    const updatedMessage = { ...messages[index] };

    // Clone the reactions array to ensure immutability
    const updatedReactions = updatedMessage.reaction.map((item) =>
      item.user.toString() === _id.toString()
        ? { id: reaction.id, label: reaction.label, user: _id } // Update existing reaction
        : item
    );

    // If no existing reaction was found, add a new one
    if (
      !updatedReactions.some((item) => item.user.toString() === _id.toString())
    ) {
      updatedReactions.push({
        id: reaction.id,
        label: reaction.label,
        user: _id,
      });
    }

    // Update the message with the new reactions array
    updatedMessage.reaction = updatedReactions;

    // Clone messages array and replace the updated message
    const updatedMessages = [...messages];
    updatedMessages[index] = updatedMessage;

    // Update Zustand store
    set({ messages: updatedMessages });

    await axiosInstance.post("/message/reaction", {
      id: messages[index]._id,
      userId: _id,
      reaction,
      to: messages[index].sender,
      ChatType: currentChatingUser.type,
      members:
        currentChatingUser?.members?.filter((item) => item._id != _id) || [],
    });

    queryClient.setQueryData([`chat-${currentChatingUser._id}`], (oldData) => {
      if (!oldData || !oldData.pages) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((msg) =>
            msg._id.toString() === messages[index]._id.toString()
              ? { ...msg, reaction: updatedMessage.reaction }
              : msg
          )
        ),
      };
    });

    notificationSound();
  },
  handleMessageReaction: async (id, reaction, queryClient) => {
    const { messages } = get();
    const { label, user } = reaction;

    let updatedRecords = []; // To store updated messages

    const updatedMessages = messages.map((msg) => {
      if (msg._id.toString() !== id.toString()) return msg;

      // Clone reactions array to avoid direct mutation
      const updatedReactions = msg.reaction.map((r) =>
        r.user.toString() === user.toString()
          ? { id: reaction.id, label, user }
          : r
      );

      // If no existing reaction was updated, add a new one
      if (
        !updatedReactions.some((r) => r.user.toString() === user.toString())
      ) {
        updatedReactions.push({ id: reaction.id, label, user });
      }

      const updatedMessage = { ...msg, reaction: updatedReactions };
      updatedRecords.push(updatedMessage); // Collect updated records

      return updatedMessage;
    });

    // Update Zustand store
    set({ messages: updatedMessages });

    // ✅ Fix the React Query cache update
    if (updatedRecords.length > 0) {
      queryClient.setQueryData(
        [`chat-${updatedRecords[0].receiver}`],
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((msg) =>
                msg._id.toString() === id.toString()
                  ? { ...msg, reaction: updatedRecords[0].reaction } // ✅ Corrected return
                  : msg
              )
            ),
          };
        }
      );
    }
  },
  sendVote: async (pollId, selectedOption, to, data, sender) => {
    const { currentChatingUser } = get();
    const { _id } = useAuthStore.getState().authUser;

    const { messages } = get();
    const secretkey = generateUniqueId(sender, to);

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
  handleMessageRead: (id, userToChatId, queryClient) => {
    const { currentChatingUser, messages } = get();

    if (currentChatingUser._id == userToChatId) {
      messages.map((msg) =>
        msg.sender !== id && !msg.read.some((item) => item.user === id)
          ? {
              ...msg,
              read: [...msg.read, { user: id, seenAt: new Date() }],
            }
          : msg
      );
      set({ messages });
    }
    queryClient.setQueryData([`chat-${userToChatId}`], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((msg) =>
            msg.sender !== id && !msg.read.some((item) => item.user === id)
              ? {
                  ...msg,
                  read: [...msg.read, { user: id, seenAt: new Date() }],
                }
              : msg
          )
        ),
      };
    });
  },
}));

export default useMessageStore;
