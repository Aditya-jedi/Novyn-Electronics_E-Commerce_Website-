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
router.post('/',protect,admin, createProduct);//add admin and protect middlewares after testing
router.put('/:id',protect,admin, updateProduct);//add admin and protect middlewares after testing
router.delete('/:id',protect,admin,  deleteProduct);//add admin and protect middlewares after testing

module.exports = router;
