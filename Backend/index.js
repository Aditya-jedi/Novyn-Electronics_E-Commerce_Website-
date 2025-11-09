require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

// ---------------------- CORS ----------------------
app.use(cors({
  origin: ["https://novyn.netlify.app","http://localhost:5173"], //
  methods: ["GET", "POST", "PUT", "DELETE"],

  credentials: true
}));
// ---------------- Middleware -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- API Routes --------------------
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
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
