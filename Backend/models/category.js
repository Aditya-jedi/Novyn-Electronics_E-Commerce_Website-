// models/categoryModel.js
const mongoose = require("mongoose");

// Define the schema for the Category model
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Category model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;