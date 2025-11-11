import React, { useState } from "react";
import "./Navbar.css";
import { NavLink, Link } from "react-router-dom";
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
            <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
              Products
            </NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to="/cart" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
                  Cart
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
                  Contact
                </NavLink>
              </li>

              {user.role === "admin" && (
                <li>
                  <NavLink to="/admin" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
                    Admin
                  </NavLink>
                </li>
              )}

              <li className="auth-link">
                <button onClick={() => { logout(); close(); }}>Logout</button>
              </li>
            </>
          ) : (
            <li className="auth-link">
              <NavLink to="/login" onClick={close} className={({ isActive }) => isActive ? "active" : ""} style={{ marginRight: 8 }}>
                Login
              </NavLink>
              <NavLink to="/signup" onClick={close} className={({ isActive }) => isActive ? "active" : ""}>
                Sign up
              </NavLink>
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