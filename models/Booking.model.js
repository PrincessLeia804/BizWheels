const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: {
      // TODO: limit to 2 options (reserved / returned) and add status changes 
      type: String,
      default: "reserved"
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pickUpLocation: {
      type: String,
    },
    dropOffLocation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = model("Booking", bookingSchema);

module.exports = BookingModel;
