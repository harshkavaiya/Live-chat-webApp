import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";

const useContactList = create((set, get) => ({
  contacts: [],
  groups: [],
  isloading: false,
  isOpenDialog: false,
  isAddLoading: false,
  savedName: "",
  phone: "",
  setDialogOpen: (isOpen) => set({ isOpenDialog: isOpen }),
  // Set input fields
  setSavedData: (savedName, phone) => {
    set({ savedName, phone });
  },
  clearInputFields: () => {
    set({ savedName: "", phone: "" });
  },
  getGroupMessages: async () => {
    try {
      let res = await axiosInstance.get("/group/getGroup");
      if (!res.data.success) {
        toast.error(res.data.message);
        console.log("responce", res.data.message);
        return;
      }

      set({ groups: res.data.groups });
      return res.data.groups;
    } catch (error) {
      console.error("Error fetching messager users:", error);
      toast.error(error);
      return [];
    }
  },

  getContactsList: async () => {
    try {
      set({ isloading: true });
      const res = await axiosInstance.get("message/contactlist");

      const sortedContacts = [...res.data].sort((a, b) => {
        return b.fullname.toLowerCase().localeCompare(a.fullname.toLowerCase());
      });

      // Agar response empty hai toh contacts ko update nahi karna
      if (!res.data || res.data.length === 0) {
        return;
      }

      set({ contacts: sortedContacts });
    } catch (error) {
      console.log("Error in contact list:", error);
    } finally {
      set({ isloading: false });
    }
  },

  AddContact: async () => {
    const { savedName, phone, getContactsList, clearInputFields } = get();
    if (!savedName || !phone) {
      toast.error("Both fields are required");
      return;
    }
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

      toast.success(res.data.message, { id: "add" });
      getContactsList(); // Refresh contact list
      clearInputFields(); // Reset fields
      document.getElementById("AddContactDialog").close();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add contact");
    } finally {
      set({ isAddLoading: false });
    }
  },

  deleteuserContact: async (contactId) => {
    try {
      const res = await axiosInstance.post("message/deletecontact", {
        contactId,
      });
      if (!res.data.success) {
        toast.error("Failed to delete contact");
      }
      // Update state by removing the deleted contact directly
      const updatedContacts = get().contacts.filter(
        (contact) => contact._id !== contactId
      );
      set({ contacts: updatedContacts });
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete contact");
    }
  },
}));

export default useContactList;
