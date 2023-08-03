const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/logged-in", (req, res, next) => {
  res.render("logged-index");
});
module.exports = router;
