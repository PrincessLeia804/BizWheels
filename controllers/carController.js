const Car = require('../models/Car.model');

async function getAllCars() {
  try {

    const availableCars = await Car.find({});

    return availableCars;
  } catch (error) {
    console.log('Error checking car availability:', error);
    throw error;
  }
}

async function findCar(carId) {
  try {

    const carById = await Car.findById(carId);

    return carById;
  } catch (error) {
    console.log('Error checking car availability:', error);
    throw error;
  }
}

module.exports = {
  getAllCars,
  findCar
};
