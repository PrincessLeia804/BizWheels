const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    firstName : {
      type: String,
      trim: true,
      required: true
    },
      lastName : {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
      required: true,
    },
    company: {
      type: String,
      default: "LePa"
    }
  },
  {
    timestamps: true
  }
);

const EmployeeModel = model("Employee", employeeSchema);

module.exports = EmployeeModel;
