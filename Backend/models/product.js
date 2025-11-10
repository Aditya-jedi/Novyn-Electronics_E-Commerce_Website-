const mongoose = require('mongoose');
// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field must be provided
  },
  price: {
    type: Number,
    required: true,
    // unique price removed to allow realistic seeding and duplicate prices
  },
  description: {
    type: String,
  },
  category: {
     type: mongoose.Schema.Types.ObjectId,  // 👈 This links to Category
    ref: "Category",
    required: true,
  },
  image:{
    type: String,  // URL to the product image
    // required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
 rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;