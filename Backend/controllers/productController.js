const Product = require('../models/product');

// Get all products (populate category name) with optional pagination
const getAllProducts = async (req, res) => {
  try {
    const category = req.query.category;
    let query = Product.find().populate('category', 'name');

    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.where('category').equals(category);
    }

    // If limit=0 or not provided, fetch all products
    if (!req.query.limit || parseInt(req.query.limit) <= 0) {
      const products = await query;
      return res.json({ products });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;

    // Count total products
    let countQuery = Product.find();
    if (category && category !== 'all') {
      countQuery = countQuery.where('category').equals(category);
    }
    const total = await countQuery.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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
  try {
    const { name, price, description, category, stock } = req.body;
    const product = new Product({ name, price, description, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
