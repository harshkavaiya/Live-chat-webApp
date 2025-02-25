import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    reaction: [
      {
        id: { type: Number }, // Reaction type ID (e.g., 1 for 'Like', 2 for 'Love')
        label: { type: String }, // Reaction name ('Like', 'Love', 'Laugh', etc.) // Number of users who reacted with this type
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    image: {
      type: String,
    },
    read: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seenAt: { type: Date },
      },
    ],
    deletedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
