import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Group from "../models/group.model.js";
import Users from "../models/users.model.js";
export const createGroup = async (req, res) => {
  try {
    const { name, description, type, photo, members } = req.body;
    const admin = req.user._id;

    if (!name) {
      return res
        .status(400)
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
    // await Group.deleteMany({});
    res.status(200).json({ success: true, newGroup });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already have a group with this name." });
    }
    console.log("Error in createGroup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const inviteLink = req.params.invite;
    const memberId = req.user._id;

    const group = await Group.findOne({ inviteLink });

    //if group not found or invalid invite link
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite link or group not found",
      });
    }

    //if user is already a member of the group
    if (group.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this group",
      });
    }

    //add user to the group
    group.members.push(memberId);
    await group.save();

    res
      .status(200)
      .json({ success: true, message: "Successfully joined the group", group });
  } catch (error) {
    console.log("Error in joinGroup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId, newMemberId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (
      group.type === "private" &&
      !group.admins.includes(req.user._id) &&
      group.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add members in this private group",
      });
    }

    // Add member to group
    if (!group.members.includes(newMemberId)) {
      group.members.push(newMemberId);
      await group.save();
      res
        .status(200)
        .json({ success: true, message: "Member added successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Member is already in the group" });
    }
  } catch (error) {
    console.log("Error in addMember:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const assignAdmin = async (req, res) => {
  try {
    const { groupId, newAdminId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can assign another admin
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to assign admin",
      });
    }
    if (!group.members.includes(newAdminId)) {
      return res.status(403).json({
        success: false,
        message: "User is not a member of the group",
      });
    }

    if (!group.admins.includes(newAdminId)) {
      group.admins.push(newAdminId);
      await group.save();
      res
        .status(200)
        .json({ success: true, message: "New admin assigned successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "User is already an admin" });
    }
  } catch (error) {
    console.log("Error in assignAdmin:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleMessagePermission = async (req, res) => {
  try {
    const { groupId } = req.body;
    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }
    const group = await Group.findById(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can toggle message permission
    if (!group.admins.includes(req.user._id)) {
      return res.status(403).json({
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    // Validate groupId
    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing Group ID" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Only admin can delete the group
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this group",
      });
    }

    await group.deleteOne();
    res.status(200).json({ success: true, message: "Group deleted" });
  } catch (error) {
    console.log("Error in deleteGroup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    if (
      !groupId ||
      !memberId ||
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({
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
          return res.status(400).json({
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
          return res.status(400).json({
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
        return res.status(400).json({
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

    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (error) {
    console.log("Error in removeMember:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user is part of the group (either admin or member)
    if (
      !group.admins.includes(req.user._id) &&
      !group.members.includes(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    // If the user is the main admin (and the only admin), they can't leave without assigning a new admin
    if (group.admin.toString() === req.user._id.toString()) {
      // If there are no other admins, the main admin cannot leave
      if (group.admins.length === 1) {
        return res.status(400).json({
          success: false,
          message: "You cannot leave the group without assigning a new admin",
        });
      }

      // Optionally, you can assign a new admin here (e.g. the first member in the member list)
      // Assign the first member in the list as the new admin
      const newAdmin = group.members[0]; // You can add your logic to choose a new admin

      group.admin = newAdmin; // Assign new admin

      // Remove the user from the admins and members
      group.admins.pull(req.user._id);
      group.members.pull(req.user._id);
    } else {
      // If the user is an admin, remove them from the admin list
      if (group.admins.includes(req.user._id)) {
        group.admins.pull(req.user._id);
      }

      // If the user is a member, remove them from the members list
      if (group.members.includes(req.user._id)) {
        group.members.pull(req.user._id);
      }
    }

    // Save the updated group
    await group.save();

    res.status(200).json({
      success: true,
      message: "You have successfully left the group",
    });
  } catch (error) {
    console.log("Error in leaveGroup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the groups where the user is a member or an admin
    const groups = await Group.find({ members: userId }).populate(
      "members",
      "phone profilePic"
    );

    if (groups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No groups found for this user.",
      });
    }

    // Return the found groups
    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    console.log("Error in getGroup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
