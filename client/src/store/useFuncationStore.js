import { create } from "zustand";
import useMessageStore from "./useMessageStore";
import axios from "axios";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";
import useAuthStore from "./useAuthStore";
import { decryptData, generateUniqueId } from "../../../server/src/lib/crypto";
import axiosInstance from "../lib/axiosInstance";

const useFunctionStore = create((set, get) => ({
  isLocationLoading: false,
  location: [],
  galleryData: [],
  isGalleryDataUpload: false,
  selectMessage: {},
  isSelectMessage: false,
  isMessageShare: false,
  isSelectContact: false,
  selectContact: {},
  isDeletingMessage: false,

  getLocation: async () => {
    set({ isLocationLoading: true });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set({ isLocationLoading: false, location: [latitude, longitude] });
        },
        (e) => {
          toast.error("Not get Location");
        }
      );
    } else {
      set({ isLocationLoading: false });
      return 0;
    }
  },
  locationClose: () => {
    set({ location: [] });
  },
  locationShare: () => {
    const { profilePic, fullname } = useAuthStore.getState().authUser;
    const { sendMessage, currentChatingUser } = useMessageStore.getState();

    sendMessage(
      currentChatingUser,
      {
        type: "location",
        data: { latitude: get().location[0], longitude: get().location[1] },
      },
      {
        profilePic,
        fullname,
      }
    );
    get().locationClose();
  },
  handelGalleryData: (e) => {
    set({ galleryData: [...get().galleryData, ...e.target.files] });
  },
  sendGalleryData: async (data) => {
    let dataUrl = [];
    try {
      set({ isGalleryDataUpload: true });
      for (let i = 0; i < data.length; i++) {
        let check = data[i].type.split("/")[0];
        let form = new FormData();

        form.append("file", data[i]);
        form.append("upload_preset", `Real-time-chat-${check}`);
        let res = await axios.post(
          `https://api.cloudinary.com/v1_1/dr9twts2b/${check}/upload`,
          form
        );
        dataUrl.push({ url: res.data.secure_url, type: check, read: false });
      }

      const { profilePic, fullname } = useAuthStore.getState().authUser;
      const { sendMessage, currentChatingUser } = useMessageStore.getState();
      sendMessage(
        currentChatingUser,
        {
          type: data.length <= 1 ? data[0].type.split("/")[0] : "multiple-file",
          data: dataUrl,
        },

        { profilePic, fullname }
      );

      set({ isGalleryDataUpload: false, galleryData: [] });
    } catch (err) {
      set({ isGalleryDataUpload: true });
      console.log(err);
    }
  },
  closeGalleryData: () => {
    set({ galleryData: [] });
  },
  handleDeleteGalleryImage: (data) => {
    const { galleryData } = get();

    galleryData.splice(data, 1);
    set({ galleryData: galleryData });
  },
  onSelectionMessage: (data) => {
    const { selectMessage } = get();
    if (selectMessage[data._id]) {
      delete selectMessage[data._id];
    } else {
      selectMessage[data._id] = data;
    }

    set({ selectMessage });
  },
  handleSelection: (isSelectMessage) => {
    if (!isSelectMessage) {
      set({ selectMessage: {} });
    }
    set({ isSelectMessage });
  },
  onSelectContact: async () => {
    if ("contacts" in navigator) {
      const supportedProperties = await navigator.contacts.getProperties();
      console.log(supportedProperties);
    } else {
      console.log("Not Select");
      toast.error("Not Select Contact in this Devices");
    }
  },
  handleSelectMessage: (isMessageShare) => {
    set({ isSelectMessage: false });
    set({ isMessageShare });
  },
  sendSelectionMessage: (receiver) => {
    const { selectMessage } = get();
    const { profilePic, fullname } = useAuthStore.getState().authUser;

    receiver.forEach((user) => {
      Object.keys(selectMessage).forEach((element) => {
        const secretKey = generateUniqueId(
          selectMessage[element].sender,
          selectMessage[element].receiver
        );
        const data = decryptData(selectMessage[element].data, secretKey);
        useMessageStore.getState().sendMessage(
          user,
          {
            type: selectMessage[element].type,
            data: data,
          },
          {
            profilePic,
            fullname,
          }
        );
      });
    });

    set({ isMessageShare: false, selectMessage: [] });
  },
  setSelectMessage: (selectMessage) => {
    set({ selectMessage });
  },
  generateUniqueId: (senderId, receiverId) => {
    const sortedIds = [senderId, receiverId].sort().join("_");
    return CryptoJS.SHA256(sortedIds).toString(CryptoJS.enc.Hex);
  },
  decryptData: (ciphertext, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  },
  deleteSelectedMessage: async (queryClient) => {
    const { selectMessage } = get();
    const { currentChatingUser, messagerUser, setMessagerUser } =
      useMessageStore.getState();

    try {
      set({ isDeletingMessage: true });
      let res = await axiosInstance.delete(`/message/deleteMessage`, {
        data: { messageId: Object.keys(selectMessage) },
      });

      if (res.data.success) {
        toast.success("Message Deleted Successfully");

        queryClient.setQueryData(
          [`chat-${currentChatingUser._id}`],
          (oldData) => {
            if (!oldData || !oldData.pages?.length) return { pages: [] }; // Ensure valid oldData

            // Remove selected messages from all pages
            const updatedPages = oldData.pages.map((page) =>
              page.filter((message) => !selectMessage?.[message._id])
            );

            // Check if the last message was deleted, ensure proper updates
            if (
              updatedPages.length > 0 &&
              updatedPages[updatedPages.length - 1].length === 0
            ) {
              updatedPages.pop(); // Remove empty last page if needed
            }

            return { ...oldData, pages: updatedPages };
          }
        );

        const chatData = queryClient.getQueryData([
          `chat-${currentChatingUser._id}`,
        ]);

        messagerUser.forEach((user) => {
          if (chatData?.pages?.length) {
            const lastPage = chatData.pages[chatData.pages.length - 1]; // Get the last page
            const lastMessage = lastPage.length
              ? lastPage[lastPage.length - 1]
              : null; // Get the last message
            if (user._id === currentChatingUser._id) {
              if (lastMessage) {
                const { type, data, createdAt } = lastMessage;
                user.lastMessage = type == "text" ? data : type || null;
                user.lastMessageTime = createdAt || null;
                user.lastMessageType = type || null;
              }
            }
          } else {
            user.lastMessage = null;
            user.lastMessageTime = null;
            user.lastMessageType = null;
          }
        });
        setMessagerUser(messagerUser);
      } else {
        toast.error("Message Not Deleted");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("An error occurred while deleting the message.");
    } finally {
      set({ isDeletingMessage: false });
    }

    // Close the confirmation modal and reset selected messages
    document.getElementById("message_deleteConfirm")?.close();
    set({ selectMessage: {}, isSelectMessage: false });
  },
}));

export default useFunctionStore;
