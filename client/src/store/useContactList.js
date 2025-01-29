import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";

const useContactList = create((set, get) => ({
  contacts: [],
  isloading: false,
  isOpenDialog: false,
  isAddLoading: false,

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
  AddContact: async (savedName, phone) => {
    try {
      set({ isAddLoading: true });
      const res = await axiosInstance.post("message/newcontact", {
        phone,
        savedName,
      });
      if (!res.data.success) {
        toast.error(res.data.message, { id: "message" });
        return;
      }
      toast.success(res.data.message);
      document.getElementById("AddContactDialog").close();
      // After adding the new contact, sort the contacts
      set((state) => {
        const updatedContacts = [...state.contacts, { savedName, phone }];

        // Sort the contacts by savedName
        const sortedContacts = updatedContacts.sort((a, b) => {
          return a.savedName
            .toLowerCase()
            .localeCompare(b.savedName.toLowerCase());
        });

        return { contacts: sortedContacts };
      });
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      set({ isAddLoading: false });
    }
  },
}));

export default useContactList;
