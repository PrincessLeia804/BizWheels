const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        car: {
            type: Schema.Types.ObjectId, ref: "Car"
        },
        employee: {
            type: Schema.Types.ObjectId, ref: "Employee"
        },
        duration: {
            type: Number
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        pickUpLocation: {
            type: String,
        },
        dropOffLocation: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

const BookingModel = model("Booking", bookingSchema);

module.exports = BookingModel;
