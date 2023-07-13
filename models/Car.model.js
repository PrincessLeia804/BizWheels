const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    fuelType: {
      type: String,
      enum: ["Gasoline", "Diesel", "Electric", "Hybrid", "Other"],
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
    },
    isAutomatic: {
      type: Boolean,
      default: false,
    },
    carType: {
      type: String,
      enum: ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Sports Car"],
      required: true,
    },
    registration: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
