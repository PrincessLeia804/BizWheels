const express = require("express");
const router = express.Router();
const {checkCarAvailability, carRequested} = require("../controllers/carsController");
const { isLoggedIn } = require("../middleware/route-guard");

router.get("/", (req, res) => {
  res.json("Cars index will be here");
});

router.get("/request", isLoggedIn, async (req, res) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const availableCars = await checkCarAvailability(today, tomorrow);

  const startDate = today.toISOString().split("T")[0];
  const endDate = tomorrow.toISOString().split("T")[0];
  res.render("cars/car_request", { startDate, endDate, availableCars });
});

router.post("/request", isLoggedIn, async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const availableCars = await checkCarAvailability(startDate, endDate);

    res.render("cars/car_request", { startDate, endDate, availableCars });
  } catch (error) {
    console.log("Error processing car request:", error);
    res.status(500).send("Error processing car request");
  }
});

router.post('/submit-request', isLoggedIn, async function(req, res) {
  const { startDate, endDate, carId } = req.body;
console.log(req.body)
  try{
    const car = await carRequested(carId);
    console.log(car);
    res.render ("cars/confirmation", {startDate, endDate, car});
  }
  catch (error) {
    console.log("Error fetching car information:", error);
    res.status(500).send("Error fetching car information");
  }
  
});

module.exports = router;
