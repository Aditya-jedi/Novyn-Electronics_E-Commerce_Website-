require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

// ---------------------- CORS ----------------------
const cors = require('cors');

const corsOptions = {
  origin: ['https://novyn.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));

// ---------------- Middleware -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- API Routes --------------------
// Remove '/api' prefix
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/payments', paymentRoutes);
app.use('/seed', seedRoutes);



// ---------------- MongoDB & Start Server -------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
