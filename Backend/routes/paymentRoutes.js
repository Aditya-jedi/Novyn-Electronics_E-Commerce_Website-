const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

// Create an order
// Expects JSON body: { amount: <number in rupees>, currency?: 'INR', receipt?: string }
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid or missing amount' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('create-order error', err);
    return res.status(500).json({ error: 'Could not create order', details: err.message });
  }
});

// Verify payment signature
// Expects JSON body: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
router.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment verification parameters' });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      // Persist payment record
      const Payment = require('../models/payment');
      // amount was not sent here from Razorpay response; optionally client may send order amount
      const amount = req.body.amount || 0;
      const payment = new Payment({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount,
        currency: req.body.currency || 'INR',
        status: 'paid',
      });
      await payment.save();
      // If an orderId was provided, attach payment and mark order as paid
      if (req.body.orderId) {
        try {
          const Order = require('../models/order');
          const Product = require('../models/product');
          const order = await Order.findById(req.body.orderId);
          if (order) {
            order.isPaid = true;
            order.paymentInfo = {
              razorpayId: razorpay_payment_id,
              status: 'Paid',
            };
            await order.save();

            // reduce product stock
            for (const item of order.orderItems || []) {
              try {
                const prodId = item.product;
                if (prodId) {
                  await Product.findByIdAndUpdate(prodId, { $inc: { stock: -Math.max(0, item.quantity || 0) } });
                }
              } catch (e) {
                console.error('Failed to decrement stock for', item, e);
              }
            }
          }
        } catch (e) {
          console.error('Failed to attach payment to order', e);
        }
      }

      return res.json({ success: true, message: 'Payment verified and saved', paymentId: payment._id });
    } catch (err) {
      console.error('Error saving payment', err);
      return res.status(500).json({ success: false, error: 'Payment verified but failed to save' });
    }
  }

  return res.status(400).json({ success: false, error: 'Invalid signature sent!' });
});

module.exports = router;