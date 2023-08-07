const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");

const fileUploader = require("../config/cloudinary.config");

// route for creating project page
router.get("/create", (req, res) => {
  res.render("new-project");
});

//route for posting project
router.post(
  "/project/create",
  fileUploader.single("projectPhoto"),
  (req, res) => {
    const { projectName, projectDescription, projectLink, githubLink } =
      req.body;

    //const projectPhotoUrl = req.file.path
    Project.create({
      projectName,
      projectDescription,
      projectLink,
      githubLink,
      user: req.session.currentUser._id,
      projectPhoto: req.file.path,
    })
      .then((newlyCreatedProject) => {
        console.log(newlyCreatedProject);
        res.redirect("/logged-in");
      })

      .catch((error) =>
        console.log(`Error while creating a new project: ${error}`)
      );
  }
);

//route for getting project
router.get("/logged-in", (req, res) => {
  console.log("in route");
  Project.find()
    .then((allProjects) => {
      console.log(allProjects);
      res.render("logged-index", { allProjects });
    })
    .catch((err) => {
      console.log(err);
    });
});

//route for single project page
router.get("/:id", (req, res) => {
  console.log(req.params.id);
  Project.findById(req.params.id)
    .then((oneProject) => {
      res.render("project-details", oneProject);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Route For deleting Projects
router.post("/:id/delete", (req, res) => {
  const projectId = req.params.id;
  Project.findByIdAndRemove(projectId)
    .then(() => {
      res.redirect("/logged-in");
    })
    .catch((error) => {
      console.log(error);
    });
});

//Route for editing projects
router.get("/:id/edit", (req, res) => {
  console.log(req.params);
  Project.findById(req.params.id)
    .then((oneProjectToBeEdited) => {
      // console.log(oneMovieToBeEdited);
      res.render("edit-project", { oneProjectToBeEdited });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.get("/:id/edit", async (req, res) => {
//   try {
//     const oneProjectToBeEdited = await Project.findById(req.params.id);
//     res.render("edit-project", { oneProjectToBeEdited });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.post("/:id/edit", (req, res) => {
//   console.log("req.body");
//   console.log(req.body);
//   console.log("req.params");
//   console.log(req.params);

//   const { title, genre, plot, cast } = req.body;

//   Movie.findByIdAndUpdate(req.params.id, { title, genre, plot, cast })
//     .then((updatedMovie) => {
//       res.redirect("/movies");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

module.exports = router;
