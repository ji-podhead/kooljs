import { Animator } from "../../kooljs/animator.js";
import React from 'react';

const animProps = {
  animator: undefined,
  start_animation: undefined,
  size_animation: undefined,
  size_constant: undefined,
  color_animation: undefined,
  size_constant_id: undefined,
  size_duration_max: 40
};

function bg(val) {
  return `linear-gradient(to right, rgb(0,0,0), rgb(${val[0]}, ${val[1]}, ${val[2]})`;
}

function setStyle(val) {
  document.getElementById("inner").style.width = `${Math.floor(val[0])}%`;
  document.getElementById("inner").style.height = `${Math.floor(val[1])}%`;
}

function Example(animator) {
  animProps.animator = animator;
  animProps.color_animation = animator.Matrix_Lerp({
    render_callback: ((val) => document.getElementById("main").style.background = (bg(val))),
    steps: [[0, 0, 0], [50, 50, 255]],
    duration: animProps.size_duration_max
  });
  animProps.size_animation = animator.Matrix_Lerp({
    render_callback: ((val) => setStyle(val)),
    duration: animProps.size_duration_max,
    steps: [[1, 1], [100, 100]],
  });
  animProps.size_constant_id = animator.get_constant_size("matrix") + 1;

  animProps.start_animation = animator.Lambda({
    path: "/public/e6_lambda.js", // Path to the lambda function
    animProps: animProps
  });

  animProps.size_constant = animator.constant({
    type: "matrix",
    value: [[1, 1]],
    render_triggers: [animProps.color_animation.id],
    render_callbacks: [{ id: animProps.start_animation.id, args: undefined }]
  });

  return (
    <div class="w-full h-full bg-slate-700">
      <div class="w-full h-full flex items-center justify-center">
        <div id={"main"} key={"main"} class="w-[95%] h-[95%] bg-black border-4 border-[#21d9cd] flex rounded-md justify-center justify-items-center items-center">
          <div id={"inner"} key={"inner"} class="w-1 h-1 bg-white">
            inner
          </div>
        </div>
      </div>
    </div>
  );
}

const set_size = (() => {
  animProps.animator.update_constant([{ type: "matrix", id: animProps.size_constant.id, value: [[(30 + Math.random() * 70), 30 + Math.random() * 70]] }])
});

// This is a dummy export, assuming this file will be part of a larger React application.
// For a standalone example, we would need a different setup.
export default Example;