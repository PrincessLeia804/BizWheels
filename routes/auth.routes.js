const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

// GET sign-up page
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup")
})

// POST sign-up form
router.post("/signup", async (req, res, next) => {
  const payload = {...req.body}
  console.log('payload: ', payload);

  // delete and encrypt password
  delete payload.password

  const salt = bcrypt.genSaltSync(13)
  payload.passwordHash = await bcrypt.hashSync(req.body.password, salt)

  try {
    const newSignup = await UserModel.create(payload)
    res.render("user-profile", {username : newSignup.firstName})
  } catch (error) {
    console.log(error);
  }
})


module.exports = router;
