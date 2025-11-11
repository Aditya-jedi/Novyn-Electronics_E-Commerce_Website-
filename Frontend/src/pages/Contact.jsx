import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact">
      <div className="container">
        <div className="contact-hero">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-intro">
            Get in touch with us. We're here to help with any questions or support you may need.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email Support</h3>
              <p>support@novyn.com</p>
              <p>We respond within 24 hours</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone Support</h3>
              <p>+91 98765 43210</p>
              <p>Mon-Fri: 9AM-6PM IST</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Office Address</h3>
              <p>Mumbai, Maharashtra</p>
              <p>India - 400001</p>
            </div>
          </div>

          <div className="creators-grid">
          {/*  <div className="creator-card">
               <div className="creator-avatar">
                <span className="creator-icon">A</span>
              </div> 
              <h2 className="creator-name">Aditya Pratap Singh</h2>
              <p className="creator-description">
                A passionate developer with interests in front-end technologies, UI/UX design, and creative problem-solving.
              </p>
              <div className="creator-links">
                <a href="https://github.com/Aditya-jedi" target="_blank" rel="noopener noreferrer" className="creator-link">
                  <span className="link-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/aditya-pratap-singh-b4b850327/" target="_blank" rel="noopener noreferrer" className="creator-link">
                  <span className="link-icon">💼</span>
                  LinkedIn
                </a>
              </div>
            </div> */}
            {/* <div className="creator-card">
              <div className="creator-avatar">
                <span className="creator-icon">A</span>
              </div>
              <h2 className="creator-name">Ayush Sen</h2>
              <p className="creator-description">
                An enthusiastic learner focused on web development, performance optimization, and modern software design.
              </p>
              <div className="creator-links">
                <a href="https://github.com/Ayushsen83" target="_blank" rel="noopener noreferrer" className="creator-link">
                  <span className="link-icon">🐙</span>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/ayush-sen-b733aa324/" target="_blank" rel="noopener noreferrer" className="creator-link">
                  <span className="link-icon">💼</span>
                  LinkedIn
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
