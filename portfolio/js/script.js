import { Animator } from '../../kooljs/animator.js';
import { Example as Example1, exampleProps as exampleProps1 } from './examples/e1.js';
import { Example as Example2, exampleProps as exampleProps2 } from './examples/e2.js';
import { Example as Example3, exampleProps as exampleProps3 } from './examples/e3.js';

document.addEventListener('DOMContentLoaded', () => {
    // Matrix Animation
    (function() {
        const canvas = document.getElementById('matrix-container');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fontSize = 16;
        let columns = Math.floor(canvas.width / fontSize);
        let drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || "#00ff41";
            ctx.font = fontSize + "px " + getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        let interval = setInterval(draw, 33);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
        });
    })();

    // Scroll-based animations
    (function() {
        const sections = document.querySelectorAll('section');
        const progressBar = document.getElementById('scroll-progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            if (section.id !== 'hero') {
                observer.observe(section);
            } else {
                section.classList.add('visible');
            }
        });

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            if(progressBar) progressBar.style.width = scrollProgress + '%';
        });
    })();

    // Interactive Examples
    function setupExample(exampleModule, propsModule, controlsContainerId) {
        const animator = new Animator(40);
        const controls = exampleModule(animator);

        const controlsContainer = document.getElementById(controlsContainerId);
        if(controlsContainer && propsModule.Controls) {
            propsModule.Controls.forEach(control => {
                const btn = document.createElement('button');
                btn.textContent = control.button.name;
                btn.className = 'control-btn';
                btn.onclick = controls[control.button.name];
                controlsContainer.appendChild(btn);
            });
        }
        animator.init();
    }

    setupExample(Example1, exampleProps1, 'controls-1');
    setupExample(Example2, exampleProps2, 'controls-2');
    setupExample(Example3, exampleProps3, 'controls-3');
});