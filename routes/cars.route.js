const express = require("express");
const router = express.Router();
const checkCarAvailability = require("../controllers/carAvailability");

router.get("/", (req, res) => {
  res.json("Cars index will be here");
});

router.get("/request", async (req, res) => {
  const today = new Date(); 
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  const availableCars = await checkCarAvailability(today, tomorrow);
  
  const startDate = today.toISOString().split('T')[0];
  const endDate = tomorrow.toISOString().split('T')[0];
  res.render('cars/car_request', { startDate, endDate, availableCars  });
  });

router.post("/request", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const availableCars = await checkCarAvailability(startDate, endDate);

    res.render("cars/car_request", {startDate, endDate, availableCars });
  } catch (error) {
    console.log("Error processing car request:", error);
    res.status(500).send("Error processing car request");
  }
});

module.exports = router;
