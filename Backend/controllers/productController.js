const Product = require('../models/product');

// Get all products (populate category name) with pagination and optional category filtering
const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category; // New: category filter from query params

  let query = Product.find().populate('category', 'name');

  // Apply category filter if provided and not 'all'
  if (category && category !== 'all') {
    query = query.where('category').equals(category);
  }

  // If limit is 0 or negative, return all products without pagination
  if (limit <= 0) {
    // Return all products
  } else {
    query = query.skip(skip).limit(limit);
  }

  const products = await query;

  // Count documents with the same filter applied
  let countQuery = Product.find();
  if (category && category !== 'all') {
    countQuery = countQuery.where('category').equals(category);
  }
  const total = await countQuery.countDocuments();
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

  res.json({
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts: total,
      hasNext: limit > 0 && page < totalPages,
      hasPrev: limit > 0 && page > 1
    }
  });
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  const product = new Product({ name, price, description, category, stock });
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
};

// Update product
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

// Delete product
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};