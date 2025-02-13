import { create } from "zustand";
import useMessageStore from "./useMessageStore";
import axios from "axios";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

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
  locationShare: (queryClient) => {
    const { sendMessage, currentChatingUser } = useMessageStore.getState();
    sendMessage(
      {
        type: "location",
        data: { latitude: get().location[0], longitude: get().location[1] },
      },
      currentChatingUser,
      queryClient
    );
    get().locationClose();
  },
  handelGalleryData: (e) => {
    set({ galleryData: [...get().galleryData, ...e.target.files] });
  },
  sendGalleryData: async (data, queryClient) => {
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
      const { sendMessage, currentChatingUser } = useMessageStore.getState();
      sendMessage(
        {
          type: data.length <= 1 ? data[0].type.split("/")[0] : "multiple-file",
          data: dataUrl,
        },

        currentChatingUser,
        queryClient
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

    set({ selectMessage: selectMessage });
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
  sendSelectionMessage: (receiver, queryClient) => {
    const { selectMessage } = get();
    receiver.forEach((user) => {
      Object.keys(selectMessage).forEach((element) => {
        useMessageStore.getState().sendMessage(
          {
            type: selectMessage[element].type,
            data: selectMessage[element].data,
          },
          user,
          queryClient
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
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  },
}));

export default useFunctionStore;
