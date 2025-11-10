import React from "react";
import "./About.css";

function About() {
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
    <div className="about">
      <div className="container">
        <div className="about-hero">
          <h1 className="about-title">About Us</h1>
          <p className="about-intro">
            This project was created with dedication and teamwork by two passionate
            developers. Learn more about the creators below.
          </p>
        </div>

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
  );
}

export default About;