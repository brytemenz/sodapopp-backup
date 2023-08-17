const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");

const transporter = require("../middleware/emailTransporter");

const fileUploader = require("../config/cloudinary.config");
const isLoggedIn = require("../middleware/isLoggedIn");

// route for creating project page
router.get("/create", isLoggedIn, (req, res) => {
  res.render("new-project");
});

//route for posting project
router.post(
  "/project/create",
  fileUploader.single("projectPhoto"),
  (req, res) => {
    const { projectName, projectDescription, projectLink, githubLink } =
      req.body;

    //const projectPhoto = req.file.path
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

router.post("/:id/edit", fileUploader.single("projectPhoto"), (req, res) => {
  console.log("req.body");
  console.log(req.body);
  console.log("req.params");
  console.log(req.params);

  const { projectName, projectDescription, projectLink, githubLink } = req.body;

  Project.findByIdAndUpdate(req.params.id, {
    projectName,
    projectDescription,
    projectLink,
    githubLink,
    user: req.session.currentUser._id,
    projectPhoto: req.file.path,
  })
    .then((updatedProject) => {
      res.redirect("/logged-in");
    })
    .catch((err) => {
      console.log(err);
    });
});

//collaborate route
router.post("/collaborate", async (req, res) => {
  try {
    const { collaboratorName, githubUsername, collaborationMessage } = req.body;

    const mailOptions = {
      from: "sodapopp40@gmail.com",
      to: req.session.currentUser.email,
      subject: `${collaboratorName} wants to work on your project!`,
      text: `Hi! I am ${collaboratorName} and my github username is ${githubUsername}\n I saw your project on Sodapopp! and ${collaborationMessage}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.redirect("/logged-in");
  } catch (error) {
    console.error("Error sending email:", error);

    res
      .status(500)
      .render("error", { error: "Error sending collaboration request." });
  }
});

//route for likes
router.post("/:id/like", (req, res) => {
  const projectId = req.params.id;
  const userId = req.session.currentUser._id;
  Project.findById(projectId)
    .then((project) => {
      res.redirect(`/project/${projectId}`);
      // res.redirect('/logged-in')
      const userLiked = project.likes.includes(userId);
      if (userLiked) {
        project.likes.pull(userId);
      } else {
        project.likes.push(userId);
      }
      return project.save();
    })
    .then(() => {
      res.redirect(`/project/${projectId}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

//route for comments
router.post("/comment", (req, res) => {
  const { commentBody, projectId } = req.body;
  // const {projectId} = req.params

  const userId = req.session.currentUser._id;
  console.log(req.session.currentUser);
  Project.findByIdAndUpdate(projectId, {
    $push: { comments: { user: req.session.currentUser, commentBody } },
  })
    .then((project) => {
      res.redirect(`/project/${projectId}`);

      // project.comments.push({
      //   text: commentBody,
      //   user: req.session.currentUser._id

      // })
      // return project.save();
    })

    .catch((err) => {
      console.log(err);
    });
});

// search (to be done);
router.get("/search", (req, res) => {
  const query = req.query.id;
  Project.find({ projectName: { $regex: query, $options: "i" } })
    .then((projects) => {
      res.render("searched-project", { projects, query });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/logged-in");
    });
});

module.exports = router;
