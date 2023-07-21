const express = require("express");
const moment = require("moment");
const router = express.Router();
const {
  getAllCars,
  findCar,
} = require("../controllers/carController");
const { createBooking, checkExistingBookings } = require("../controllers/bookingController");
const { isLoggedIn } = require("../middleware/route-guard");
const Car = require("../models/Car.model");
const BookingModel = require("../models/Booking.model");

async function getAvailableCars(today, tomorrow) {
  const availableCars = await getAllCars();
  const existingBookings = await checkExistingBookings(today, tomorrow);
  const updatedAvailableCars = availableCars.filter(car => !existingBookings.some(bookedCar => bookedCar.carId.equals(car.id)));
  return updatedAvailableCars;
}

router.get("/", (req, res) => {
  res.json("Cars index should be here");
});

router.get("/request", isLoggedIn, async (req, res) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const availableCars = await getAvailableCars(today, tomorrow);

  const startDate = today.toLocaleDateString().split('/').reverse().join('-');
  const endDate = tomorrow.toLocaleDateString().split('/').reverse().join('-');
  res.render("cars/request", { startDate, endDate, availableCars: availableCars });
});

router.post("/request", isLoggedIn, async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const availableCars = await getAvailableCars(startDate, endDate);

    res.render("cars/request", { startDate, endDate, availableCars });
  } catch (error) {
    console.log("Error processing date update:", error);
    res.status(500).send("Error processing date update");
  }
});

router.post("/submit-request", isLoggedIn, async function (req, res) {
  const { startDate, endDate, carId } = req.body;

  try {
    const employeeId = req.session.user._id;
    const booking = await createBooking(carId, employeeId, startDate, endDate);

    const car = await findCar(carId);


    res.render("cars/confirmation", { startDate, endDate, car });
  } catch (error) {
    console.log("Error creating the booking:", error);
    const errorMessage = "Error creating the booking: " + error.message;
    const script = `<script>alert('${errorMessage}'); window.location.href = '/cars/request';</script>`;
    res.send(script);
  }

});


/* RESERVATIONS */
router.get("/reservations", async (req, res, next) => {
  const employee = req.session.user._id

  try {
    const bookings = await BookingModel.find({ employeeId: employee })
    const carDetails = await Car.find()


    // sort into previous and upcoming bookings
    const today = new Date();
    const prevBookings = []
    const activeBookings = []

    bookings.forEach(booking => {
      if (booking.endDate >= today) {
        activeBookings.push(booking)
      } else {
        prevBookings.push(booking)
      }
    })
    res.render("cars/reservations", { activeBookings, prevBookings, moment, carDetails })
  } catch (error) {
    console.log("Bookings couldn't be found");
  }
})

/* RESERVATIONS UPDATE */
router.get("/reservations/update/:id", async (req, res) => {
  const bookingUpdate = req.params.id;

  try {
    const booking = await BookingModel.findById(bookingUpdate)
    res.render("cars/reservation-update", { booking, moment })
  } catch (err) {
    console.log(err);
  }
});


// UPDATE BOOKING DB
router.post("/reservations/update/:id", async (req, res) => {
  const bookingUpdate = req.params.id;
  const details = req.body;

  // Update Travel dates
  if (req.body.newStartDate) {
    req.body.startDate = req.body.newStartDate
  }
  
  if (req.body.newEndDate) {
    req.body.endDate = req.body.newEndDate
  }
  
  delete req.body.newStartDate
  delete req.body.newStartDate


  try {
    const booking = await BookingModel.findByIdAndUpdate(
      { _id: bookingUpdate },
      { $set: details },
      { new: true }
    );

    res.redirect(`/cars/reservations/update/${bookingUpdate}`);
  } catch (error) {
    console.log("Data couldn't be displayed");
  }
});



/* CANCEL RESERVATION */
router.get("/reservations/delete/:id", async (req, res, next) => {
  try {
    const bookingData = await BookingModel.findByIdAndDelete({ _id: req.params.id })
    res.redirect("/cars/reservations")
  } catch (error) {
    console.log("Booking could not be cancelled");
  }
})


module.exports = router;


