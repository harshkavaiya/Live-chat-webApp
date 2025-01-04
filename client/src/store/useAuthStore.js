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
        set({ authUser: null, isLogin: false });
        return;
      }

      set({ authUser: res.data.user, isLogin: true });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null, isLogin: false });
      get().diconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    if (get().authUser) return;
    let res = await axiosInstance.post("/auth/login", data);
    if (res.data.success) {
      toast.success("Login Success");
      set({ authUser: res.data, isLogin: true });
      get().connectSocket();
    } else {
      toast.error(res.data.message);
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      console.log(res);
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
