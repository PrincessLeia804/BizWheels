// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bizwheels";
  
  mongoose
  .connect("mongodb+srv://bizwheels-main-db-01e5d5349eb:6XR2S8Fe2K9cpqq3QX5V7S28HQkgEW@prod-us-central1-2.ih9la.mongodb.net/bizwheels-main-db-01e5d5349eb")
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
