const router = require("express").Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

/* SIGN UP */

// GET sign-up page
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup")
})

// POST sign-up form
router.post("/signup", async (req, res, next) => {
  const payload = { ...req.body }

  // delete and encrypt password
  delete payload.password

  const salt = bcrypt.genSaltSync(13)
  payload.passwordHash = bcrypt.hashSync(req.body.password, salt)

  try {
    // create new user in the DB
    const newSignup = await UserModel.create(payload)

    // create admin
    if(newSignup.email === "admin@bw.com"){
      await UserModel.findByIdAndUpdate(newSignup.id, {role: "admin"})
    }
    req.session.user = newSignup
    res.redirect("/profile")
  } catch (error) {
    console.log(error);
  }
})


/* SIGN IN */

router.get("/login", (req, res, next) => {
  res.render("authentication/login")
})

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body

  try {
    const exisitingUser = await UserModel.findOne({ email: email.toLowerCase() })

    // if user exists
    if (exisitingUser) {
      if (bcrypt.compareSync(password, exisitingUser.passwordHash)) {
        // Password correct
        const loggedUser = { ...exisitingUser._doc }
        delete loggedUser.passwordHash

        req.session.user = loggedUser
        
        // check role and redirect to user / admin-dashboard
        if(loggedUser.role === "admin"){
          // TODO: Not changing URL
          res.render("profiles/admin-profile")
        }else{
        res.redirect("profiles/user-profile")
        }

      } else {
        // Password incorrect
        console.log("A combination of the entered data cannot be found")
        res.render("authentication/login", {
          errorMessage: "A combination of the entered data cannot be found",
          prevUsername: { user: exisitingUser.username }
        })
      }
    } else {
      // User does not exist
      console.log(' "The combination does not match any entries": ',  "The combination does not match any entries");
      res.render("authentication/login", {
        errorMessage: "The combination does not match any entries",
        prevUsername: { user: userExists.username }
      })
    }
  } catch (err) {
    console.log("An error occured")
  }
})

/* SIGN OUT */
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err)
    res.render("authentication/logout")
  })
})

module.exports = router;
