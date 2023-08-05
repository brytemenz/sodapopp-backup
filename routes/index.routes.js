const express = require("express");
const Project = require("../models/Project.model");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/logged-in", (req, res, next) => {
  const username = req.session.currentUser;
  Project.find({user:username._id})
  .then((allProjects)=> {
    res.render ('logged-index', {username, allProjects})
  })

});
module.exports = router;
