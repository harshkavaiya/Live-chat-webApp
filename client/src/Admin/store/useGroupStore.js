import { create } from "zustand";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-hot-toast";
import { findThisMonthData } from "../function/function";

const useGroupStore = create((set) => ({
  groups: [],
  isLoading: false,
  thisMonthGroup: 0,
  setGroups: (groups) => set({ groups }),
  currentSee: null,
  isDeleting: false,
  setCurrentSee: (currentSee) => {
    set({ currentSee });
  },
  fetchGroups: async () => {
    set({ isLoading: true });
    const res = await axiosInstance.get("/Admin/groups");

    if (res.data.success) {
      set({ groups: res.data.groups });
      let count = findThisMonthData(res.data.groups);
      set({ thisMonthGroup: count });
    } else {
      toast.error(res.data.message);
    }
    set({ isLoading: false });
  },
  SingleGrouprFetch: async (id) => {
    const res = await axiosInstance.get(`/Admin/groups/${id}`);
    if (res.data.success) {
      return res.data.group;
    } else {
      toast.error(res.data.message);
    }
  },
  deleteGroup: async (id) => {
    set({ isDeleting: true });
    const res = await axiosInstance.delete(`/admin/deleteGroup/${id}`);

    if (res.data.success) {
      set((state) => ({
        groups: state.groups.filter((u) => u._id !== id),
      }));
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
    set({ isDeleting: false });
  },
}));

export default useGroupStore;
