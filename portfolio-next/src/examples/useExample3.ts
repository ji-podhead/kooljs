"use client";
import { useEffect, useRef, RefObject } from 'react';
import type { Animator } from '@/lib/kooljs/animator';

export const useExample3 = (containerRef: RefObject<HTMLDivElement>) => {
    const animatorRef = useRef<Animator | null>(null);
    const indicesRef = useRef<Float32Array | null>(null);

    useEffect(() => {
        let animator: Animator;

        import('@/lib/kooljs/animator').then(({ Animator: AnimatorClass }) => {
            animator = new AnimatorClass(40);
            animatorRef.current = animator;
            const container = containerRef.current;
            if (!container) return;

            const length = 30;
            const indices = new Float32Array(length);
            indicesRef.current = indices;

            const bg = (val: number) => {
                const red = (255 * (val / 100)) / 4;
                const green = 0;
                const blue = (255 * (val / 100));
                return `linear-gradient(to right, rgb(20,0,40), rgb(${red}, ${green}, ${blue}))`;
            };

            const setWidth = (id: number, val: number) => {
                const el = container.querySelector("#e3_" + id) as HTMLElement;
                if (el) {
                    el.style.width = `${val}%`;
                    el.style.backgroundImage = bg(val);
                }
            };

            const randomWidth = (min: number, max: number) => {
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
                    render_callback: (val: number) => setWidth(i, val),
                    duration: Math.floor(10 + (60 * Math.random())),
                    delay: Math.floor(Math.random() * 60),
                    steps: [width[0], width[1], width[0]],
                    loop: true,
                });
                indices[i] = anim.id;
            }

            animator.init();
        });

        return () => {
            animatorRef.current?.kill();
            const container = containerRef.current;
            if(container) container.innerHTML = '';
        };
    }, [containerRef]);

    const controls = {
        start: () => {
            if (animatorRef.current && indicesRef.current) {
                animatorRef.current.start_animations(indicesRef.current);
            }
        },
        stop: () => animatorRef.current?.stop_animations("all"),
        reset: () => {
             if (animatorRef.current && indicesRef.current) {
                animatorRef.current.reset_animations(indicesRef.current);
            }
        },
    };

    return controls;
};

export const exampleProps3 = {
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