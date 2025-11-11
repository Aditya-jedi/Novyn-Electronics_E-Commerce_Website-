import React, { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from '../utils/toast';
import './ProductCard.css';

function ProductCard({ product, addToCart: addToCartProp }) {
  const cartCtx = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCart = addToCartProp || (cartCtx && cartCtx.addToCart);

  // Check if product is in cart
  const isInCart = cartCtx?.cartItems?.some((item) => (item._id || item.id) === (product._id || product.id));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to add items to cart");
      navigate("/login");
      return;
    }
    try {
      if (typeof addToCart === "function") {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error("Add to cart is not available.");
      }
    } catch (err) {
      console.error('Error in handleAdd', err);
      toast.error('Failed to add to cart. See console for details.');
    }
  };

  const price = product?.price ?? 0;
  const oldPrice = product?.oldPrice;
  const inStock = typeof product?.stock === 'number' ? product.stock > 0 : true;
  const rating = Math.max(0, Math.min(5, Math.round(product?.rating || 0)));

  return (
    <Link to={`/products/${product._id || product.id || ''}`} className="product-card" aria-label={product.name}>
      <div className="card-media">
        {product?.onSale && <div className="badge-sale">Sale</div>}
        <img src={product.image || "/placeholder.jpg"} alt={product.name} />
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description ? product.description.slice(0, 80) + (product.description.length > 80 ? '…' : '') : ''}</p>

        <div className="card-meta">
          <div className="price-wrap">
            <span className="price">₹{price.toLocaleString()}</span>
            {oldPrice && <span className="old-price">₹{oldPrice.toLocaleString()}</span>}
          </div>

          <div className="rating" title={`${rating} / 5`} aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>{i < rating ? '★' : '☆'}</span>
            ))}
          </div>
        </div>

        <div className="card-actions">
          {isInCart ? (
            <Link to="/cart" className="btn-cart-view">View in Cart</Link>
          ) : (
            <button className="btn-primary" onClick={handleAdd} disabled={!inStock}>
              {inStock ? 'Add to cart' : 'Out of stock'}
            </button>
          )}
          <Link to={`/products/${product._id || product.id || ''}`} className="btn-ghost">View</Link>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;