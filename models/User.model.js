const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
      required: true,
    },
    company: {
      type: String,
      default: "LePa",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

module.exports = UserModel;
