import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Hi, I'm using BaatCheet!",
    },
    contacts: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        savedName: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
