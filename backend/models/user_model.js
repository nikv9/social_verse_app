import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name!"],
      minLength: [3, "Name must be atleast 3 characters long!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your Email!"],
      unique: [true],
      validate: [validator.isEmail, "Please enter a valid Email!"],
    },
    password: {
      type: String,
      // required: [true, "Please enter your Password!"],
      minLength: [4, "Password must be atleast 4 characters long!"],
    },
    profileImg: {
      imgId: {
        type: String,
      },
      imgUrl: {
        type: String,
      },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followReqsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followReqsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
