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

  loadAuthFromStorage: () => {
    const storedUser = sessionStorage.getItem("authUser");

    if (storedUser != null) {
      set({ authUser: JSON.parse(storedUser), isLogin: true });
      get().connectSocket();
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      if (get().authUser) return;

      const res = await axiosInstance.get("/auth/check");
      if (!res.data.success) {
        set({ authUser: null, isLogin: false });
        // sessionStorage.removeItem("authUser");
        return;
      }

      set({ authUser: res.data.user, isLogin: true });
      // sessionStorage.setItem("authUser", JSON.stringify(res.data.user));
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null, isLogin: false });
      get().diconnectSocket();
      sessionStorage.removeItem("authUser");
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
      sessionStorage.setItem("authUser", JSON.stringify(res.data));
      get().connectSocket();
    } else {
      toast.error(res.data.message);
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");

      toast.success("Logout");
      set({ authUser: null, isLogin: false });
      sessionStorage.removeItem("authUser");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      get().disconnectSocket();
    }
  },
  connectSocket: () => {
    if (get().socket?.connected) return;
    const socket = io("http://localhost:4000", {
      query: {
        userId: get().authUser?._id,
      },
    });
    socket.on("connect", () => {
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
