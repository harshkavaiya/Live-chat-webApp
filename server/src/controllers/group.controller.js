import cloudinary from "../lib/cloudinary.js";
import Group from "../models/group.model.js";
export const createGroup = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const admin = req.user._id;
    if (!name) {
      return res
        .status(250)
        .json({ success: false, message: "Name field required" });
    }
    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photoUrl = result.secure_url;
    }

    const inviteLink = `${Math.random().toString(36).substr(2, 8)}`;
    const newGroup = new Group({
      name,
      description,
      photo: photoUrl,
      admin,
      members: [admin],
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
    console.log("error in create group controller: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
