function Example(animator) {
    const animationProps = {
        animator: animator,
        target_a: undefined,
    };

    const setc = (val) => {
        const el = document.getElementById("e2a_b");
        if (el) el.style.transform = `translateY(${val}px)`;
    };

    animationProps.target_a = animator.Lerp({
        render_callback: setc,
        duration: 10,
        steps: [0, 50, 0],
        steps_max_length: 10,
    });

    return {
        start: () => animator.start_animations([animationProps.target_a.id]),
        stop: () => animator.stop_animations([animationProps.target_a.id]),
        reset: () => animator.reset_animations([animationProps.target_a.id]),
        update: () => animator.update_lerp([{ id: animationProps.target_a.id, values: [0, 20, 40, 60, 80, 100] }]),
    };
}

const exampleProps = {
    Controls: [
        { info: "Starts the animation.", button: { name: "start" } },
        { info: "Stops the animation.", button: { name: "stop" } },
        { info: "Resets the animation.", button: { name: "reset" } },
        { info: "Updates the animation sequence and restarts.", button: { name: "update" } },
    ],
    info: {
        name: "Animation Sequences",
        description: "This example demonstrates how to update an animation's sequence of steps dynamically.",
    }
};

export { Example, exampleProps };