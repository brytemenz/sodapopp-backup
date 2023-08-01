const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,

    },
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
     confirmPassword: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      // required: true,
    },
    userDescription: {
      type: String,
      // required: true,
    },
    course: {
      type: String,
      enum: ["Web Dev", "Data Analytics", "UX,UI", "Cybersecurity"]
    },
  
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
