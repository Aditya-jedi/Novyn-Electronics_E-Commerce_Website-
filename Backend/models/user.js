// models/userModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // This field must be provided
    },
    email: {
      type: String,
      required: true,
      unique: true, // Each email must be unique
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to Product model
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare password during login
// userSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password);
// };
// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;