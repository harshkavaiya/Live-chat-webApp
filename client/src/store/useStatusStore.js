import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useAuthStore from "./useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

const useStatusStore = create((set, get) => ({
  status: [],
  isUploadingstatus: false,
  myStatus: [],
  friendStatus: [],
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
          seen: [],
        });
      }

      let res = await axiosInstance.post("/status/upload", {
        name: authUser.fullname,
        status: dataUrl,
        author: authUser._id,
      });
      if (res.data.success) {
        toast.success("Upload");
        set({ myStatus: [...myStatus, ...dataUrl] });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err);
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
    set({ friendStatus: res.data.find });
  },
  findUserStatus: async (id) => {
    let res = await axiosInstance.get(`/status/${id}`);

    if (res.data.success) {
      set({ myStatus: [...res.data.data.status] });
    }
  },
  handleUserStatus: async (data) => {
    const { name, status, id } = data;
    const { friendStatus } = get();

    let isNewStatus = false;
    if (friendStatus.length) {
      friendStatus.forEach((element, i) => {
        console.log(element.author, id,"83");
        if (element.author == id) {
          friendStatus[i].status.push(status);
          isNewStatus = true;
          return 0;
        }
      });
    }

    if (!isNewStatus) {
      friendStatus.push({ author: id, name, status });
    }
    set({ friendStatus });
  },
  currentRunningStatus: null,
  currentStatusIndex: null,
  currentUserRunningStatus: null,
  isStatusRunning: false,
  isProcess: 0,
  setCurrentUserRunningStatus: (currentUserRunningStatus) => {
    set({ currentUserRunningStatus });
  },
  setIsProcess: (isProcess) => {
    set({ isProcess });
  },
  setCurrentRunningStatus: (currentRunningStatus) => {
    set({ currentRunningStatus });
  },
  setCurrentStatusIndex: (currentStatusIndex) => {
    set({ currentStatusIndex });
  },
  onPrevious: () => {
    const {
      currentRunningStatus,
      currentStatusIndex,
      friendStatus,
      currentUserRunningStatus,
    } = get();
    set({ isProcess: 0 });

    if (currentRunningStatus[currentStatusIndex - 1]) {
      set({ currentStatusIndex: currentStatusIndex - 1 });
    } else {
      if (friendStatus[currentUserRunningStatus - 1]) {
        set({
          currentRunningStatus:
            friendStatus[currentUserRunningStatus - 1].status,
          currentStatusIndex:
            friendStatus[currentUserRunningStatus - 1].status.length - 1,
          currentUserRunningStatus: currentUserRunningStatus - 1,
        });
      } else {
        get().onCloseCurrentStatus();
      }
    }
  },
  onNext: () => {
    const {
      currentRunningStatus,
      currentStatusIndex,
      friendStatus,
      currentUserRunningStatus,
    } = get();

    set({ isProcess: 0 });
    if (currentRunningStatus[currentStatusIndex + 1]) {
      set({ currentStatusIndex: currentStatusIndex + 1 });
    } else {
      if (friendStatus[currentUserRunningStatus + 1]) {
        set({
          currentRunningStatus:
            friendStatus[currentUserRunningStatus + 1].status,
          currentStatusIndex: 0,
          currentUserRunningStatus: currentUserRunningStatus + 1,
        });
      } else {
        get().onCloseCurrentStatus();
      }
    }
  },
  onCloseCurrentStatus: () => {
    set({ currentRunningStatus: null, currentStatusIndex: null, isProcess: 0 });
  },
  hanldeSeenStatus: (data) => {
    const { index, newSeenUser } = data;
    const { myStatus } = get();
    if (myStatus.length) {
      myStatus[index].seen.push(newSeenUser);
      set({ myStatus });
    }
  },
}));

export default useStatusStore;
