const router = require("express").Router();
const UserModel = require('../models/User.model');

/* USER DASHBOARD */
router.get("/", (req, res, next) => {
      res.render("profiles/user-profile", {userInSession: req.session.user})
  })
  
  /* ACCOUNT DETAILS */
  router.get("/my-account", async(req, res, next) => {
    try {
      const userData = await UserModel.findOne({email: req.session.user.email})
      res.render("profiles/account", {user : userData})
    } catch (error) {
      console.log("Data couldn't be displayed");
    }
  })

  // TODO: get route my-account/update and history, connect to reserve cars

  module.exports = router;