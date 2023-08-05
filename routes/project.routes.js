const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require('../models/Project.model');

const fileUploader = require('../config/cloudinary.config');

//... all the routes stay unchanged
// route for creating project page
router.get('/create', (req,res)=> {
    res.render("new-project")
})
//route for posting project
router.post('/project/create', fileUploader.single('projectPhoto'), (req, res) => {
    const {projectName, projectDescription, projectLink, githubLink } = req.body;
   //const projectPhotoUrl = req.file.path
    Project.create({ projectName, projectDescription, projectLink, githubLink, user:req.session.currentUser._id, imageUrl:req.file.path })
      .then(newlyCreatedProject => {
        console.log(newlyCreatedProject);
        res.redirect("/logged-in")

      })
   
      .catch(error => console.log(`Error while creating a new project: ${error}`));
  });
   //route for getting project
  
   router.get("/logged-in", (req, res) => {
    console.log("in route")
    Project.find()
      .then((allProjects) => {
        console.log(allProjects)
        res.render("logged-index", { allProjects });
      })
      .catch((err) => {
        console.log(err);
      });
  });
//    router.get('/logged-in', (req,res)=> {
//    Project.find()
//    .then((allProjects)=>{
//     console.log(allProjects)
//     res.render("/logged-index",{allProjects})
//    })
//    .catch(error => console.log(`Error while getting a new project: ${error}`));

// })

module.exports = router