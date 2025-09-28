function Example(animator) {
    const length = 30;
    const elements = [];
    const indices = new Float32Array(length);
    const container = document.getElementById('example-3-container');

    const bg = (val) => {
        const red = (255 * (val / 100)) / 4;
        const green = 0;
        const blue = (255 * (val / 100));
        return `linear-gradient(to right, rgb(20,0,40), rgb(${red}, ${green}, ${blue}))`;
    };

    const setWidth = (id, val) => {
        const el = document.getElementById("e3_" + id);
        if (el) {
            el.style.width = `${val}%`;
            el.style.backgroundImage = bg(val);
        }
    };

    const randomWidth = (min, max) => {
        const new_min = (Math.random() * (max - min));
        return [min + new_min, min + new_min + Math.random() * (max - (min + new_min))];
    };

    for (let i = 0; i < length; i++) {
        const width = randomWidth(10, 100);
        const div = document.createElement('div');
        div.id = "e3_" + i;
        div.style.width = width[0] + '%';
        div.style.height = 100 / length + '%';
        div.style.backgroundImage = bg(width[0]);
        div.style.color = 'white';
        div.style.fontSize = '12px';
        div.style.lineHeight = (300 / length) + 'px';
        div.textContent = ` ${i}`;
        container.appendChild(div);

        const anim = animator.Lerp({
            render_callback: (val) => setWidth(i, val),
            duration: Math.floor(10 + (60 * Math.random())),
            delay: Math.floor(Math.random() * 60),
            steps: [width[0], width[1], width[0]],
            loop: true,
        });
        indices[i] = anim.id;
    }

    return {
        start: () => animator.start_animations(indices),
        stop: () => animator.stop_animations("all"),
        reset: () => animator.reset_animations(indices),
    };
}

const exampleProps = {
    Controls: [
        { info: "Starts the animations.", button: { name: "start" } },
        { info: "Stops all animations.", button: { name: "stop" } },
        { info: "Resets all animations.", button: { name: "reset" } },
    ],
    info: {
        name: "Looping Animations",
        description: "This example showcases multiple looped animations with random durations and delays.",
    }
};

export { Example, exampleProps };