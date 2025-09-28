"use client";
import { useEffect, useRef, RefObject } from 'react';
import type { Animator } from '@/lib/kooljs/animator';

export const useExample2 = (refA: RefObject<HTMLDivElement>, refB: RefObject<HTMLDivElement>) => {
    const animatorRef = useRef<Animator | null>(null);
    const propsRef = useRef<{ target_a?: any }>({}).current;

    useEffect(() => {
        let animator: Animator;

        import('@/lib/kooljs/animator').then(({ Animator: AnimatorClass }) => {
            animator = new AnimatorClass(40);
            animatorRef.current = animator;

            const setc = (val: number) => {
                if (refB.current) refB.current.style.transform = `translateY(${val}px)`;
            };

            propsRef.target_a = animator.Lerp({
                render_callback: setc,
                duration: 10,
                steps: [0, 50, 0],
                steps_max_length: 10,
            });

            animator.init();
        });

        return () => {
            animatorRef.current?.kill();
        };
    }, [refA, refB, propsRef]);

    const controls = {
        start: () => animatorRef.current?.start_animations([propsRef.target_a.id]),
        stop: () => animatorRef.current?.stop_animations([propsRef.target_a.id]),
        reset: () => animatorRef.current?.reset_animations([propsRef.target_a.id]),
        update: () => animatorRef.current?.update_lerp([{ id: propsRef.target_a.id, values: [0, 20, 40, 60, 80, 100] }]),
    };

    return controls;
};

export const exampleProps2 = {
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