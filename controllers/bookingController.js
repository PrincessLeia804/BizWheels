const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Car = require('../models/Car.model');

async function createBooking(carId, employeeId, startDate, endDate) {
  try {

    const validBooking = await validateBooking(carId, employeeId, startDate, endDate);
    if (!validBooking)
    {
      return null;
    }

    const booking = await Booking.create({carId, employeeId, startDate, endDate});

    return booking;
  } catch (error) {
    console.log('Failed to create booking:', error);
    throw error;
  }
}

async function validateBooking(carId, employeeId, startDate, endDate) {
  try {
    // Validate car
    const car = Car.findById(carId);
    
    if (!car){
      throw new Error("Car doesn't exist");
    }

    // Validate employee
    const employee = User.findById(employeeId);
    
    if (!employee){
      throw new Error("Employee doesn't exist");
    }

    // Validate if start date not in the past, and that end date bigger than start date
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(startDate).setHours(0, 0, 0, 0);
    const selectedEndDate = new Date(endDate).setHours(0, 0, 0, 0);

    if (selectedStartDate < today) {
      throw new Error('The selected start date has already passed.');
    }

    if (selectedEndDate < selectedStartDate) {
      throw new Error('The selected end date must be after the start date.');
    }

    const existingBooking = await Booking.findOne({
      carId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (existingBooking) {
      throw new Error('This car is already booked for the selected dates.');
    }


    return true;
  } catch (error) {
    console.log('Booking validation failed:', error);
    throw error;
  }
}


module.exports = {
  createBooking,
};
