export const createGroup = async (req, res) => {
  const { name, members } = req.body;
  const userId = req.user._id;
  try {
    if (!name || !members) {
      return res
        .status(400)
        .json({ success: false, message: "All field required" });
    }
    res.status(200).json({ success: true, request: req.body, userId });
  } catch (error) {
    console.log("error in create group controller: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
