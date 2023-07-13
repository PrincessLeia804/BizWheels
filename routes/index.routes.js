const router = require("express").Router();

/* HOMEPAGE */
router.get("/", (req, res, next) => {
  res.render("index");
});


/* USER DASHBOARD */
router.get("/profile", (req, res, next) => {
  if(!req.session.user){
    res.redirect("/auth/login")
  } else{
    res.render("user-profile", {userInSession: req.session.user})
  }
})



module.exports = router;
