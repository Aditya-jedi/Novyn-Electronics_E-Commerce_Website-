const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/',protect,admin, createProduct);
router.put('/:id',protect,admin, updateProduct);
router.delete('/:id',protect,admin,  deleteProduct);

module.exports = router;
