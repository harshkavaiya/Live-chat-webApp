import mongoose from "mongoose";

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
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: { type: String, enum: ["public", "private"], default: "private" },
    messagePermission: { type: Boolean, default: true },
    inviteLink: { type: String, unique: true },
  },
  { timestamps: true }
);
GroupSchema.index({ name: 1, admin: 1 }, { unique: true });
const Group = mongoose.model("Group", GroupSchema);
export default Group;
