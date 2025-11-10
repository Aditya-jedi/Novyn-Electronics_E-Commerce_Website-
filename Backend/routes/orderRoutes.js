const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/authMiddleware");

// Create new order (User)
router.post("/",protect,createOrder);

// Get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// Get all orders (Admin)
router.get("/", protect, admin, getAllOrders);

// Get single order by ID (User/Admin)
router.get("/:id", protect, getOrderById);

// Update order to paid
router.put("/:id/pay", protect, updateOrderToPaid);

// Update order to delivered (Admin)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

module.exports = router;