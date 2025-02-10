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

    const inviteLink = Math.random().toString(36).substr(2, 8);
    const newGroup = new Group({
      name,
      description,
      photo: cloudPic.secure_url,
      admin,
      members: [admin, ...membersArray],
      type,
      inviteLink,
    });

    await newGroup.save();
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
