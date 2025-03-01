import { isValidObjectId } from "mongoose";
import Call from "../models/call.model.js";
import Users from "../models/users.model.js";

/** ✅ Call Start */
export const startCall = async (callerId, receiverId, callType) => {
  try {
    // Validate IDs
    if (!isValidObjectId(callerId) || !isValidObjectId(receiverId)) {
      console.log("❌ Invalid callerId or receiverId.");
      return null;
    }

    const caller = await Users.findById(callerId);
    const receiver = await Users.findById(receiverId);

    if (!caller || !receiver) {
      console.log("Caller or Receiver not found.");
      return null;
    }

    const newCall = new Call({ callerId, receiverId, callType });
    await newCall.save();

    console.log(`📞 Call started: ${callerId} -> ${receiverId}`);
    return newCall;
  } catch (error) {
    console.error("❌ Error starting call:", error);
    return null;
  }
};

/** ✅ Call Accept */
export const acceptCall = async (callerId, receiverId) => {
  try {
    const call = await Call.findOneAndUpdate(
      { callerId, receiverId, status: "ongoing" },
      { status: "ongoing" },
      { new: true }
    );

    console.log(`✅ Call accepted: ${callerId} -> ${receiverId}`);
    return call;
  } catch (error) {
    console.error("❌ Error accepting call:", error);
    return null;
  }
};

/** ✅ Call Reject */
export const rejectCall = async (callerId, receiverId) => {
  try {
    await Call.findOneAndUpdate(
      { callerId, receiverId, status: "ongoing" },
      { status: "rejected" }
    );

    console.log(`🚫 Call rejected: ${callerId} -> ${receiverId}`);
  } catch (error) {
    console.error("❌ Error rejecting call:", error);
  }
};

/** ✅ Call End */
export const endCall = async (callerId, receiverId) => {
  try {
    if (!isValidObjectId(callerId) || !isValidObjectId(receiverId)) {
      console.log("❌ Invalid callerId or receiverId.");
      return;
    }

    const call = await Call.findOne({
      callerId,
      receiverId,
      status: "ongoing",
    });

    if (!call) {
      console.log("❌ No ongoing call found.");
      return;
    }

    const endTime = new Date();
    const duration = Math.round((endTime - new Date(call.startedAt)) / 1000); // Convert duration to seconds

    const updatedCall = await Call.findByIdAndUpdate(
      call._id,
      {
        status: "completed",
        endedAt: endTime,
        duration: duration,
      },
      { new: true } // Returns the updated document
    );

    console.log(`🔚 Call ended. Duration: ${duration} seconds`, updatedCall);
    return updatedCall;
  } catch (error) {
    console.error("❌ Error ending call:", error);
    return null;
  }
};

/** ✅ Missed Call */
export const missedCall = async (callerId, receiverId) => {
  try {
    await Call.findOneAndUpdate(
      { callerId, receiverId, status: "ongoing" },
      { status: "missed" }
    );

    console.log(`📵 Missed call: ${callerId} -> ${receiverId}`);
  } catch (error) {
    console.error("❌ Error marking missed call:", error);
  }
};

/** ✅ Fetch Call Logs */
export const getCallLogs = async (UsersId) => {
  try {
    const calls = await Call.find({
      $or: [{ callerId: UsersId }, { receiverId: UsersId }],
    })
      .populate("callerId", "fullname email profilePic")
      .populate("receiverId", "fullname email")
      .sort({ startedAt: -1 });

    return calls;
  } catch (error) {
    console.error("❌ Error fetching call logs:", error);
    return [];
  }
};

export const GetCalls = async (req, res) => {
  const myId = req.user._id;

  const find = await getCallLogs(myId);

  res.status(200).json(find);
};
