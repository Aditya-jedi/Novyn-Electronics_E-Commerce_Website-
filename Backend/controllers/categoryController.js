// controllers/categoryController.js
const Category = require("../models/category");
const Product = require("../models/product");
// @desc    Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, subcategories },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Step 1: Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 2: Find all products linked to this category
    const products = await Product.find({ category: categoryId })
      .populate("category", "name");

    // Step 3: Send the response
    res.json({
      category: category.name,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories with their products sorted per-category
// Supports: ?sortBy=name|price|createdAt|stock|random&order=asc|desc
exports.getCategoriesWithProducts = async (req, res) => {
  try {
    // Query params: sortBy (name|price|createdAt|stock|random), order (asc|desc)
    const { sortBy = 'random', order = 'asc' } = req.query;

    const allowedSorts = ['name', 'price', 'createdAt', 'stock', 'random'];
    const sortField = allowedSorts.includes(sortBy) ? sortBy : 'random';
    const sortOrder = order === 'desc' ? -1 : 1;

    const categories = await Category.find();

    // Fisher-Yates shuffle helper
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // For each category, fetch products belonging to it and sort or shuffle
    const results = await Promise.all(
      categories.map(async (cat) => {
        let productsQuery = Product.find({ category: cat._id }).populate('category', 'name');

        // If random, don't apply DB sort — fetch and shuffle in memory
        let products = await productsQuery;

        if (sortField === 'random') {
          products = shuffle(products);
        } else {
          products = await Product.find({ category: cat._id })
            .populate('category', 'name')
            .sort({ [sortField]: sortOrder });
        }

        return {
          _id: cat._id,
          name: cat.name,
          totalProducts: products.length,
          products,
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};