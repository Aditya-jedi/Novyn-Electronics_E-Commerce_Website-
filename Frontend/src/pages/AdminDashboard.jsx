import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", category: "", stock: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        authFetch("/api/products?limit=-1"),
        authFetch("/api/orders"),
        fetch("/api/categories")
      ]);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch data");
    }
    setLoading(false);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const product = await res.json();
        setProducts([...products, product]);
        setNewProduct({ name: "", price: "", description: "", category: "", stock: "" });
        toast.success("Product created");
      } else {
        toast.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`/api/products/${editingProduct._id}`, {
        method: "PUT",
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditingProduct(null);
        toast.success("Product updated");
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await authFetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const handleUpdateOrderStatus = async (id) => {
    try {
      const res = await authFetch(`/api/orders/${id}/deliver`, { method: "PUT" });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o._id === id ? updatedOrder : o));
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Error updating order");
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">
            <span className="admin-icon">🛍️</span>
            Novyn Admin Dashboard
          </h1>
          <p className="admin-subtitle">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{orders.filter(o => o.isDelivered).length}</div>
            <div className="stat-label">Delivered Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              ₹{orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toLocaleString()}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
          </div>

          {activeTab === "products" && (
            <div className="products-section">
              <h2>Manage Products</h2>

              <form className="admin-form" onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, stock: e.target.value}) : setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? "Update" : "Create"} Product
                  </button>
                  {editingProduct && (
                    <button type="button" className="btn btn-ghost" onClick={() => setEditingProduct(null)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {products.length === 0 ? (
                <div className="empty-state">
                  <h3>No products found</h3>
                  <p>Add your first product above</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name}
                            className="product-image"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.stock || 0}</td>
                        <td>
                          <button
                            className="action-btn edit"
                            onClick={() => setEditingProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-section">
              <h2>Manage Orders</h2>

              {orders.length === 0 ? (
                <div className="empty-state">
                  <h3>No orders found</h3>
                  <p>Orders will appear here when customers make purchases</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Payment Status</th>
                      <th>Delivery Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8)}</td>
                        <td>{order.user === null ? 'Guest' : (order.user?.name || 'Unknown')}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          {order.razorpayPayment ? (
                            <span className={`status-badge ${order.razorpayPayment.status === 'captured' ? 'status-delivered' : 'status-pending'}`}>
                              {order.razorpayPayment.status} ({order.razorpayPayment.method})
                            </span>
                          ) : (
                            <span className={`status-badge ${order.isPaid ? 'status-delivered' : 'status-pending'}`}>
                              {order.isPaid ? 'Paid' : 'Not Paid'}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${order.isDelivered ? 'status-delivered' : 'status-pending'}`}>
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          {!order.isDelivered && (
                            <button
                              className="action-btn deliver"
                              onClick={() => handleUpdateOrderStatus(order._id)}
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;