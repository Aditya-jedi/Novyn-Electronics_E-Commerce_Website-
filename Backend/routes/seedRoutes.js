const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

// Simple seed endpoint to populate sample products for development.
// GET /api/seed?count=50
router.get('/', async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 50;
    const existing = await Product.countDocuments();
    if (existing >= count) {
      return res.json({ message: `DB already has ${existing} products` });
    }

    const sample = [];
    // richer set of categories
    const categories = [
      'Electronics',
      'Apparel',
      'Home',
      'Books',
      'Toys',
      'Accessories',
      'Beauty',
      'Sports',
      'Outdoors',
      'Automotive',
      'Groceries',
      'Health',
      'Garden',
      'Office',
      'Pets'
    ];

    // ensure Category documents exist and map names -> ids
    const categoryDocs = {};
    for (const name of categories) {
      let doc = await Category.findOne({ name });
      if (!doc) doc = await Category.create({ name });
      categoryDocs[name] = doc._id;
    }

    for (let i = 1; i <= count; i++) {
      // ensure unique-ish prices by adding index offset
      const basePrice = Math.floor(Math.random() * 20000) + 100;
      const catName = categories[i % categories.length];
      sample.push({
        name: `Sample Product ${i}`,
        price: basePrice + i,
        description: `This is a description for Sample Product ${i}`,
        category: categoryDocs[catName],
        stock: Math.floor(Math.random() * 100),
      });
    }

    await Product.insertMany(sample);
    return res.json({ message: `Inserted ${count} sample products` });
  } catch (err) {
    console.error('Seed error', err);
    return res.status(500).json({ error: 'Failed to seed products', details: err.message });
  }
});

module.exports = router;

// Helper to ensure default category documents exist (dev only)
router.get('/create-categories', async (req, res) => {
  try {
    const categories = [
      'Electronics', 'Apparel', 'Home', 'Books', 'Toys', 'Accessories',
      'Beauty', 'Sports', 'Outdoors', 'Automotive', 'Groceries', 'Health',
      'Garden', 'Office', 'Pets'
    ];
    const created = [];
    for (const name of categories) {
      let doc = await Category.findOne({ name });
      if (!doc) {
        doc = await Category.create({ name });
        created.push(name);
      }
    }
    return res.json({ message: 'Categories ensured', created });
  } catch (err) {
    console.error('create-categories error', err);
    return res.status(500).json({ error: 'Failed to create categories', details: err.message });
  }
});

// Development helper: drop price index if exists
router.get('/reset-index', async (req, res) => {
  try {
    const indexes = await Product.collection.indexes();
    const hasPriceIndex = indexes.some((idx) => idx.key && idx.key.price === 1);
    if (hasPriceIndex) {
      await Product.collection.dropIndex('price_1');
      return res.json({ message: 'Dropped price_1 index' });
    }
    return res.json({ message: 'price_1 index not present' });
  } catch (err) {
    console.error('reset-index error', err);
    return res.status(500).json({ error: 'Failed to reset index', details: err.message });
  }
});

  // Development helper: merge any 'undefined' category into 'Uncategorized'
  router.get('/cleanup-undefined-category', async (req, res) => {
    try {
      const undefinedCat = await Category.findOne({ name: /^undefined$/i });
      if (!undefinedCat) return res.json({ message: 'No undefined category found', affected: 0 });

      const uncategorized = await Category.findOne({ name: /^Uncategorized$/i }) || await Category.create({ name: 'Uncategorized' });

      const result = await Product.updateMany({ category: undefinedCat._id }, { $set: { category: uncategorized._id } });

      // remove the undefined category document
      await Category.findByIdAndDelete(undefinedCat._id);

      return res.json({ message: 'Merged undefined into Uncategorized', affected: result.modifiedCount || result.nModified || result.modified || 0 });
    } catch (err) {
      console.error('cleanup-undefined-category error', err);
      return res.status(500).json({ error: 'Cleanup failed', details: err.message });
    }
  });

// Development helper: migrate products whose category field is a string (name)
// to reference the Category._id. Creates missing Category documents.
router.get('/migrate-product-categories', async (req, res) => {
  try {
    // Fetch all products and normalize category field to ObjectId pointing to Category
    const products = await Product.find();

    if (!products.length) {
      return res.json({ message: 'No products found', updated: 0 });
    }

    const createdCategories = new Set();
    let updated = 0;
    const errors = [];

    const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');

    // Ensure we have an 'Uncategorized' fallback
    let uncategorized = await Category.findOne({ name: /^Uncategorized$/i });
    if (!uncategorized) {
      uncategorized = await Category.create({ name: 'Uncategorized' });
      createdCategories.add('Uncategorized');
    }

    for (const p of products) {
      try {
        const catField = p.category;

        // If already an ObjectId (or string that looks like ObjectId) and matches an existing Category, skip
        let needUpdate = false;
        let targetCat = null;

        // If category is missing or null -> assign Uncategorized
        if (!catField) {
          targetCat = uncategorized;
          needUpdate = true;
        } else if (typeof catField === 'string') {
          // string could be a name or an id; try to detect ObjectId format
          const maybeId = catField;
          const isHex24 = /^[0-9a-fA-F]{24}$/.test(maybeId);
          if (isHex24) {
            const found = await Category.findById(maybeId);
            if (found) {
              // already valid id
              continue;
            }
          }

          const name = maybeId.trim();
          if (!name) {
            targetCat = uncategorized;
          } else {
            const regex = new RegExp(`^${escapeForRegex(name)}$`, 'i');
            let cat = await Category.findOne({ name: regex });
            if (!cat) {
              cat = await Category.create({ name });
              createdCategories.add(name);
            }
            targetCat = cat;
          }
          needUpdate = true;
        } else if (typeof catField === 'object') {
          // Could be a populated object { _id, name } or some nested object
          if (catField._id) {
            const found = await Category.findById(catField._id);
            if (found) {
              // If stored as object with _id but product schema expects ObjectId, replace with id
              p.category = found._id;
              await p.save();
              updated += 1;
              continue;
            }
          }

          const name = (catField.name || String(catField).trim() || '').trim();
          if (!name) {
            targetCat = uncategorized;
          } else {
            const regex = new RegExp(`^${escapeForRegex(name)}$`, 'i');
            let cat = await Category.findOne({ name: regex });
            if (!cat) {
              cat = await Category.create({ name });
              createdCategories.add(name);
            }
            targetCat = cat;
          }
          needUpdate = true;
        }

        if (needUpdate && targetCat) {
          p.category = targetCat._id;
          await p.save();
          updated += 1;
        }
      } catch (err) {
        errors.push({ productId: p._id, error: err.message });
      }
    }

    return res.json({ message: 'Migration complete', updated, createdCategories: Array.from(createdCategories), errors });
  } catch (err) {
    console.error('migrate-product-categories error', err);
    return res.status(500).json({ error: 'Migration failed', details: err.message });
  }
});

// Development helper: convert any categories whose name is a 24-hex string (bad) into 'Uncategorized'
router.get('/cleanup-hexname-categories', async (req, res) => {
  try {
    const hexRegex = /^[0-9a-fA-F]{24}$/;
    const badCats = await Category.find({ name: { $regex: hexRegex } });
    if (!badCats.length) return res.json({ message: 'No hex-name categories found', affected: 0 });

    let uncategorized = await Category.findOne({ name: /^Uncategorized$/i });
    if (!uncategorized) {
      uncategorized = await Category.create({ name: 'Uncategorized' });
    }

    let affected = 0;
    for (const cat of badCats) {
      const result = await Product.updateMany({ category: cat._id }, { $set: { category: uncategorized._id } });
      affected += result.modifiedCount || result.nModified || result.modified || 0;
      await Category.findByIdAndDelete(cat._id);
    }

    return res.json({ message: 'Cleaned hex-name categories', affected });
  } catch (err) {
    console.error('cleanup-hexname-categories error', err);
    return res.status(500).json({ error: 'Cleanup failed', details: err.message });
  }
});