const router = require("express").Router();

// GET homepage
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
