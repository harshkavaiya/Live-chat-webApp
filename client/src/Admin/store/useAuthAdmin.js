import { create } from "zustand";
import axiosInstance from "../../lib/axiosInstance";
import toast from "react-hot-toast";

const useAuthAdmin = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: async (username, password) => {
    const res = await axiosInstance.post("/admin/login", {
      username,
      password,
    });
    console.log(res);
    if (res.data.success) {
      set({ user: res.data.user });
      toast.success("Success")
    } else {
      toast.error(res.data.message);
    }
  },
  logout: () => set({ user: null }),
}));

export default useAuthAdmin;
