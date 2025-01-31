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
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
<<<<<<< HEAD
    },
    reaction: {
      type: Object,
=======
>>>>>>> 18e882c9452abbbc42d84db636feb0f496691200
    },
    image: {
      type: String,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
