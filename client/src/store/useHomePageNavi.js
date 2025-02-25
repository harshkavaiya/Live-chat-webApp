import { create } from "zustand";

const useHomePageNavi = create((set, get) => ({
  activePage: "chat",

  SetActivePage: (activePage) => {
    set({ activePage });
  },
}));

export default useHomePageNavi;
