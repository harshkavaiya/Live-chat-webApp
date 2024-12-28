import { create } from "zustand";
import useMessageStore from "./useMessageStore";
import axios from "axios";

const useFucationStore = create((set, get) => ({
  isLocationLoading: false,
  location: [],
  galleryData: [],
  isGalleryDataUpload: false,
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
  locationShare: (data) => {
    useMessageStore.getState().sendMessage({
      type: "location",
      data: { latitude: get().location[0], longitude: get().location[1] },
      receiver: data,
    });
    get().locationClose();
  },
  handelGalleryData: (e) => {
    console.log(get().galleryData);
    set({ galleryData: [...get().galleryData, ...e.target.files] });
  },
  sendGalleryData: async (data, receiver) => {
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
        receiver: receiver,
      });

      set({ isGalleryDataUpload: false, galleryData: [] });
    } catch (err) {
      set({ isGalleryDataUpload: true });
      console.log(err);
    }
  },
}));

export default useFucationStore;
