import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Group from "../models/group.model.js";
import Users from "../models/users.model.js";
import { getUserSocketId, io } from "../lib/socket-io.js";
export const createGroup = async (req, res) => {
  try {
    const { name, description, type, photo, members } = req.body;
    const admin = req.user._id;

    if (!name) {
      return res
        .status(200)
        .json({ success: false, message: "Group Name is required" });
    }

    const membersArray = JSON.parse(members || "[]");
    let cloudPic = null;
    if (photo) {
      cloudPic = await cloudinary.uploader.upload(photo);
    } else {
      cloudPic = {
        secure_url: "",
      };
    }

    const inviteLink =
      admin.toString().slice(0, 6) + Math.random().toString(36).slice(2, 10);

    const newGroup = new Group({
      name,
      description,
      photo: cloudPic.secure_url,
      admin,
      admins: [admin],
      members: [admin, ...membersArray],
      messagePermission: true,
      type,
      inviteLink,
    });

    await newGroup.save();
    let groupMember = await newGroup.populate(
      "members",
      "fullname profilePic _id"
    );

    const groupInfo = {
      _id: newGroup._id,
      fullname: name,
      profilePic: photo,
      members: groupMember.members,
      admins: [admin],
      admin,
      inviteLink,
      messagePermission: true,
      sender: null,
      receiver: newGroup._id,
      type: "Group",
      lastMessage: null,
      lastMessageType: null,
      lastMessageTime: new Date().toISOString(),
    };

    groupMember.members.map((user) => {
      if (user._id.toString() != admin.toString()) {
        let receiverId = getUserSocketId(user._id);
        if (receiverId) {
          io.to(receiverId).emit("newGroup", groupInfo);
        }
      }
    });

    res.status(200).json({ success: true, groupInfo });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already have a group with this name." });
    }
    console.log("Error in createGroup:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const inviteLink = req.params.invite;
    const memberId = req.user._id;

    const group = await Group.findOne({ inviteLink });
    //if group not found or invalid invite link
    if (!group) {
      return res.status(200).json({
        success: false,
        message: "Invalid invite link or group not found",
      });
    }

    //if user is already a member of the group
    if (group.members.includes(memberId)) {
      return res.status(200).json({
        success: 2,
        id: group._id,
        message: "You are already a member of this group",
      });
    }

    //add user to the group
    group.members.push(memberId);
    await group.save();

    const groupMember = await group.populate(
      "members",
      "fullname profilePic _id"
    );

    const userContacts = await Users.findById(memberId).select("contacts");

    for (const member of groupMember.members) {
      if (member._id != memberId) {
        let { name, profilePic } = req.body;
        let receiverId = getUserSocketId(member._id);

        let findUser = await Users.findById(member._id).select("contacts");

        if (findUser.contacts.length > 0) {
          let contact = findUser.contacts.find(
            (contact) => contact.userId.toString() === memberId.toString()
          );
          const displayName = contact ? contact.savedName : name;
          name = displayName;
        }

        if (receiverId) {
          io.to(receiverId).emit(
            "newMember",
            [{ fullname: name, profilePic, _id: memberId }],
            groupMember._id
          );
        }
      }
      const contact = userContacts.contacts.find(
        (contact) => contact.userId.toString() === member._id.toString()
      );
      const displayName = contact ? contact.savedName : member.fullname;
      member.fullname = displayName;
    }

    const { _id, name, photo, admin, admins } = group;
    const groupInfo = {
      _id,
      fullname: name,
      profilePic: photo,
      members: groupMember.members,
      admins,
      admin,
      inviteLink,
      messagePermission: true,
      sender: null,
      receiver: _id,
      type: "Group",
      lastMessage: null,
      lastMessageType: null,
      lastMessageTime: new Date().toISOString(),
    };

    res.status(200).json({
      success: 1,
      message: "Successfully joined the group",
      group: groupInfo,
    });
  } catch (error) {
    console.log("Error in joinGroup:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId, newMemberId, myId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(200)
        .json({ success: false, message: "Group not found" });
    }

    if (
      group.type === "private" &&
      !group.admins.includes(req.user._id) &&
      group.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to add members in this private group",
      });
    }

    const uniqueMembers = newMemberId
      .filter((element) => !group.members.includes(element._id)) // Keep only new members
      .map((element) => element._id); // Extract only the IDs
    // Add member to group
    if (uniqueMembers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Member not added" });
    }
    group.members.map((user) => {
      if (user != myId) {
        let receiverId = getUserSocketId(user);

        if (receiverId) {
          io.to(receiverId).emit("newMember", newMemberId, group._id);
        }
      }
    });

    group.members.push(...uniqueMembers);
    await group.save();

    const groupMembers = await Group.findById(groupId)
      .select("members")
      .populate("members", "fullname profilePic _id");

    await Promise.all(
      uniqueMembers.map(async (user) => {
        let receiverId = getUserSocketId(user);
        if (receiverId) {
          const userContacts = await Users.findById(user).select("contacts");
          for (const member of groupMembers.members) {
            const contact = userContacts.contacts.find(
              (contact) => contact.userId.toString() === member._id.toString()
            );
            const displayName = contact ? contact.savedName : member.fullname;
            member.fullname = displayName;
          }
          const {
            name,
            photo,
            admins,
            admin,
            inviteLink,
            messagePermission,
            _id,
          } = group;
          io.to(receiverId).emit("newGroup", {
            _id,
            fullname: name,
            profilePic: photo,
            members: groupMembers.members,
            admins,
            admin,
            inviteLink,
            messagePermission,
            sender: null,
            receiver: group._id,
            type: "Group",
            lastMessage: null,
            lastMessageType: null,
            lastMessageTime: new Date().toISOString(),
          });
        }
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Member added successfully" });
  } catch (error) {
    console.log("Error in addMember:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const assignAdmin = async (req, res) => {
  try {
    const { groupId, newAdminId } = req.body;
    const myId = req.user._id;
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(200)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can assign another admin
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to assign admin",
      });
    }
    if (!group.members.includes(newAdminId)) {
      return res.status(200).json({
        success: false,
        message: "User is not a member of the group",
      });
    }

    group.members.forEach((element) => {
      if (element._id != myId) {
        if (getUserSocketId(element._id)) {
          io.to(getUserSocketId(element._id)).emit(
            "newAdmin",
            group._id,
            newAdminId
          );
        }
      }
    });

    if (!group.admins.includes(newAdminId)) {
      group.admins.push(newAdminId);
      await group.save();
      res
        .status(200)
        .json({ success: true, message: "New admin assigned successfully" });
    } else {
      res
        .status(200)
        .json({ success: false, message: "User is already an admin" });
    }
  } catch (error) {
    console.log("Error in assignAdmin:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const RemoveAdmin = async (req, res) => {
  try {
    const { groupId, adminId } = req.body;
    const myId = req.user._id;
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(200)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can remove another admin
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to remove admin",
      });
    }

    if (group.admins.length === 1) {
      return res.status(200).json({
        success: false,
        message: "You cannot remove the last admin from the group",
      });
    }

    if (group.admins.includes(adminId)) {
      group.admins.pull(adminId);

      group.members.forEach((element) => {
        if (element._id != myId) {
          if (getUserSocketId(element._id)) {
            io.to(getUserSocketId(element._id)).emit(
              "removeAdmin",
              group._id,
              adminId
            );
          }
        }
      });
      await group.save();
      res
        .status(200)
        .json({ success: true, message: "Admin removed successfully" });
    } else {
      res.status(200).json({ success: false, message: "User is not an admin" });
    }
  } catch (error) {
    console.log("Error in removeAdmin:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const toggleMessagePermission = async (req, res) => {
  try {
    const { groupId } = req.body;
    if (!groupId) {
      return res
        .status(200)
        .json({ success: false, message: "Group ID is required" });
    }
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(200)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can toggle message permission
    if (!group.admins.includes(req.user._id)) {
      return res.status(200).json({
        success: false,
        message: "You are not authorized to change message permission",
      });
    }

    // Toggle message permission
    group.messagePermission = !group.messagePermission;
    await group.save();

    res.status(200).json({
      success: true,
      message: `Message permission updated to ${group.messagePermission}`,
    });
  } catch (error) {
    console.log("Error in toggleMessagePermission:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const myId = req.user._id;
    // Validate groupId
    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid or missing Group ID" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(200)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can delete the group
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this group",
      });
    }

    group?.members?.forEach((user) => {
      if (user.toString() != myId.toString()) {
        let socketId = getUserSocketId(user);
        if (socketId) {
          io.to(socketId).emit("deleteGroup", groupId);
        }
      }
    });

    await group.deleteOne();
    res.status(200).json({ success: true, message: "Group deleted" });
  } catch (error) {
    console.log("Error in deleteGroup:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const myId = req.user._id;

    if (
      !groupId ||
      !memberId ||
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(200).json({
        success: false,
        message: "Invalid or missing Group ID or member ID",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Check if the user is an admin or the main admin
    if (
      !group.admins.includes(req.user._id) &&
      group.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove members",
      });
    }

    // If the main admin is trying to remove a member or admin
    if (group.admin.toString() === req.user._id.toString()) {
      // If it's the main admin, they can remove both admins and members
      const memberIdx = group.members.indexOf(memberId);
      if (memberIdx === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Member not found in the group" });
      }

      group.members.pull(memberId);

      // If the removed user is also an admin, remove them from admins list
      if (group.admins.includes(memberId)) {
        const remainingAdmins = group.admins.length > 0;
        if (!remainingAdmins) {
          return res.status(200).json({
            success: false,
            message:
              "You cannot remove the last admin from the group. Please assign another admin first.",
          });
        }
        group.admins.pull(memberId);
      }
      // If the main admin is deleting themselves, they need to assign a new admin first
      if (memberId.toString() === req.user._id.toString()) {
        // Ensure there is another admin
        const remainingAdmins = group.admins.length > 0;
        if (!remainingAdmins) {
          return res.status(200).json({
            success: false,
            message:
              "You cannot remove the last admin from the group. Please assign another admin first.",
          });
        }

        // If the user is trying to delete themselves as main admin, assign a new admin
        // (Handle the logic to promote another member as admin here, if needed)
      }
    } else {
      // Admin cannot remove another admin
      if (group.admins.includes(memberId)) {
        return res.status(200).json({
          success: false,
          message: "Admin cannot remove another admin",
        });
      }

      // Admin can remove members
      const memberIdx = group.members.indexOf(memberId);
      if (memberIdx === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Member not found in the group" });
      }

      // Remove member from the group
      group.members.pull(memberId);
    }

    await group.save();

    group.members.forEach((element) => {
      if (element._id != myId) {
        if (getUserSocketId(element._id)) {
          io.to(getUserSocketId(element._id)).emit(
            "removeMember",
            group._id,
            memberId
          );
        }
      }
    });
    // delete user id
    if (getUserSocketId(memberId)) {
      io.to(getUserSocketId(memberId)).emit(
        "removeMember",
        group._id,
        memberId
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.log("Error in removeMember:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const leaveGroup = async (req, res) => {
  const { groupId } = req.body;
  const myId = req.user._id;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(200).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user is part of the group
    const isAdmin = group.admins.includes(myId);
    const isMember = group.members.some(
      (member) => member._id.toString() === myId.toString()
    );

    if (!isAdmin && !isMember) {
      return res.status(200).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    // Handle main admin leaving
    if (group.admin.toString() === myId.toString()) {
      if (group.admins.length === 1) {
        return res.status(200).json({
          success: false,
          message: "You cannot leave the group without assigning a new admin",
        });
      }

      // Select a new admin (excluding the leaving admin)
      const remainingAdmins = group.admins.filter(
        (admin) => admin.toString() !== myId.toString()
      );
      group.admin = remainingAdmins[0]; // Assign the first remaining admin
      group.admins = remainingAdmins;
    } else if (isAdmin) {
      // If user is an admin but not the main admin, just remove them from admins
      group.admins = group.admins.filter(
        (admin) => admin.toString() !== myId.toString()
      );
    }

    // Remove from members
    group.members = group.members.filter(
      (member) => member._id.toString() !== myId.toString()
    );

    // Save the updated group
    await group.save();

    // Emit socket event to notify remaining members
    group.members.forEach((member) => {
      if (member._id != myId) {
        const socketId = getUserSocketId(member._id);
        if (socketId) {
          io.to(socketId).emit("leaveGroup", myId, groupId);
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "You have successfully left the group",
    });
  } catch (error) {
    console.error("Error in leaveGroup:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the groups where the user is a member or an admin
    let groups = await Group.find({ members: userId }).populate(
      "members",
      "fullname profilePic _id"
    );

    if (groups.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No groups found for this user.",
      });
    }

    // Loop through each group
    for (const group of groups) {
      // Loop through each member in the group
      for (const member of group.members) {
        // Get the contact list of the logged-in user
        const userContacts = await Users.findById(userId).select("contacts");

        // Find the saved name from the contacts list
        const contact = userContacts.contacts.find(
          (contact) => contact.userId.toString() === member._id.toString()
        );

        // Set the displayName to the savedName if found, otherwise use fullname
        const displayName = contact ? contact.savedName : member.fullname;

        // Update the member object with only necessary fields
        member.fullname = displayName;
      }
    }

    // Return the groups with members' display names and limited fields
    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.log("Error in getGroup:", error.message);
    res.status(200).json({ success: false, message: "Server error" });
  }
};
