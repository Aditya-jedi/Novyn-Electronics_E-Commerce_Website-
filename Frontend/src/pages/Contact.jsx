import React from "react";
import "./Contact.css";

function Contact() {
   const creators = [
    {
      name: "Aditya Pratap Singh",
      github: "https://github.com/Aditya-jedi",
      linkedin: "https://www.linkedin.com/in/aditya-pratap-singh-b4b850327/",
      description:
        "A passionate developer with interests in front-end technologies, UI/UX design, and creative problem-solving.",
    },
    {
      name: "Ayush Sen",
      github: "https://github.com/Ayushsen83",
      linkedin: "https://www.linkedin.com/in/ayush-sen-b733aa324/",
      description:
        "An enthusiastic learner focused on web development, performance optimization, and modern software design.",
    },
  ];
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
            <div className="team-section">
          <h2 className="section-title">Team</h2>
          <div className="creators-grid">
            {creators.map((creator, index) => (
              <div key={index} className="creator-card">
                <div className="creator-avatar">
                  <span className="creator-icon">{creator.name.charAt(0)}</span>
                </div>
                <h2 className="creator-name">{creator.name}</h2>
                <p className="creator-description">{creator.description}</p>
                <div className="creator-links">
                  <a href={creator.github} target="_blank" rel="noopener noreferrer" className="creator-link">
                    <span className="link-icon">🐙</span>
                    GitHub
                  </a>
                  <a href={creator.linkedin} target="_blank" rel="noopener noreferrer" className="creator-link">
                    <span className="link-icon">💼</span>
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
