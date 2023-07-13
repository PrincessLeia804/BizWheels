  const express = require('express');
  const router = express.Router();
  //const checkCarAvailability = require('../controllers/carAvailability');
  
  router.get('/', (req, res) => {
    res.json("Cars index will be here");
  });

  router.get('/request', (req, res) => {
    res.render('cars/car_request');
  });
  
 router.post('/request', async (req, res) => {
   const { date, time, duration } = req.body;
   const endTime = new Date(new Date(`${date}T${time}`).getTime() + duration * 60 * 60 * 1000);
 
   try {
     // Check car availability for the requested date, time, and duration
     const availableCars = await checkCarAvailability(date, time, endTime.toISOString().substring(11, 16));
  
     // Render the appropriate view based on availability
     if (availableCars.length > 0) {
       res.render('car_request', { availableCars });
     } else {
       res.render('no_cars_available');
     }
   } catch (error) {
     console.log('Error processing car request:', error);
     res.status(500).send('Error processing car request');
   }
 });
  
  module.exports = router;
