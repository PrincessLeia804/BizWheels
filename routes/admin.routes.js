const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getAllCars, findCar } = require("../controllers/carController");
const bookingController = require("../controllers/bookingController");
const Car = require("../models/Car.model");
const User = require("../models/User.model");

/* DASHBOARD */
router.get("/", async (req, res) => {
  res.render("admin/dashboard", { userInSession: req.session.user });
});

/* CAR MANAGEMENT */
router.get("/fleet", async (req, res) => {
  try {
    const fleet = await getAllCars();
    res.render("admin/fleet", { fleet: fleet });
  } catch (err) {
    console.log(err);
  }
});

// car update form
router.get("/fleet/update/:id", async (req, res) => {
  const carUpdate = req.params.id;

  try {
    const car = await Car.findById(carUpdate);
    res.render("admin/car-edit", { car: car });
  } catch (err) {
    console.log(err);
  }
});

// Update db entry
router.post("/fleet/update/:id", async (req, res) => {
  const carUpdate = req.params.id;
  const specsUpdate = req.body;

  if ("isAutomatic" in specsUpdate) {
    specsUpdate.isAutomatic = specsUpdate.isAutomatic === "true";
  }
  else{
    specsUpdate.isAutomatic = false;
  }

  try {
    const car = await Car.findByIdAndUpdate(
      { _id: carUpdate },
      { $set: specsUpdate },
      { new: true }
    );

    res.redirect(`/admin/fleet/update/${carUpdate}`);
  } catch (error) {
    console.log("Failed to update car"+error);
  }
});

/* ADD NEW CARS */

router.get("/fleet/add", async (req, res) => {
  res.render("admin/car-create");
});

router.post("/fleet/add", async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      color,
      mileage,
      features,
      fuelType,
      numberOfSeats,
      carType,
      registration,
      imageUrl,
    } = req.body;

    console.log(req.body);
    const isAutomatic = req.body.isAutomatic === "true";

    const car = new Car({
      make,
      model,
      year,
      color,
      mileage,
      features,
      fuelType,
      numberOfSeats,
      isAutomatic,
      carType,
      registration,
      imageUrl,
    });

    const savedCar = await car.save();
    console.log(savedCar);

    res.redirect("/admin/fleet");
  } catch (error) {
    console.error("Error adding a car:", error);
    res.status(500).send("Error adding a car");
  }
});

/* DELETE CAR */
router.get("/fleet/delete/:id", async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin/fleet");
  } catch (error) {
    console.log("Account could not be deleted");
  }
});

/* USER MANAGEMENT */
router.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.render("admin/users", { users: allUsers });
  } catch (error) {
    console.log(error);
  }
});

/* DELETE USER */
router.get("/users/delete/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    console.log(user);
    res.redirect("/admin/users");
  } catch (error) {
    console.log("User could not be deleted");
  }
});

// Update USER DETAILS

router.get("/users/update/:id", async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.params.id });
    console.log(userData);
    res.render("admin/user-edit", { user: userData });
  } catch (error) {
    console.log("Data couldn't be displayed: " + error.message);
  }
});

router.post("/users/update/:id", async (req, res) => {
  try {
    const profileUpdate = req.body;

    if (profileUpdate.newPassword) {
      const salt = bcrypt.genSaltSync(13);

      profileUpdate.passwordHash = bcrypt.hashSync(
        profileUpdate.newPassword,
        salt
      );
      delete profileUpdate.newPassword;
    }

    console.log(profileUpdate);
    const userData = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: profileUpdate },
      { new: true }
    );
    console.log("User Profile updated: " + userData);
    res.redirect("/admin/users");
  } catch (error) {
    console.log("Failed to update user: " + error.message);
  }
});

router.get("/users/bookings/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await bookingController.getPopulatedUserBookings(userId);
    console.log(user);
    res.render("admin/user-bookings", { user });
  } catch (error) {
    console.log("Error fetching user bookings:", error);
    res.status(500).send("Error fetching user bookings");
  }
});


module.exports = router;
