import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <h3 className="footer-brand">Novyn</h3>
          <p className="footer-description">
            Your trusted partner for premium electronics. Discover amazing products with unbeatable prices and exceptional quality.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C8.396 0 7.996.014 6.802.067 5.618.12 4.902.26 4.331.465c-.64.218-1.182.482-1.723.993C1.993 1.93 1.73 2.47 1.512 3.11c-.205.571-.345 1.287-.398 2.471C1.061 6.776 1.047 7.176 1.047 10.797s.014 4.021.067 5.215c.053 1.194.193 1.91.398 2.481.218.64.482 1.182.993 1.723.521.511 1.063.775 1.703.993.571.205 1.287.345 2.471.398 1.194.053 1.594.067 5.215.067s4.021-.014 5.215-.067c1.194-.053 1.91-.193 2.481-.398.64-.218 1.182-.482 1.723-.993.511-.521.775-1.063.993-1.703.205-.571.345-1.287.398-2.481.053-1.194.067-1.594.067-5.215s-.014-4.021-.067-5.215c-.053-1.194-.193-1.91-.398-2.481-.218-.64-.482-1.182-.993-1.723C21.07 1.993 20.53 1.73 19.89 1.512c-.571-.205-1.287-.345-2.471-.398C16.225 1.061 15.825 1.047 12.204 1.047 12.1 1.047 12.017 1.047 12.017 0zm4.778 2.13c.854 0 1.52.686 1.52 1.53 0 .854-.666 1.53-1.52 1.53-.854 0-1.53-.676-1.53-1.53 0-.844.676-1.53 1.53-1.53zM12.017 5.84c-3.527 0-6.39 2.863-6.39 6.39s2.863 6.39 6.39 6.39 6.39-2.863 6.39-6.39-2.863-6.39-6.39-6.39zm0 10.566c-2.302 0-4.166-1.864-4.166-4.166s1.864-4.166 4.166-4.166 4.166 1.864 4.166 4.166-1.864 4.166-4.166 4.166z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className="footer-section">
          <h4 className="footer-heading">Customer Service</h4>
          <ul className="footer-links">
            <li><a href="/orders">My Orders</a></li>
            {/* <li><a href="/returns">Returns & Exchanges</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
            <li><a href="/support">Support</a></li> */}
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Info</h4>
          <div className="contact-info">
            <p>📧 support@novyn.com</p>
            <p>📍 Ujjain, India</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Novyn Electronics. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
