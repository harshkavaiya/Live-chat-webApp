import { mongoose } from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    photo: { type: String, default: "" },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: { type: String, enum: ["public", "private"], default: "private" },
    inviteLink: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
