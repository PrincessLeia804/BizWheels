// Run node seed/userSeedData.js to initialize the DB with some test cars
const mongoose = require('mongoose');
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(13);

const userSeedData = [
    {
        firstName: 'Filipa',
        lastName: 'Santos',
        email: 'filipa.santos@lepa.com',
        role: 'admin',
        passwordHash: bcrypt.hashSync('1234', salt),
    },
    {
        firstName: 'Lea',
        lastName: 'Model',
        email: 'lea.model@lepa.com',
        role: 'admin',
        passwordHash: bcrypt.hashSync('1234', salt),
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@lepa.com',
        passwordHash: bcrypt.hashSync('1234', salt),
    }
]

async function seedDatabase() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/bizwheels", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      await UserModel.deleteMany({});
  
      await UserModel.insertMany(userSeedData);
  
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      // Disconnect from the database
      mongoose.disconnect();
    }
  }
  
  seedDatabase();