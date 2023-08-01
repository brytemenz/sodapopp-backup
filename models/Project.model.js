const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const projectSchema = new Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"

    },
    projectName: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
 
    projectPhoto: {
      type: String,
      // required: true,
    },
    projectDescription: {
      type: String,
      // required: true,
    },
    projectLink: {
        type: String,
        // required: true,

    },
    gitHubLink: {
        type: String,
        // required: true,

    },
    dateOfCreation: {
        type: Date,
        // required: true,

    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
  
      }],
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Project = model("Project", projectSchema);

module.exports = Project;
