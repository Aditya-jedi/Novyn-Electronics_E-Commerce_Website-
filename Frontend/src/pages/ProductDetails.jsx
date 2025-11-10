import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from '../utils/toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Product not found (status: ${response.status})`);
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && addToCart) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleBackClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--text-color)"
      }}>
        <div>Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--text-color)"
      }}>
        <button
          onClick={handleBackClick}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            background: "var(--nav-bg)",
            border: `1px solid var(--border-color)`,
            borderRadius: "var(--radius-md)",
            padding: "0.5rem",
            cursor: "pointer",
            color: "var(--text-color)",
            fontSize: "1.2rem"
          }}
          aria-label="Back to products"
        >
          ←
        </button>
        <h2>Error loading product</h2>
        <p>{error}</p>
        <Link
          to="/products"
          style={{
            color: "var(--primary-accent)",
            textDecoration: "none",
            fontWeight: "500"
          }}
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        padding: "2rem",
        textAlign: "center",
        color: "var(--text-color)"
      }}>
        <h2>Product not found</h2>
        <Link
          to="/products"
          style={{
            color: "var(--primary-accent)",
            textDecoration: "none",
            fontWeight: "500"
          }}
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "800px",
      margin: "0 auto",
      color: "var(--text-color)"
    }}>
      {/* Product Image */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-medium)",
            objectFit: "cover"
          }}
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "1rem",
          color: "var(--text-color)"
        }}>
          {product.name}
        </h1>

        <div style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          color: "var(--primary-accent)",
          marginBottom: "1.5rem"
        }}>
          ₹{product.price?.toLocaleString() || 'N/A'}
        </div>

        <div style={{
          fontSize: "1.1rem",
          lineHeight: "1.6",
          color: "var(--secondary-text)",
          marginBottom: "2rem",
          whiteSpace: "pre-wrap"
        }}>
          {product.description || 'No description available.'}
        </div>

        {/* Additional Product Info */}
        {product.category && (
          <div style={{
            marginBottom: "1rem",
            color: "var(--secondary-text)"
          }}>
            <strong>Category:</strong> {typeof product.category === 'object' ? product.category.name : product.category}
          </div>
        )}

        {product.stock !== undefined && (
          <div style={{
            marginBottom: "1rem",
            color: product.stock > 0 ? "var(--success)" : "var(--error)"
          }}>
            <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </div>
        )}

        {product.rating && (
          <div style={{
            marginBottom: "2rem",
            color: "var(--text-color)"
          }}>
            <strong>Rating:</strong> {product.rating}/5 ⭐
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock <= 0}
            style={{
              padding: "0.75rem 1.5rem",
              background: product.stock > 0 ? "var(--btn-primary-gradient)" : "var(--border-color)",
              color: product.stock > 0 ? "var(--button-text)" : "var(--secondary-text)",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: product.stock > 0 ? "pointer" : "not-allowed",
              transition: "all var(--transition-fast)",
              boxShadow: "var(--shadow-light)"
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "var(--shadow-medium)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "var(--shadow-light)";
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <Link
            to="/products"
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--btn-ghost-gradient)",
              color: "var(--text-color)",
              border: `1px solid var(--border-color)`,
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center",
              transition: "all var(--transition-fast)",
              boxShadow: "var(--shadow-light)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--card-bg)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "var(--shadow-medium)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--btn-ghost-gradient)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "var(--shadow-light)";
            }}
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;