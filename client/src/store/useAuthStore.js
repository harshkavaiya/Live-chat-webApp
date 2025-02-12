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
  onlineUsers: [],
  loadAuthFromStorage: () => {
    const storedUser = sessionStorage.getItem("authUser");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Loaded user from session storage:", parsedUser);
      set({ authUser: parsedUser, isLogin: true }); // Set user from session storage
      get().connectSocket(); // Initialize socket
    } else {
      console.log("No user found in session storage.");
      set({ authUser: null, isLogin: false }); // Clear state if no user in session
    }
  },

  FetchOnlineUsers: () => {
    const { socket, authUser } = get();

    if (socket && authUser) {
      socket.on("onlineUsers", (onlineUsersList) => {
        const filteredUsers = onlineUsersList.filter(
          (userId) => userId !== authUser._id
        );
        set({ onlineUsers: filteredUsers });
      });

      return () => {
        socket.off("onlineUsers");
      };
    }
  },

  // checkAuth: async () => {
  //   try {
  //     set({ isCheckingAuth: true });
  //     if (get().authUser) return; // if already logged in

  //     const res = await axiosInstance.get("/auth/check");
  //     if (!res.data.success) {
  //       set({ authUser: null, isLogin: false });
  //       console.log("User in checkAuth not ", res.data);
  //       // sessionStorage.removeItem("authUser");
  //       return;
  //     }

  //     console.log("User in checkAuth", res.data.user);
  //     set({ authUser: res.data.user, isLogin: true });
  //     // sessionStorage.setItem("authUser", JSON.stringify(res.data.user));
  //     get().connectSocket();
  //   } catch (error) {
  //     console.error("Error in checkAuth:", error);
  //     set({ authUser: null, isLogin: false });
  //     get().diconnectSocket();
  //     sessionStorage.removeItem("authUser");
  //   } finally {
  //     set({ isCheckingAuth: false });
  //   }
  // },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      // if (get().authUser) return; // Skip if already logged in

      const res = await axiosInstance.get("/auth/check");
      if (res.data.success) {
        const user = res.data.user;
        set({ authUser: user, isLogin: true, friends: user?.contacts });
        sessionStorage.setItem("authUser", JSON.stringify(user));
        console.log("User authenticated:", user);
        get().connectSocket(); // Connect socket
      } else {
        set({ authUser: null, isLogin: false, friends: [] });
        sessionStorage.removeItem("authUser");
      }
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null, isLogin: false, friends: [] });
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
    const socket = io("https://1szcr99d-4000.inc1.devtunnels.ms", {
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
