import { create } from "zustand";

const useFucationStore = create((set, get) => ({
  isLocationLoading: false,
  location: [],
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
    sendMessage({
      type: "location",
      data: { latitude: location[0], longitude: location[1] },
      receiver,
    });
  },
}));

export default useFucationStore;
