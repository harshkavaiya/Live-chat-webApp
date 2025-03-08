import { create } from "zustand";
import  axiosInstance  from "../../lib/axiosInstance";
import { toast } from "react-hot-toast";

const useGroupStore = create((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  currentSee:null,
  setCurrentSee:(currentSee)=>{
    set({currentSee})
  },
  fetchGroups: async () => {
    const res = await axiosInstance.get("/Admin/groups");
  
    if (res.data.success) {
      set({ groups: res.data.groups });
    } else {
      toast.error(res.data.message);
    }
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
    const res = await axiosInstance.delete(`/Admin/groups/${id}`);
    if (res.data.success) {
      set((state) => ({
        groups: state.groups.filter((u) => u.id !== id),
      }));
    } else {
      toast.error(res.data.message);
    }
  },
}));

export default useGroupStore