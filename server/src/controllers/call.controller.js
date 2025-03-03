import { isValidObjectId } from "mongoose";
import Call from "../models/call.model.js";
import Users from "../models/users.model.js";

/** ✅ Call Start */
export const startCall = async (callerId, receiverId, callType) => {
  try {
    if (!isValidObjectId(callerId) || !isValidObjectId(receiverId)) {
      console.log("❌ Invalid callerId or receiverId.");
      return null;
    }

    const caller = await Users.findById(callerId);
    const receiver = await Users.findById(receiverId);

    if (!caller || !receiver) {
      console.log("❌ Caller or Receiver not found.");
      return null;
    }

    const newCall = new Call({
      callerId,
      receiverId,
      callType,
      status: "ringing", // 🔹 Default status is 'ringing'
      startedAt: new Date(),
    });

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
      { callerId, receiverId, status: "ringing" }, // 🔹 Update from 'ringing' to 'ongoing'
      { status: "ongoing" },
      { new: true }
    );

    if (!call) {
      console.log("❌ No ringing call found to accept.");
      return null;
    }

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
    const call = await Call.findOneAndUpdate(
      { callerId, receiverId, status: "ringing" },
      { status: "rejected" }
    );

    if (!call) {
      console.log("❌ No ringing call found to reject.");
      return;
    }

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
    const duration = Math.round((endTime - new Date(call.startedAt)) / 1000);

    const updatedCall = await Call.findByIdAndUpdate(
      call._id,
      { status: "completed", endedAt: endTime, duration },
      { new: true }
    );

    console.log(`🔚 Call ended. Duration: ${duration} seconds`);
    return updatedCall;
  } catch (error) {
    console.error("❌ Error ending call:", error);
    return null;
  }
};

/** ✅ Missed Call */
export const missedCall = async (callerId, receiverId) => {
  try {
    const call = await Call.findOneAndUpdate(
      { callerId, receiverId, status: "ringing" }, // 🔹 Only ringing calls can be missed
      { status: "missed" }
    );

    if (!call) {
      console.log("❌ No ringing call found to mark as missed.");
      return;
    }

    console.log(`📵 Missed call: ${callerId} -> ${receiverId}`);
  } catch (error) {
    console.error("❌ Error marking missed call:", error);
  }
};

/** ✅ Fetch Call Logs */
export const getCallLogs = async (userId) => {
  try {
    const calls = await Call.find({
      $or: [{ callerId: userId }, { receiverId: userId }],
    })
      .populate("callerId", "fullname email profilePic")
      .populate("receiverId", "fullname email profilePic") // 🔹 Add profilePic for UI display
      .sort({ startedAt: -1 });

    return calls;
  } catch (error) {
    console.error("❌ Error fetching call logs:", error);
    return [];
  }
};

/** ✅ API: Get Calls */
export const GetCalls = async (req, res) => {
  try {
    const myId = req.user._id;
    const calls = await getCallLogs(myId);
    res.status(200).json(calls);
  } catch (error) {
    console.error("❌ Error fetching calls:", error);
    res.status(500).json({ message: "Error fetching calls" });
  }
};
