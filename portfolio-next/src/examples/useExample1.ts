"use client";
import { useEffect, useRef, RefObject } from 'react';
import type { Animator } from '@/lib/kooljs/animator';

export const useExample1 = (refA: RefObject<HTMLDivElement>, refB: RefObject<HTMLDivElement>) => {
  const animatorRef = useRef<Animator | null>(null);
  const propsRef = useRef<{ target_a?: any; target_b?: any }>({}).current;

  useEffect(() => {
    let animator: Animator;

    import('@/lib/kooljs/animator').then(({ Animator: AnimatorClass }) => {
        animator = new AnimatorClass(40);
        animatorRef.current = animator;

        propsRef.target_a = animator.Lerp({
            render_callback: (val: number) => {
                if (refA.current) refA.current.style.transform = `translateY(${val}px)`;
            },
            duration: 50,
            steps: [0, 100],
        });

        propsRef.target_b = animator.Lerp({
            render_callback: (val: number) => {
                if (refB.current) refB.current.style.transform = `translateY(${val}px)`;
            },
            duration: 40,
            steps: [0, 100],
        });

        animator.init();
    });

    return () => {
        animatorRef.current?.kill();
    };
  }, [refA, refB, propsRef]);

  const controls = {
    start_a: () => animatorRef.current?.start_animations([propsRef.target_a.id]),
    start_b: () => animatorRef.current?.start_animations([propsRef.target_b.id]),
    stop: () => animatorRef.current?.stop_animations('all'),
  };

  return controls;
};

export const exampleProps1 = {
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