const express = require("express");
const router = express.Router();
const {
  getAllCars,
  findCar,  
} = require("../controllers/carController");
const Car = require("../models/Car.model");
// const { createBooking, checkExistingBookings, convertISOToDate } = require("../controllers/bookingController");
// const { isLoggedIn } = require("../middleware/route-guard");
// const Car = require("../models/Car.model");
// const BookingModel = require("../models/Booking.model");


/* DASHBOARD */
router.get("/", async (req, res) => {
    res.render("profiles/admin-profile", { userInSession: req.session.user })
})

/* CAR MANAGEMENT */
router.get("/fleet", async (req, res) => {
    try {
        const fleet = await getAllCars();
        res.render("cars/fleet", { fleet: fleet });
    } catch (err) {
        console.log(err);
    }
});

// car update form
router.get("/fleet/update/:id", async (req, res) => {
    const carUpdate = req.params.id

    try {
        const car = await Car.findById(carUpdate);
        res.render("cars/car-update", { car: car });
    } catch (err) {
        console.log(err);
    }
});


  // Update db entry
  router.post("/fleet/update/:id", async (req, res) => {
    const carUpdate = req.params.id
    const specsUpdate = req.body

  try {
    const car = await Car.findByIdAndUpdate(
      {_id: carUpdate}, 
      {$set: specsUpdate},
      {new: true})

    res.redirect(`/admin/fleet/update/${carUpdate}`)
  } catch (error) {
    console.log("Data couldn't be displayed");
  }
})


/* DELETE CAR */
router.get("/fleet/delete/:id", async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete({_id: req.params.id})
    res.redirect("/admin/fleet")
  } catch (error) {
    console.log("Account could not be deleted");
  }
})



module.exports = router;