import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useAuthStore from "./useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

const useStatusStore = create((set, get) => ({
  status: [],
  isUploadingstatus: false,
  myStatus: [],
  friendStatus: null,
  isStatusPageOpen: false,
  setIsStatusPageOpen: (isStatusPageOpen) => set({ isStatusPageOpen }),
  setStatus: (status) => set({ status }),
  uploadStatus: async () => {
    try {
      const { status, myStatus } = get();
      set({ isUploadingstatus: true });
      const { authUser } = useAuthStore.getState();
      const dataUrl = [];
      let date = new Date();
      for (let i = 0; i < status.length; i++) {
        let check = status[i].type.split("/")[0];
        let form = new FormData();

        form.append("file", status[i]);
        form.append("upload_preset", `Real-time-chat-${check}`);
        let res = await axios.post(
          `https://api.cloudinary.com/v1_1/dr9twts2b/${check}/upload`,
          form
        );
        dataUrl.push({
          url: res.data.secure_url,
          type: check,
          read: false,
          time: date.getTime(),
          seen: 0,
        });
      }

      let res = await axiosInstance.post("/status/upload", {
        name: authUser.fullname,
        status: dataUrl,
        author: authUser._id,
      });
      if (res.data.success) {
        toast.success("Upload");
        set({ myStatus: [...myStatus, ...status] });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ status: [], isUploadingstatus: false });
    }
  },
  deleteStatus: () => {},
  fetchFreindStatus: async (data) => {
    let ids = [];
    data.forEach((element) => {
      ids.push(element._id);
    });

    let res = await axiosInstance.post("/status/friendStatus", { data: ids });
    const { find } = res.data;
    let fndStatus = [];
    find.forEach((user) => {
      const { name, author } = user;
      let status = [];
      user.status.forEach((element) => {
        const { time, url, seen, type } = element;
        status.push({
          url,
          type,
          duration: 5000,
          seen,
          time,
          header: {
            heading: name,
            profileImage: "https://picsum.photos/100/100",
          },
        });
      });
      fndStatus.push({ author, status });
    });
    console.log(fndStatus);
    set({ friendStatus: fndStatus });
  },
  findUserStatus: async (id) => {
    let res = await axiosInstance.get(`/status/${id}`);

    if (res.data.success) {
      let status = [];
      const data = res.data.data;
      data.status.forEach((element) => {
        const { time, url, seen, type } = element;
        status.push({
          url,
          type,
          duration: 5000,
          seen,
          time,
          header: {
            heading: data.name,
            profileImage: "https://picsum.photos/100/100",
          },
        });
      });
      set({ myStatus: status });
      console.log(get().myStatus);
    }
  },
}));

export default useStatusStore;
