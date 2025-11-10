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
          <h1 className="hero-title">
            <span className="hero-icon">🛍️</span>
            Discover Amazing Products at <span className="brand-accent">Novyn</span>
          </h1>
          <p className="hero-subtitle">
            Shop the latest trends with unbeatable prices and exceptional quality.
            Your satisfaction is our priority.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/about" className="btn btn-ghost">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <span>🛍️</span>
            <p>Premium Products</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Novyn?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over ₹999</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers</p>
            {user ? (
              <Link to="/products" className="btn btn-secondary">
                Browse Products
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-secondary">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;