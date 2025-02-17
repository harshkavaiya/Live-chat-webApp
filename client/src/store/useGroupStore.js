import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import useMessageStore from "./useMessageStore";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";

const useGroupStore = create((set, get) => ({
  joinGroup: () => {},
  addMember: async (groupId, newMemberId) => {
    const { currentChatingUser, setCurrentChatingUser } =
      useMessageStore.getState();
    const { authUser } = useAuthStore.getState();
    let res = await axiosInstance.post("/group/addMember", {
      groupId,
      newMemberId,
      myId: authUser._id,
    });
    if (res.data.success) {
      currentChatingUser?.members?.push(...newMemberId);
      setCurrentChatingUser(currentChatingUser);
    } else {
      toast.error(res.data.message);
    }
  },
  assignAdmin: async (groupId, newAdminId) => {
    const { currentChatingUser, setCurrentChatingUser } =
      useMessageStore.getState();
    let res = await axiosInstance.post("/group/assignAdmin", {
      groupId,
      newAdminId,
    });

    if (res.data.success) {
      currentChatingUser?.admins?.push(newAdminId);
      setCurrentChatingUser(currentChatingUser);
    } else {
      toast.error(res.data.message);
    }
  },
  deleteGroup: () => {},
  removeMember: async (groupId, memberId) => {
    const { currentChatingUser, setCurrentChatingUser } =
      useMessageStore.getState();
    let res = await axiosInstance.post("/group/removeMember", {
      groupId,
      memberId,
    });

    if (res.data.success) {
      currentChatingUser.admins = currentChatingUser.admins.filter(
        (user) => user != memberId
      );

      currentChatingUser.members = currentChatingUser.members.filter(
        (user) => user._id != memberId
      );
      setCurrentChatingUser(currentChatingUser);
    } else {
      toast.error(res.data.message);
    }
  },
  leaveGroup: async (groupId) => {
    const { authUser } = useAuthStore.getState();
    const { currentChatingUser, setCurrentChatingUser } =
      useMessageStore.getState();
    let res = await axiosInstance.post(`/group/leave`, { groupId });

    if (res.data.success) {
      currentChatingUser.admins = currentChatingUser?.admins?.filter(
        (user) => user != authUser._id
      );

      currentChatingUser.members = currentChatingUser?.members?.filter(
        (user) => user._id != authUser._id
      );
      setCurrentChatingUser(currentChatingUser);
    } else {
      toast.error(res.data.message);
    }
  },
  handleNewGroup: async (data) => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();
    const index = messagerUser.findIndex((user) => user._id === data._id);

    if (index === -1) {
      messagerUser.unshift(data); // Add to the beginning if not found
    } else {
      messagerUser[index] = data; // Update existing user
    }
    if (currentChatingUser?._id == data._id) {
      setCurrentChatingUser(data);
    }

    setMessagerUser(messagerUser);
  },
  handleNewMember: (newMember, id) => {
    const { messagerUser, setMessagerUser } = useMessageStore.getState();
    messagerUser.forEach((element) => {
      if (element._id == id) {
        element.members.push(...newMember);
      }
    });

    setMessagerUser(messagerUser);
  },
  handleNewAdmin: (id, user) => {
    const { messagerUser, setMessagerUser } = useMessageStore.getState();
    messagerUser.forEach((element) => {
      if (element._id == id) {
        element.admins.push(user);
      }
    });

    setMessagerUser(messagerUser);
  },
  handleremoveMember: (id, memberId) => {
    const { messagerUser, setMessagerUser } = useMessageStore.getState();

    messagerUser.forEach((element) => {
      if (element._id == id) {
        if (element.admins.includes(memberId)) {
          element.admins = element.admins.filter((user) => user != memberId);
        }
        element.members = element.members.filter(
          (user) => user._id != memberId
        );
      }
    });

    setMessagerUser(messagerUser);
  },
  handleLeaveGroup: (user, groupId) => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();

    messagerUser.forEach((element) => {
      if (element._id == groupId) {
        if (element.admins.includes(user)) {
          element.admins = element.admins.filter((item) => item != user);
        }
        if (element.admin == user) {
          element.admin = element.admins[0];
        }

        element.members = element.members.filter((item) => item._id != user);
      }
    });

    if (currentChatingUser) {
      if (currentChatingUser.admins.includes(user)) {
        currentChatingUser.admins = currentChatingUser.admins.filter(
          (item) => item != user
        );
      }
      if (currentChatingUser.admin == user) {
        currentChatingUser.admin = currentChatingUser.admins[0];
      }

      currentChatingUser.members = currentChatingUser.members.filter(
        (item) => item._id != user
      );
    }
    setMessagerUser(messagerUser);
    setCurrentChatingUser(currentChatingUser);
  },
}));

export default useGroupStore;
