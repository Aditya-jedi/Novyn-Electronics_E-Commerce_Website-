import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Premium Electronics</span>
          </div>
          <h1 className="hero-title">
            Elevate Your Tech Experience with <span className="brand-accent">Novyn</span>
          </h1>
          <p className="hero-subtitle">
            Discover cutting-edge technology, premium quality, and unparalleled performance.
            Your journey to exceptional electronics starts here.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Premium Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Expert Support</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Explore Collection
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="card card-1">
              <img src="https://images.samsung.com/is/image/samsung/p6pim/in/qa55s85faelxl/gallery/in-oled-s85f-qa55s85faelxl-thumb-548447328?$330_330_PNG$" alt="Headphones" />
            </div>
            <div className="card card-2">
              <img src="https://images.ctfassets.net/javen7msabdh/20P1nCjk0cLfOWV9N4oULI/bcca53c9c5752d900191b1906443fe19/woburn-iii-black-plp.jpeg?w=640&fm=avif&q=100" alt="Smart Watch" />
            </div>
            <div className="card card-3">
              <img src="https://www.nikon.co.in/media/catalog/product/c/o/coolpixp1100-1.png?optimize=high&fit=bounds&height=330&width=330&canvas=330:330&format=jpeg" alt="Laptop" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            <Link to="/products?category=audio" className="category-card">
              <div className="category-icon">🎧</div>
              <h3>Audio</h3>
              <p>Premium headphones & speakers</p>
            </Link>
            <Link to="/products?category=wearables" className="category-card">
              <div className="category-icon">⌚</div>
              <h3>Wearables</h3>
              <p>Smart watches & fitness trackers</p>
            </Link>
            <Link to="/products?category=computers" className="category-card">
              <div className="category-icon">💻</div>
              <h3>Computers</h3>
              <p>Laptops & desktops</p>
            </Link>
            <Link to="/products?category=gaming" className="category-card">
              <div className="category-icon">🎮</div>
              <h3>Gaming</h3>
              <p>Gaming gear & accessories</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <div className="feature-content">
                <h3>Free Delivery</h3>
                <p>Free shipping on orders over ₹999</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-content">
                <h3>Secure Payment</h3>
                <p>100% secure checkout process</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <div className="feature-content">
                <h3>Easy Returns</h3>
                <p>30-day hassle-free returns</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-content">
                <h3>Quality Guarantee</h3>
                <p>Premium products, guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Upgrade Your Tech?</h2>
            <p>Join thousands of satisfied customers who trust Novyn for their premium electronics needs.</p>
            {user ? (
              <Link to="/products" className="btn btn-secondary">
                Start Shopping
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-secondary">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
