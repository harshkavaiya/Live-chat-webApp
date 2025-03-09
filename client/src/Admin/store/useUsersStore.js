import { create } from "zustand";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-hot-toast";
import { findThisMonthData } from "../function/function";

const useUsersStore = create((set) => ({
  users: [],
  thisMonthUser: 0,
  isDeleting: false,
  isLoading: false,
  setUsers: (users) => set({ users }),
  currentSee: null,
  setCurrentSee: (currentSee) => {
    set({ currentSee });
  },
  fetchUsers: async () => {
    set({ isLoading: true });
    const res = await axiosInstance.get("/Admin/users");
    if (res.data.success) {
      set({ users: res.data.users });
      let count = findThisMonthData(res.data.users);
      set({ thisMonthUser: count });
    } else {
      toast.error(res.data.message);
    }
    set({ isLoading: false });
  },
  SingleUserFetch: async (id) => {
    const res = await axiosInstance.get(`/Admin/users/${id}`);
    if (res.data.success) {
      return res.data.user;
    } else {
      toast.error(res.data.message);
    }
  },
  deleteUser: async (id) => {
    set({ isDeleting: true });
    const res = await axiosInstance.delete(`/admin/deleteUser/${id}`);
    if (res.data.success) {
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
      toast.success(res.data.message);
      document.getElementById("message_delete_Confirm").close();
    } else {
      toast.error(res.data.message);
    }
    set({ isDeleting: false });
  },
}));

export default useUsersStore;
