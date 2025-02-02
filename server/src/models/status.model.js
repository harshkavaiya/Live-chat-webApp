import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: Array,
      required: true,
    },seen:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const Status = mongoose.model("Status", statusSchema);

export default Status;
