import { Animator } from '../../kooljs/animator.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Example from './e6.js';

const animator = new Animator();

// The original Example function is not a standard React component.
// We wrap it to make it compatible with React's rendering.
const App = () => {
    // This is a bit of a hack to make the example work without changing its structure.
    // We rely on the fact that the Example function will be called on render.
    React.useEffect(() => {
        // Initialize the animator after the component has mounted
        // to ensure that the DOM elements are available.
        animator.init();
        animator.start();
    }, []);

    return Example(animator);
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);