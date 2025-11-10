import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';
import './Orders.css';

const Orders = () => {
  const { authFetch } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await authFetch('/api/orders/myorders');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || data.error || 'Failed to fetch orders');
        }
        const data = await res.json();
        if (mounted) setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
        toast.error('Could not load your orders');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [authFetch]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.orderItems || []).some(item =>
          (item.product?.name || item.product || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'paid' && order.isPaid) ||
        (filterStatus === 'pending' && !order.isPaid);

      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-desc':
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        case 'amount-asc':
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        case 'status':
          if (a.isPaid === b.isPaid) return 0;
          return a.isPaid ? 1 : -1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, filterStatus, sortBy]);

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getPaymentStatusClass = (isPaid) => {
    return isPaid ? 'paid' : 'pending';
  };

  const getPaymentStatusText = (order) => {
    if (order.razorpayPayment) {
      return `${order.razorpayPayment.status} (${order.razorpayPayment.method || 'Unknown'})`;
    }
    if (order.isPaid) {
      return order.paymentInfo?.status || 'Paid';
    }
    return 'Not Paid';
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-state">
          <div className="loading-text">Loading your orders...</div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="empty-state">
          <h2 className="empty-title">No Orders Yet</h2>
          <p className="empty-message">You haven't placed any orders yet. Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Your Orders</h1>
        <div className="controls-section">
          <input
            type="text"
            placeholder="Search orders or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="paid">Paid Orders</option>
            <option value="pending">Pending Payment</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="status">Payment Status</option>
          </select>
        </div>
      </div>

      <div className="orders-grid">
        {filteredAndSortedOrders.map((order) => (
          <div
            key={order._id}
            className={`order-card ${expandedOrders.has(order._id) ? 'expanded' : ''}`}
            onClick={() => toggleOrderExpansion(order._id)}
          >
            <div className="order-header">
              <div>
                <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="order-status-section">
                <p className="order-total">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</p>
                <span className={`payment-status ${getPaymentStatusClass(order.isPaid)}`}>
                  {getPaymentStatusText(order)}
                </span>
              </div>
            </div>

            {expandedOrders.has(order._id) && (
              <div className="order-details">
                <div className="items-section">
                  <h4 className="items-title">Order Items</h4>
                  <ul className="items-list">
                    {(order.orderItems || []).map((item, index) => (
                      <li key={index} className="item-row">
                        <span className="item-name">
                          {(item.product && item.product.name) || item.product || 'Product'}
                        </span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">₹{item.price.toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.razorpayPayment && (
                  <div className="payment-section">
                    <h4 className="payment-title">Payment Details</h4>
                    <div className="payment-details">
                      <div>Payment ID: {order.razorpayPayment.id}</div>
                      <div>Status: {order.razorpayPayment.status}</div>
                      <div>Method: {order.razorpayPayment.method}</div>
                      <div>Amount: ₹{order.razorpayPayment.amount.toLocaleString('en-IN')}</div>
                      {order.razorpayPayment.email && <div>Email: {order.razorpayPayment.email}</div>}
                      {order.razorpayPayment.contact && <div>Contact: {order.razorpayPayment.contact}</div>}
                    </div>
                  </div>
                )}

                {order.shippingInfo && (
                  <div className="shipping-section">
                    <h4 className="shipping-title">Shipping Address</h4>
                    <div className="shipping-details">
                      {order.shippingInfo.address && <div>{order.shippingInfo.address}</div>}
                      {order.shippingInfo.city && <div>{order.shippingInfo.city}</div>}
                      {order.shippingInfo.postalCode && <div>PIN: {order.shippingInfo.postalCode}</div>}
                      {order.shippingInfo.phoneNumber && <div>Phone: {order.shippingInfo.phoneNumber}</div>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="expand-toggle">
              <span>{expandedOrders.has(order._id) ? 'Show Less' : 'Show Details'}</span>
              <span className="expand-icon">▼</span>
            </button>
          </div>
        ))}
      </div>

      {filteredAndSortedOrders.length === 0 && orders.length > 0 && (
        <div className="empty-state">
          <p className="empty-message">No orders match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;