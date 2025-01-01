import { create } from "zustand";
import useMessageStore from "./useMessageStore";
import axios from "axios";
import toast from "react-hot-toast";

const useFunctionStore = create((set, get) => ({
  isLocationLoading: false,
  location: [],
  galleryData: [],
  isGalleryDataUpload: false,
  selectMessage: {},
  isSelectMessage: false,
  isSelectContact: false,
  selectContact: {},

  getLocation: async () => {
    set({ isLocationLoading: true });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        set({ isLocationLoading: false, location: [latitude, longitude] });
      });
    } else {
      set({ isLocationLoading: false });
      return 0;
    }
  },
  locationClose: () => {
    set({ location: [] });
  },
  locationShare: () => {
    useMessageStore.getState().sendMessage({
      type: "location",
      data: { latitude: get().location[0], longitude: get().location[1] },
      receiver: useMessageStore().getState().currentChatingUser,
    });
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
        dataUrl.push({ url: res.data.secure_url, type: check });
      }

      useMessageStore.getState().sendMessage({
        type: data.length <= 1 ? data[0].type.split("/")[0] : "multiple-file",
        data: dataUrl,
        receiver: get().currentChatingUser,
      });

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
  onSelectMessage: (data) => {
    const { selectMessage } = get();
    if (selectMessage[data._id]) {
      delete selectMessage[data._id];
    } else {
      selectMessage[data._id] = data;
    }

    set({ selectMessage: selectMessage });
  },
  openSelection: () => {
    set({ isSelectMessage: true });
  },
  handleSelectMessage: () => {},
  closeSelection: () => {
    set({ isSelectMessage: false, selectMessage: {} });
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
}));

export default useFunctionStore;
