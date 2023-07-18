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
  res.json("Cars index will be here");
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
  console.log(req.body);
  try {
    const employeeId = req.session.user._id;
    const booking = await createBooking(carId, employeeId, startDate, endDate);  
    console.log(booking);
    
    const car = await findCar(carId);
    console.log(car)

    res.render("cars/confirmation", { startDate, endDate, car});
  } catch (error) {
    console.log("Error creating the booking:", error);
    res.status(500).send("Error creating the booking: " + error.message);
  }
});


/* RESERVATIONS */
router.get("/reservations", async(req, res, next) => {
  const employee = req.session.user._id
  
  try {
    const bookings = await BookingModel.find({ employeeId: employee})
    
    
    // sort into previous and upcoming bookings
    const today = new Date();
    const prevBookings = []
    const activeBookings = []
    
    bookings.forEach(booking => {
      const carDetails = Car.findById(booking.carId)
      return carDetails
      .then((car) => {
        console.log(car);
        booking.car = car
      }).catch(err => {
        console.log("didnt work");
      })
      
      if(booking.endDate >= today){
        activeBookings.push(booking)
      } else {
        prevBookings.push(booking)
      }
    })

    res.render("cars/reservations", {activeBookings, prevBookings, moment, carDetails})
  } catch (error) {
    console.log("Bookings couldn't be found");
  }
})


/* CANCEL RESERVATION */
router.get("/reservations/delete/:id", async (req, res, next) => {
  console.log(req.params);
  try {
    const bookingData = await BookingModel.findByIdAndDelete({_id: req.params.id})
    res.redirect("/cars/reservations")
  } catch (error) {
    console.log("Booking could not be cancelled");
  }
})


module.exports = router;


