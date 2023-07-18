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
    const car = await Car.findById(carId);
    
    if (!car){
      throw new Error("Car doesn't exist");
    }

    // Validate employee
    const employee = await User.findById(employeeId);
    
    if (!employee){
      throw new Error("Employee doesn't exist");
    }

    // Validate if start date not in the past, and that end date is bigger than start date
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(startDate).setHours(0, 0, 0, 0);
    const selectedEndDate = new Date(endDate).setHours(0, 0, 0, 0);

    if (selectedStartDate < today) {
      throw new Error('The selected start date has already passed.');
    }

    if (selectedEndDate < selectedStartDate) {
      throw new Error('The selected end date must be after the start date.');
    }

    const existingCarBooking = await Booking.findOne({
      carId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    if (existingCarBooking) {
      throw new Error('This car is already booked for the selected dates.');
    }

    const existingUserBookings = await checkUserExistingBookings(employeeId, startDate, endDate);
    if (existingUserBookings.length > 0){
      throw new Error('Employee already has a booking for the selected dates.');
    }

    return true;
  } catch (error) {
    console.log('Booking validation failed:', error);
    throw error;
  }
}

async function checkExistingBookings(startDate, endDate) {
  try {

    const existingBookings = await Booking.find({
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Booking overlaps with specified dates
        { startDate: { $gte: startDate, $lte: endDate } }, // Booking starts within specified dates
        { endDate: { $gte: startDate, $lte: endDate } } // Booking ends within specified dates
      ]
    });
    return existingBookings;

  } catch (error) {
    console.log('Fail to check existing bookings:', error);
    throw error;
  }
}

async function checkUserExistingBookings(userId, startDate, endDate) {
  try {
    const existingBookings = await checkExistingBookings(startDate, endDate);
    
    const userBookings = existingBookings.filter(booking => booking.employeeId.equals(userId));
    
    return userBookings;
  } catch (error) {
    console.log('Failed to check user existing bookings:', error);
    throw error;
  }
}

async function getPopulatedUserBookings(userId) {
  try {
    const user = await User.findById(userId);
    const bookings = await Booking.find({ employeeId: userId });

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const car = await Car.findById(booking.carId);
        booking.car = car;
        return booking;
      })
    );

    user.bookings = populatedBookings;

    return user;
  } catch (error) {
    console.log('Failed to get populated user ebookings:', error);
    throw error;
  }
}


module.exports = {
  createBooking, 
  checkExistingBookings, 
  checkUserExistingBookings,
  getPopulatedUserBookings,
};
