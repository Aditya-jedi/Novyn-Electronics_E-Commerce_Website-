import React from "react";
import "./About.css";

function About() {
 

  const technologies = [
    {
      name: "Frontend",
      tech: "React.js",
      icon: "⚛️",
    },
    {
      name: "Backend",
      tech: "Node.js + Express",
      icon: "🚀",
    },
    {
      name: "Database",
      tech: "MongoDB",
      icon: "🗄️",
    },
   
  ];

  return (
    <div className="about">
      <div className="container">
        <div className="about-hero">
          <h1 className="about-title">About Us</h1>
          <p className="about-intro">
            Welcome to Novyn Electronics, your one-stop destination for quality electronic products at affordable prices. This website is developed as a college project to demonstrate an end-to-end e-commerce system, including product listing, cart management, and secure checkout features.
          </p>
        </div>

        <div className="mission-section">
          <div className="mission-card">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              Our mission is to provide a seamless online shopping experience for all users while showcasing the practical implementation of web technologies in e-commerce.
            </p>
          </div>
        </div>

    

        <div className="tech-section">
          <h2 className="section-title">Technologies Used</h2>
          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-card">
                <div className="tech-icon">{tech.icon}</div>
                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-detail">{tech.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
