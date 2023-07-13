const router = require("express").Router();

/* HOMEPAGE */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
