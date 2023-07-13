// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// add session
require("./config/session")(app)

// create absolute path to views-folder
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// add custom middleware
const {isLoggedIn, isAdmin} = require("./middleware/route-guard")

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const carsRouter = require('./routes/cars.route');
app.use("/cars", isLoggedIn, carsRouter);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", isLoggedIn, profileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
