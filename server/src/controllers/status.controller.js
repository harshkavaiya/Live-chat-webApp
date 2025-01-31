import Status from "../models/status.model.js";

export const UploadStatus = async (req, res) => {
  try {
    const { name, author, status } = req.body;

    let find = await Status.find({ author });

    if (find.length) {
      find[0].status = [...find[0].status, ...status];
      await find[0].save();
      return res.status(201).json({ success: 1 });
    }
    await Status.create({ name, author, status });
    res.status(201).json({ status: 1 });
  } catch (error) {
    res.status(500).json({ message: error.message, success: 0 });
  }
};

export const getUserStatus = async (req, res) => {
  const { id } = req.params;
  const find = await Status.find({ author: id });

  if (find.length) {
    res.status(200).json({ data: find[0], success: 1 });
  } else {
    res.status(200).json({ success: 0 });
  }
};

export const FriendStatus = async (req, res) => {
  const { data } = req.body;
  let find = await Status.find({ author: data });
  res.status(200).json({ find });
};
