const Order = require("../models/order");
const Razorpay = require('razorpay');
const Payment = require("../models/payment");

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

// Create new order
exports.createOrder = async (req, res) => {
  try {
    console.log("👉 Incoming Order Data:", req.body);      
    console.log("🧍 Authenticated User:", req.user); // Add this
    const {
      orderItems,
      shippingInfo,
      paymentInfo,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const order = await Order.create({
  user: req.user._id, // ✅ Correct
  orderItems,
  shippingInfo,
  paymentInfo,
  totalPrice,
});

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    // Fetch Razorpay payment details for each order
    const ordersWithPaymentDetails = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        if (order.paymentInfo?.razorpayId && razorpay) {
          try {
            const payment = await razorpay.payments.fetch(order.paymentInfo.razorpayId);
            orderObj.razorpayPayment = {
              id: payment.id,
              status: payment.status,
              method: payment.method,
              amount: payment.amount / 100, // Convert from paise to rupees
              currency: payment.currency,
              created_at: payment.created_at,
              email: payment.email,
              contact: payment.contact,
            };
          } catch (err) {
            console.error('Error fetching Razorpay payment details:', err);
            orderObj.razorpayPayment = null;
          }
        } else {
          orderObj.razorpayPayment = null;
        }
        return orderObj;
      })
    );

    res.status(200).json({ success: true, orders: ordersWithPaymentDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    // Fetch Razorpay payment details for each order
    const ordersWithPaymentDetails = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        if (order.paymentInfo?.razorpayId && razorpay) {
          try {
            const payment = await razorpay.payments.fetch(order.paymentInfo.razorpayId);
            orderObj.razorpayPayment = {
              id: payment.id,
              status: payment.status,
              method: payment.method,
              amount: payment.amount / 100, // Convert from paise to rupees
              currency: payment.currency,
              created_at: payment.created_at,
              email: payment.email,
              contact: payment.contact,
            };
          } catch (err) {
            console.error('Error fetching Razorpay payment details:', err);
            orderObj.razorpayPayment = null;
          }
        } else {
          orderObj.razorpayPayment = null;
        }
        return orderObj;
      })
    );

    res.status(200).json({ success: true, orders: ordersWithPaymentDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update order to Paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paymentInfo.status = "Paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as paid",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update order to Delivered (Admin only)
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};