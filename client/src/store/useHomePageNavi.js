import { create } from "zustand";

const useHomePageNavi = create((set, get) => ({
  activePage: "chat",

  SetActivePage: (page) => {
    set({ activePage: page });
  },
}));

export default useHomePageNavi;
