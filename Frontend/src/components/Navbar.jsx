// src/components/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((s) => !s);
  const close = () => setOpen(false);

  return (
    <header>
      <nav className="navbar">
        <div className="brand">
          <Link to="/" className="logo-text" onClick={close}>
            <span className="logo-icon">🛍️</span>
            <span className="logo-brand">Novyn</span>
          </Link>
        </div>

        <button
          className={`hamburger ${open ? "is-active" : ""}`}
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-overlay ${open ? "open" : ""}`} onClick={close} />

        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={close}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={close}>
              Products
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/cart" onClick={close}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={close}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={close}>
                  About
                </Link>
              </li>

              {user.role === "admin" && (
                <li>
                  <Link to="/admin" onClick={close}>
                    Admin
                  </Link>
                </li>
              )}

              <li className="auth-link">
                <button onClick={() => { logout(); close(); }}>Logout</button>
              </li>
            </>
          ) : (
            <li className="auth-link">
              <Link to="/login" onClick={close} style={{ marginRight: 8 }}>
                Login
              </Link>
              <Link to="/signup" onClick={close}>
                Sign up
              </Link>
            </li>
          )}

          {/* Theme Toggle in Navbar */}
          <li className="theme-toggle-nav">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
