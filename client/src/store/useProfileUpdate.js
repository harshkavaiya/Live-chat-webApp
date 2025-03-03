import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useProfileUpdate = create((set, get) => ({
  loading: false,

  updateProfile: async (userName, Email, About, base64Image) => {
    try {
      set({ loading: true });
      const updatedData = { userName, Email, About, base64Image };

      const data = await axiosInstance.put("/auth/update-profile", updatedData);

      if (!data.data.success) {
        toast.error(data.data.message);
        return;
      }
      toast.success("Update Success");
      useAuthStore.setState({ authUser: data.data.updatedUser });
    } catch (error) {
      toast.error("Error updating profile");
      set({ loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProfileUpdate;
