function Example(animator) {
    const animationProps = {
        animator: animator,
        target_a: undefined,
        target_b: undefined,
    };

    animationProps.target_a = animator.Lerp({
        render_callback: (val) => {
            const el = document.getElementById("e1_a");
            if (el) el.style.transform = `translateY(${val}px)`;
        },
        duration: 50,
        steps: [0, 100],
    });

    animationProps.target_b = animator.Lerp({
        render_callback: (val) => {
            const el = document.getElementById("e1_b");
            if (el) el.style.transform = `translateY(${val}px)`;
        },
        duration: 40,
        steps: [0, 100],
    });

    return {
        start_a: () => animator.start_animations([animationProps.target_a.id]),
        start_b: () => animator.start_animations([animationProps.target_b.id]),
        stop: () => animator.stop_animations('all'),
    };
}

const exampleProps = {
    Controls: [
        {
            info: "Starts the animation for box 'a'.",
            button: { name: "start_a" }
        },
        {
            info: "Starts the animation for box 'b'.",
            button: { name: "start_b" }
        },
        {
            info: "Stops all animations.",
            button: { name: "stop" }
        },
    ],
    info: {
        name: "Initialize Animator",
        description: "This example shows how to initialize the animator and create simple Lerp animations.",
    }
};

export { Example, exampleProps };