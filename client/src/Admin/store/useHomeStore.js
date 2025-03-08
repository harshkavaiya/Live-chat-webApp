import { create } from "zustand";

const useHomeStore = create((set, get) => ({
  currentTab: "Dashboard",
  setCurrentTab: (currentTab) => {
    set({ currentTab });
  },
}));

export default useHomeStore;
