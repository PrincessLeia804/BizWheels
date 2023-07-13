const Car = require('../models/Car.model');

async function checkCarAvailability(date, duration) {
  try {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

    const availableCars = await Car.find({
      reservations: {
        $not: {
          $elemMatch: {
            date: { $gte: startDate, $lt: endDate },
          },
        },
      },
    });

    return availableCars;
  } catch (error) {
    console.log('Error checking car availability:', error);
    throw error;
  }
}

module.exports = checkCarAvailability;
