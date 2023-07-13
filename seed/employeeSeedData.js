// Run node seed/carsSeedData.js to initialize the DB with some test cars
const mongoose = require('mongoose')
const EmployeeModel = require('../models/Employee.model')

const employeeSeedData = [
    {
        firstName: 'Filipa',
        lastName: 'Santos',
        email: 'filipa.santos@lepa.com',
        role: 'admin',
        password: '1234'
    },
    {
        firstName: 'Lea',
        lastName: 'Model',
        email: 'lea.model@lepa.com',
        role: 'admin',
        password: '1234'
    },
    {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@lepa.com',
        password: '1234'
    }
]

async function seedDatabase() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/bizwheels", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      await EmployeeModel.deleteMany({});
  
      await EmployeeModel.insertMany(employeeSeedData);
  
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      // Disconnect from the database
      mongoose.disconnect();
    }
  }
  
  seedDatabase();