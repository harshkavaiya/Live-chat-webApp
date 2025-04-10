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
  removeAdmin: async (groupId, adminId) => {
    const { currentChatingUser, setCurrentChatingUser } =
      useMessageStore.getState();
    let res = await axiosInstance.post("/group/removeAdmin", {
      groupId,
      adminId,
    });

    if (res.data.success) {
      currentChatingUser.admins = currentChatingUser.admins.filter(
        (user) => user != adminId
      );
      setCurrentChatingUser(currentChatingUser);
    } else {
      toast.error(res.data.message);
    }
  },
  handleRemoveAdmin: (id, adminId) => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();
    messagerUser.forEach((element) => {
      if (element._id == id) {
        element.admins = element.admins.filter((user) => user != adminId);
      }
    });
    if (currentChatingUser._id == id) {
      currentChatingUser.admins = currentChatingUser.admins.filter(
        (user) => user != adminId
      );
      setCurrentChatingUser(currentChatingUser);
    }
    setMessagerUser(messagerUser);
  },
  deleteGroup: async () => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();

    let res = await axiosInstance.post(`/group/delete`, {
      groupId: currentChatingUser._id,
    });

    if (res.data.success) {
      if (currentChatingUser) {
        setCurrentChatingUser(false);
      }
      const filteredUsers = messagerUser.filter(
        (user) => user._id !== currentChatingUser._id
      );
      setMessagerUser(filteredUsers);
    } else {
      toast.error(res.data.message);
    }
  },
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
    console.log(data);
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
    console.log(newMember, id);
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
  hanldeDeleteGroup: (groupId) => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();

    if (currentChatingUser) {
      setCurrentChatingUser(false);
    }

    const filteredUsers = messagerUser.filter((user) => user._id !== groupId);
    setMessagerUser(filteredUsers);
  },
  RemoveGroupFromChat: (groupId) => {
    const { messagerUser, setMessagerUser, setCurrentChatingUser } =
      useMessageStore.getState();
    setCurrentChatingUser(false);

    const filteredUsers = messagerUser.filter((user) => user._id !== groupId);
    setMessagerUser(filteredUsers);
  },
  isResetLink: false,
  resetLink: async (groupId) => {
    const {
      messagerUser,
      setMessagerUser,
      currentChatingUser,
      setCurrentChatingUser,
    } = useMessageStore.getState();
    set({ isResetLink: true });
    let res = await axiosInstance.put(`/group/resetLink/${groupId}`);

    if (res.data.success) {
      toast.success("Reset the Group Link");
      currentChatingUser.inviteLink = res.data.newLink;

      const updateUser = messagerUser.map((user) => {
        if (user._id === groupId) {
          return { ...user, inviteLink: res.data.newLink }; // Return updated user object
        }
        return user; // Return unchanged user
      });

      setMessagerUser(updateUser);
      setCurrentChatingUser({ ...currentChatingUser }); // Ensure state updates properly
    } else {
      toast.error(res.data.message);
    }
    set({ isResetLink: false });
  },
  handleResetLink: (groupId, newLink) => {
    const { messagerUser, setMessagerUser } = useMessageStore.getState();

    const updateUser = messagerUser.map((user) => {
      if (user._id === groupId) {
        return { ...user, inviteLink: newLink }; // Return updated user object
      }
      return user; // Return unchanged user
    });

    setMessagerUser(updateUser);
  },
  handleUpdateGroupPic: (groupId, newPic) => {
    const { messagerUser, setMessagerUser } = useMessageStore.getState();

    const updateUser = messagerUser.map((user) => {
      if (user._id === groupId) {
        return { ...user, groupPic: newPic }; // Return updated user object
      }
      return user; // Return unchanged user
    });

    setMessagerUser(updateUser);
  },
}));

export default useGroupStore;
