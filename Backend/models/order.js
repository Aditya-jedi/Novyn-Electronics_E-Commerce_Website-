// models/orderModel.js

const mongoose = require("mongoose");
// Define the schema for the Order model
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    orderItems: [
      {
        product: {
          
          type: mongoose.Schema.Types.Mixed,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingInfo: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      phoneNumber: { type: String },
      email: { type: String },
    },
    paymentInfo: {
      razorpayId: { type: String },
      status: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
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

// Create and export the Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;