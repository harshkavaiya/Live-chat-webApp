import { create } from "zustand";
import  axiosInstance  from "../../lib/axiosInstance";
import { toast } from "react-hot-toast";

export const useUsersStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  fetchUsers: async () => {
    const res = await axiosInstance.get("/Admin/users");
    console.log(res.data.users);
    if (res.data.success) {
      set({ users: res.data.users });
    } else {
      toast.error(res.data.message);
    }
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
    const res = await axiosInstance.delete(`/Admin/users/${id}`);
    if (res.data.success) {
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
    } else {
      toast.error(res.data.message);
    }
  },
}));
