import Status from "../models/status.model.js";
import Users from "../models/users.model.js";
import { io, getUserSocketId } from "../lib/socket-io.js";

export const UploadStatus = async (req, res) => {
  try {
    const { name, author, status } = req.body;

    let find = await Status.find({ author });
    let friend = await Users.findById(author).select("contacts");
    if (friend.contacts.length) {
      friend.contacts.forEach((element) => {
        if (getUserSocketId(element.userId)) {
          io.to(getUserSocketId(element.userId)).emit("newStatus", {
            status,
            id: author,
            name: element.savedName,
          });
        }
      });
    }
    if (find.length) {
      find[0].status = [...find[0].status, ...status];
      await find[0].save();
      return res.status(201).json({ success: 1 });
    }
    await Status.create({ name, author, status });

    res.status(201).json({ success: 1 });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: error.message, success: 0 });
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
  const id = req.user._id;
  let find = await Status.find({ author: data }).select(
    "-createdAt -updatedAt -_id"
  );

  find.forEach((element) => {
    element.status.forEach((sts) => {
      let seen = sts.seen.some((user) => user._id.toString() == id);
      if (seen) {
        element.seen++;
        sts.read = true;
      }
      delete sts.seen;
    });
    // After the loop
  });

  res.status(200).json({ find });
};

export const handleStatusSeen = async (req, res) => {
  const { index, userId, userName, time } = req.body;
  const { id } = req.params;

  let findPic = await Users.findById(userId).select("profilePic");
  console.log(findPic);
  try {
    // Initialize the new seen user object
    const newSeenUser = {
      _id: userId,
      name: userName,
      profile: findPic.profilePic,
      time,
    };

    // Find the status document by ID
    const statusDoc = await Status.find({ author: id });
    if (!statusDoc.length || !statusDoc[0].status[index]) {
      return res.status(200).json({ success: 0 });
    }
    // Check if the user has already seen this status
    const alreadySeen = statusDoc[0].status[index].seen?.some(
      (user) => user._id.toString() == userId
    );

    if (alreadySeen) {
      return res.status(200).json({ success: 0 });
    }

    // If the user hasn't seen the status yet, proceed with the update
    const updatedStatus = await Status.findOneAndUpdate(
      { author: id }, // The document ID
      {
        $push: { [`status.${index}.seen`]: newSeenUser }, // Add the new user to the `seen` array at the given index
      },
      { new: true } // Return the updated document
    );
    if (!updatedStatus) {
      return res.status(200).json({ success: 0 });
    }

    // Return the updated status object with a success response
    io.to(getUserSocketId(id)).emit("seenStatus", {
      index,
      newSeenUser,
    });
    return res.status(200).json({ success: 1 });
  } catch (error) {
    console.error("Error updating status:", error);
    return res
      .status(200)
      .json({ message: "Error updating status", success: 0 });
  }
};

export const DeleteStatus = async (req, res) => {
  const { index } = req.query;
  const { id } = req.params;

  let find = await Status.find({ author: id });

  if (!find?.length) return res.status(200).json({ success: 0 });

  let friend = await Users.findById(id).select("contacts");

  friend?.contacts?.forEach((element) => {
    if (getUserSocketId(element.userId)) {
      io.to(getUserSocketId(element.userId)).emit("deleteStatus", {
        index,
        id: id,
      });
    }
  });

  find[0].status.splice(index, 1);

  if (!find[0].status?.length) {
    await Status.deleteOne({ author: id });
    return res.status(200).json({ success: 1 });
  }
  find[0].save();
  return res.status(200).json({ success: 1 });
};
