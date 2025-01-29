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

      // Sorting by `savedName` in A-Z order
      const sortedContacts = [...res.data].sort((a, b) => {
        return a.savedName
          .toLowerCase()
          .localeCompare(b.savedName.toLowerCase());
      });

      set({ contacts: sortedContacts });
    } catch (error) {
      console.log("Error in contact list:", error);
    } finally {
      set({ isloading: false });
    }
  },
}));

export default useContactList;
