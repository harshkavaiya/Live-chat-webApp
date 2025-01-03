import { create } from "zustand";
import { io } from "socket.io-client";
import axiosInstance from "../lib/axiosInstance";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isLogin: false,
  isCheckingAuth: true,
  socket: null,
  friends: [],
  group: [],
  favFriends: [],
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await axiosInstance.get("/auth/check");
      if (!res.data.success) {
        return set({ authUser: null });
      }
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login: async (data) => {
    if (get().authUser) return;
    let res = await axiosInstance.post("/auth/login", data);
    if (res.data.success) {
      toast.success("Login");

      set({ authUser: res.data });
      get().connectSocket();
    } else {
      toast.error(res.data.message);
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      get().diconnectSocket();
      toast.success("Logout");
    } catch (error) {
      toast.error(error.message);
    } finally {
      get().diconnectSocket();
    }
  },
  connectSocket: () => {
    if (get().socket?.connected) return;
    const socket = io("http://localhost:4000", {
      query: {
        userId: get().authUser?._id,
      },
    });
    socket.connect();
    socket.on("connect", (socket) => {
      console.log("Connected!");
    });

    set({ socket: socket });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();

    set({ socket: null });
  },
}));

export default useAuthStore;
