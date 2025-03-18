import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User collection
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 1000 * 60 * 5), // 5 minutes expiration
    index: { expires: "5m" }, //
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
