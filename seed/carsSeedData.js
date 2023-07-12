// Run node seed/carsSeedData.js to initialize the DB with some test cars

const mongoose = require("mongoose");
const Car = require("../models/Car.model");

const seedData = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2021,
    color: "Blue",
    mileage: 10000,
    features: ["GPS", "Bluetooth"],
    fuelType: "Gasoline",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Sedan",
    registration: "B-MH-1234",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2020,
    color: "Red",
    mileage: 8000,
    features: ["Backup Camera", "Apple CarPlay"],
    fuelType: "Gasoline",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Sedan",
    registration: "K-AB-5678",
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2022,
    color: "Yellow",
    mileage: 5000,
    features: ["Leather Seats", "Navigation System"],
    fuelType: "Gasoline",
    numberOfSeats: 4,
    isAutomatic: false,
    carType: "Sports Car",
    registration: "F-XY-9876",
  },
  {
    make: "Tesla",
    model: "Model S",
    year: 2021,
    color: "Black",
    mileage: 5000,
    features: ["Autopilot", "Large Touchscreen"],
    fuelType: "Electric",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Sedan",
    registration: "M-HG-4321",
  },
  {
    make: "Nissan",
    model: "Leaf",
    year: 2022,
    color: "White",
    mileage: 2000,
    features: ["Eco Mode", "Regenerative Braking"],
    fuelType: "Electric",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Hatchback",
    registration: "AC-DF-2468",
  },
  {
    make: "Chevrolet",
    model: "Bolt EV",
    year: 2021,
    color: "Blue",
    mileage: 3000,
    features: ["DC Fast Charging", "Apple CarPlay"],
    fuelType: "Electric",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Hatchback",
    registration: "BN-QW-1357",
  },
  {
    make: "Volkswagen",
    model: "Golf",
    year: 2021,
    color: "Silver",
    mileage: 15000,
    features: ["LED Headlights", "Touchscreen Infotainment"],
    fuelType: "Diesel",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Hatchback",
    registration: "R-JK-7890",
  },
  {
    make: "BMW",
    model: "X5",
    year: 2022,
    color: "Black",
    mileage: 10000,
    features: ["Panoramic Roof", "Advanced Driver Assistance System"],
    fuelType: "Diesel",
    numberOfSeats: 7,
    isAutomatic: true,
    carType: "SUV",
    registration: "L-NP-2468",
  },
  {
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2021,
    color: "Blue",
    mileage: 12000,
    features: ["Leather Interior", "Multimedia System"],
    fuelType: "Diesel",
    numberOfSeats: 5,
    isAutomatic: true,
    carType: "Sedan",
    registration: "E-PO-9753",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bizwheels", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Car.deleteMany({});

    await Car.insertMany(seedData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
}

seedDatabase();
