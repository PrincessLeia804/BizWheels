const EmployeeModel = require("../models/Employee.model");

const router = require("express").Router();

// GET homepage
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("authentication/signup")
})

router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    const newSignup = await EmployeeModel.create(req.body)
    res.send("Success")
  } catch (error) {
    console.log(error);
  }
})


module.exports = router;
