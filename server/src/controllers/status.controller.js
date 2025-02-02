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
        if (getUserSocketId(element.userId) != undefined) {
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
  const id = req.user._id;
  let find = await Status.find({ author: data }).select(
    "-createdAt -updatedAt"
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

  try {
    // Initialize the new seen user object
    const newSeenUser = {
      _id: userId,
      name: userName,
      profile:
        "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.384129796.1719158699&semt=ais_hybrid",
      time,
    };

    // Find the status document by ID
    const statusDoc = await Status.findById(id);
    if (!statusDoc || !statusDoc.status[index]) {
      return res.status(200).json({ success: 0 });
    }

    // Check if the user has already seen this status
    const alreadySeen = statusDoc.status[index].seen.some(
      (user) => user._id.toString() === userId
    );
    if (alreadySeen) {
      return res.status(200).json({ success: 0 });
    }

    // If the user hasn't seen the status yet, proceed with the update
    const updatedStatus = await Status.findByIdAndUpdate(
      id, // The document ID
      {
        $push: { [`status.${index}.seen`]: newSeenUser }, // Add the new user to the `seen` array at the given index
      },
      { new: true } // Return the updated document
    );

    if (!updatedStatus) {
      return res.status(200).json({ success: 0 });
    }

    // Return the updated status object with a success response

    io.to(getUserSocketId(statusDoc.author)).emit("seenStatus", {
      index,
      newSeenUser,
    });
    return res.status(200).json({ update: updatedStatus, success: 1 });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Error updating status" });
  }
};
