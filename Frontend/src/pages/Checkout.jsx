import React, { useState, useContext } from "react";
import { toast } from '../utils/toast';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Checkout() {
  // payment amount is derived from the cart total; remove manual entry
  const [loading, setLoading] = useState(false);
  const { cartItems, clearCart, getTotalPrice } = useContext(CartContext);
  const { authFetch } = useAuth();

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ok = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!ok) {
      // show non-blocking toast
      toast.error("Failed to load Razorpay SDK. Check your connection.");
      setLoading(false);
      return;
    }

    // Create an Order in our backend first (guest endpoint)
    try {
      const orderItems = (cartItems || []).map((it) => ({
        product: it._id || it.id || it.name,
        quantity: it.quantity || 1,
        price: it.price,
      }));
      const total = getTotalPrice();
      if (!total || Number(total) <= 0) {
        toast.error('Your cart is empty. Add items before paying.');
        setLoading(false);
        return;
      }

      const createOrderRes = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({ orderItems, shippingInfo: {}, paymentInfo: {}, totalPrice: total }),
      });
      const createOrderData = await createOrderRes.json();
      if (!createOrderRes.ok) throw new Error(createOrderData.error || 'Order creation failed');
      const ourOrder = createOrderData.order;

      // Create Razorpay order on server and pass our order id as receipt
      const payRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, receipt: ourOrder._id }),
      });
      const orderData = await payRes.json();
      if (!payRes.ok) throw new Error(orderData.error || 'Payment order creation failed');

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'My Store',
        description: 'Order payment',
        order_id: orderData.id,
        handler: async function (response) {
          const payload = {
            ...response,
            amount: Math.round(Number(total) * 100),
            currency: orderData.currency,
            orderId: ourOrder._id,
          };

          const verifyRes = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            toast.success('Payment successful and verified.');
            // mark order as paid on our side (redundant if backend handled it)
            try {
              await fetch(`/api/orders/${ourOrder._id}/pay`, { method: 'PUT' });
            } catch (err2) {
              console.error('Failed to call order pay endpoint', err2);
            }
            clearCart();
          } else {
            toast.error('Payment failed verification: ' + (verifyData.error || 'Unknown error'));
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#3399cc' },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment initialization failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Checkout</h1>
      <form onSubmit={handlePay}>
        <div style={{ marginBottom: 12 }}>
          <strong>Total (INR): </strong> ₹{getTotalPrice() || 0}
        </div>

        <button type="submit" disabled={loading || !getTotalPrice()}>
          {loading ? 'Processing...' : 'Pay now'}
        </button>
      </form>
      <div className="test-payment-instructions">
        <strong>Test payment instructions (Razorpay test mode)</strong>
        <p>
           When the Razorpay checkout opens, use the following test card details to simulate a successful payment:
        </p>
        <ul>
          <li>Card number: <code>2305 3242 5784 8228 (Mastercard) , 4386 2894 0766 0153 (Visa) </code></li>
          <li>Expiry: any future date (e.g. <code>12/25</code>)</li>
          <li>CVV: any 3-digit value (e.g. <code>123</code>)</li>
          <li>OTP (if prompted): <code>1234</code></li>
        </ul>
        <p className="note">
          Note: For PCI safety we cannot prefill or auto-submit card numbers. Prefill only supports name/email/contact. Enter the test card values into the checkout to complete a successful test payment.
        </p>
      </div>
    </div>
  );
}

export default Checkout;