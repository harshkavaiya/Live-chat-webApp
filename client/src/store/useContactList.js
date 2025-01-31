import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";

const useContactList = create((set, get) => ({
  contacts: [],
  isloading: true,
  isOpenDialog: false,

  setDialogOpen: (isOpen) => set({ isOpenDialog: isOpen }),

  getContactsList: async () => {
    try {
      set({ isloading: true });
      const res = await axiosInstance.get("message/contactlist");
      const sortedContacts = [...res.data].sort((a, b) => {
        return a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase());
      });
      console.log(sortedContacts)
      set({ contacts: sortedContacts });
    } catch (error) {
      console.log("error in contact List:", error);
    } finally {
      set({ isloading: false });
    }
  },
}));

export default useContactList;
