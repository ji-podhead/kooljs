import React from 'react';

const Experience = () => {
  return (
    <section id="experience">
      <h2>Experience & Contributions</h2>
      <div className="experience-item">
        <h3>Open Source Collaborations & Hackathons</h3>
        <p className="date">Apr 2025 — Present</p>
        <ul>
            <li>Fashion Recommendation System using autonomous agents and Vector Search, virtual try on and AI-Crawlers.</li>
            <li>Crop loss prediction model using Google Earth Engine and Gradient Boosting.</li>
            <li>Working with the OHC Network DevOps team on optimizing CI/CD and cloud deployments.</li>
        </ul>
      </div>
      <div className="experience-item">
        <h3>Orchestra-Nexus</h3>
        <p className="date">Mar 2025 — Present</p>
        <p>Orchestration Platform on GCP. Orchestration Agents, Document Processing and custom Infrastructure for clients.</p>
      </div>
        <div className="experience-item">
        <h3>Nice Touch (intern)</h3>
        <p className="date">Jan 2020 — Jun 2020</p>
        <p>Implementing advanced search algorithms for a React Fiber physics and game engine.</p>
      </div>
    </section>
  );
};

export default Experience;