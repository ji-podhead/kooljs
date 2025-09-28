import React from 'react';

const Skills = () => {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skills-grid">
        <div className="skill-category">
          <h3>Programming Languages</h3>
          <div className="skills-container">
            <span className="skill-tag">Bash</span><span className="skill-tag">Python</span><span className="skill-tag">JS/TS</span><span className="skill-tag">C#</span><span className="skill-tag">Go</span><span className="skill-tag">Rust</span><span className="skill-tag">HTML</span><span className="skill-tag">CSS</span><span className="skill-tag">Jinja</span><span className="skill-tag">SQL</span><span className="skill-tag">PHP</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>Container-Orchestration & Virtualization</h3>
          <div className="skills-container">
            <span className="skill-tag">Kubernetes</span><span className="skill-tag">Libvirt</span><span className="skill-tag">Proxmox</span><span className="skill-tag">Docker Compose</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>DevOps & Cloud</h3>
          <div className="skills-container">
            <span className="skill-tag">Ansible</span><span className="skill-tag">Terraform</span><span className="skill-tag">Foreman</span><span className="skill-tag">Localstack(AWS)</span><span className="skill-tag">Gh-Action</span><span className="skill-tag">Jenkins</span><span className="skill-tag">Grafana</span><span className="skill-tag">ElasticStack</span><span className="skill-tag">GCP</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>DataScience</h3>
          <div className="skills-container">
            <span className="skill-tag">Pytorch</span><span className="skill-tag">Numpy</span><span className="skill-tag">Pandas</span><span className="skill-tag">matplotlib</span><span className="skill-tag">Scikit-learn</span><span className="skill-tag">Apache Ozone & Minio</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>AI-Agents</h3>
          <div className="skills-container">
            <span className="skill-tag">fastAPI</span><span className="skill-tag">MCP Servers</span><span className="skill-tag">LangChain</span><span className="skill-tag">LiteLLM</span><span className="skill-tag">crewAI</span><span className="skill-tag">Google A2A/ADK/SDK</span><span className="skill-tag">Vector DBs (Pinecone)</span><span className="skill-tag">n8n</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>Databases & APIs</h3>
          <div className="skills-container">
            <span className="skill-tag">Webserver/REST (Python,JS)</span><span className="skill-tag">gRPC</span><span className="skill-tag">Apache Feather</span><span className="skill-tag">SQL(Postgres)</span><span className="skill-tag">redis</span><span className="skill-tag">MiniO</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>Frontend</h3>
          <div className="skills-container">
            <span className="skill-tag">React</span><span className="skill-tag">Tailwind</span><span className="skill-tag">Slint</span><span className="skill-tag">D3</span><span className="skill-tag">GIS (OSM)</span><span className="skill-tag">3D (OpenGL, Three.js, React Fiber)</span>
          </div>
        </div>
        <div className="skill-category">
          <h3>Networking</h3>
          <div className="skills-container">
            <span className="skill-tag">DNS & DHCP (BIND/ISC)</span><span className="skill-tag">Segmentation (VLAN, OVS)</span><span className="skill-tag">Proxy/Ingress (traefik,NGINX)</span><span className="skill-tag">IDS/IPS(Suricata)</span><span className="skill-tag">Zero Trust Access (Teleport)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;