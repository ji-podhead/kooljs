"use client";
import React, { useRef } from 'react';
import { useExample1, exampleProps1 } from '@/examples/useExample1';
import { useExample2, exampleProps2 } from '@/examples/useExample2';
import { useExample3, exampleProps3 } from '@/examples/useExample3';

const ProjectCard = ({ title, description, children, useExampleHook, exampleProps, refs }: any) => {
    const controls = useExampleHook(...refs);

    return (
        <div className="project-card">
            <h3>{title}</h3>
            <div className="project-content">
                <div className="project-description">
                    {description}
                </div>
                {children}
            </div>
            <div className="project-controls">
                {exampleProps.Controls.map((control: any, index: number) => (
                    <button key={index} className="control-btn" onClick={() => (controls as any)[control.button.name]()}>
                        {control.button.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


const Projects = () => {
    const e1aRef = useRef<HTMLDivElement>(null);
    const e1bRef = useRef<HTMLDivElement>(null);
    const e2aRef = useRef<HTMLDivElement>(null);
    const e2bRef = useRef<HTMLDivElement>(null);
    const e3ContainerRef = useRef<HTMLDivElement>(null);

    const project1Description = (
        <ul>
            <li><b>ovs_bridge:</b> Ansible Collection for creating OVS ports and bridges for network segmentation with tagged VLANs.</li>
            <li><b>opnsense-helper:</b> Python wrapper API for OPNsense for automation with Ansible.</li>
            <li><b>lil_bind:</b> Ansible Galaxy Collection for creating static DNS lookup zones for simple IPAM.</li>
            <li><b>netbox_docker_podman:</b> Fully automates the installation and configuration of Netbox Docker.</li>
        </ul>
    );

    const project2Description = (
        <ul>
            <li><b>Trading Bot:</b> Using RNNs, LSTM and Fuzzy Logic for Prediction. Trained on ~50GB of Candle Charts with a custom Dataset and Pipeline.</li>
            <li><b>Reidentification System:</b> Live Database that uses multiple indicators including Cloth, Facial Landmarks and Voice.</li>
            <li><b>Agent505:</b> Framework using LiteLLM for streamlining the development of autonomous Agents using feedback loops.</li>
        </ul>
    );

    const project3Description = (
         <ul>
            <li><b>protobuffctl:</b> NPM package and CLI tool for managing and testing protocol buffers (gRPC).</li>
            <li><b>kooljs:</b> My Animation Tool for React and HTML that uses multi-threading & shared array buffer.</li>
            <li><b>particle system:</b> Particle System similar to Unity Shuriken using OpenGL Shader + ThreeJs/Fiber + Multi-threading.</li>
        </ul>
    );

    return (
        <section id="projects">
            <h2>Projects</h2>
            <ProjectCard title="Ansible Galaxy Collections for Network Automation" description={project1Description} useExampleHook={useExample1} exampleProps={exampleProps1} refs={[e1aRef, e1bRef]}>
                <div className="project-animation-preview">
                    <div ref={e1aRef} id="e1_a" className="anim-box">A</div>
                    <div ref={e1bRef} id="e1_b" className="anim-box">B</div>
                </div>
            </ProjectCard>
             <ProjectCard title="Machine Learning" description={project2Description} useExampleHook={useExample2} exampleProps={exampleProps2} refs={[e2aRef, e2bRef]}>
                <div className="project-animation-preview">
                    <div ref={e2aRef} id="e2_a" className="anim-box" style={{backgroundColor: '#4A90E2'}}>A</div>
                    <div ref={e2bRef} id="e2a_b" className="anim-box" style={{backgroundColor: '#50E3C2'}}>B</div>
                </div>
            </ProjectCard>
            <ProjectCard title="Frontend" description={project3Description} useExampleHook={useExample3} exampleProps={exampleProps3} refs={[e3ContainerRef]}>
                 <div className="project-animation-preview" id="example-3-container" ref={e3ContainerRef}></div>
            </ProjectCard>
        </section>
    );
};

export default Projects;