import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact">
      <div className="container">
        <div className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-intro">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>novynelectronics@gmail.com</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>+91-9876543210</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🏫</div>
              <h3>University</h3>
              <p>Shri Vaishnav Vidyapeeth Vishwavidyalaya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
