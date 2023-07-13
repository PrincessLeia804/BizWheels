const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
        car: {
            // TODO check Filipas Model for the right ref
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
        dropOfLocation: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

const BookingModel = model("Booking", bookingSchema);

module.exports = BookingModel;
