import cloudinary from "../lib/cloudinary.js";
import Group from "../models/group.model.js";
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

    if (group.type === "private" && !group.admins.includes(req.user._id)) {
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
