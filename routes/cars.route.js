const express = require("express");
const router = express.Router();
const checkCarAvailability = require("../controllers/carAvailability");

router.get("/", (req, res) => {
  res.json("Cars index will be here");
});

router.get("/request", (req, res) => {
  res.render("cars/car_request", { availableCars: null });
});

router.post("/request", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const availableCars = await checkCarAvailability(startDate, endDate);

    res.render("cars/car_request", { availableCars: availableCars });
  } catch (error) {
    console.log("Error processing car request:", error);
    res.status(500).send("Error processing car request");
  }
});

module.exports = router;
