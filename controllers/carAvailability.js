const Car = require('../models/Car.model');

async function checkCarAvailability(startDate, endDate) {
  try {

    // TODO: Filter cars based on dates, using existing Bookings.
    const availableCars = await Car.find({});

    return availableCars;
  } catch (error) {
    console.log('Error checking car availability:', error);
    throw error;
  }
}

module.exports = checkCarAvailability;
