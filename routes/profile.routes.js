const router = require("express").Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(13);

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

  /* ACCOUNT UPDATE */
router.get("/my-account/update", async (req, res) => {
  try {
    const userData = await UserModel.findById({_id: req.session.user._id})
    res.render("profiles/account-update", {user : userData})
  } catch (error) {
    console.log("Data couldn't be displayed");
  }
})


router.post("/my-account/update", async (req, res) => {
  const profileUpdate = req.body

  /* Password Check before update*/
  if(!profileUpdate.passwordHash){
    delete profileUpdate.passwordHash 
    delete profileUpdate.password

    // compare current passwords
  }else{
    const pwCheck = await UserModel.findById({_id: req.session.user._id})
    
    if(bcrypt.compareSync(profileUpdate.password, pwCheck.passwordHash)){
      profileUpdate.passwordHash = bcrypt.hashSync(profileUpdate.passwordHash, salt)
      delete profileUpdate.password 
      console.log('profileUpdate.passwordHash: ', profileUpdate.passwordHash);

    } else {
      res.redirect("/profile/my-account/update")
    }
  }
  
/* Update db entry */
  try {
    const userData = await UserModel.findByIdAndUpdate(
      {_id: req.session.user._id}, 
      {$set: profileUpdate},
      {new: true})

    res.redirect("/profile/my-account")
  } catch (error) {
    console.log("Data couldn't be displayed");
  }
})



  module.exports = router;