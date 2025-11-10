const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  getCategoriesWithProducts,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/", admin, protect, createCategory); // Create a new category (admin only)
// Public category listing for frontend filters
router.get("/", getAllCategories); // Get all categories (public)
// Get all categories with their products (sorted per-category). Query: ?sortBy=name|price|createdAt|stock&order=asc|desc
router.get('/with-products', getCategoriesWithProducts);
router.get("/:id", getCategoryById); // Get single category by ID (public)
router.put("/:id", admin, protect, updateCategory); // Update category (admin)
router.delete("/:id", admin, protect, deleteCategory); // Delete category (admin)
router.get("/:id/products", getProductsByCategory); // Get products by category ID (public)
module.exports = router;