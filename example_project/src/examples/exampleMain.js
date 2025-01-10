import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "../kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
const animationObjects = {}
const animationProps={
  w:0,
  setw:(()=>{}),
  h:0,
  seth:(()=>{}),
  t:0,
  sett:(()=>{}),
}
function e1_init(animator) {
  const screenWidthProp = new Prop("useState", [animationProps.w, animationProps.wset])
  const screenHeightProp = new Prop("useState", [animationProps.h, animationProps.hset])
  const triggerProp = new Prop("useState", [animationProps.t, animationProps.tset])
  animationObjects.triggerobj = new Lerp(animationProps.animator, triggerProp, 10, 1,undefined,undefined,undefined,undefined,1,10)

  animationObjects.screenWidth = new Lerp(animator,screenWidthProp,50,1,0,undefined, new AnimationTrigger(animationObjects.triggerobj,5))
  animationObjects.screenHeight = new Lerp(animator,screenHeightProp,50,1,0,undefined, undefined,undefined,undefined,undefined)
  // animationObjects.screenWidth = new Lerp(props.animator, screenWidthProp, 10, 1)

  // animationObjects.screenHeight = new Lerp(props.animator, screenHeightProp, 10, 1)
  window.addEventListener('resize', zoom);
  window.addEventListener('orientationchange', zoom);
  window.onbeforeunload = function () {
    window.removeEventListener('resize', zoom);
    window.removeEventListener('orientationchange', zoom);
    return ({})
  };
  async function zoom() {
    try {
      animator.update([
        {   
          animObject: animationObjects.screenWidth,
          value: {
            min: animationProps.w,
            max: window.innerWidth,
          }
        },
        {
          animObject: animationObjects.screenHeight,
          value: {
            min: animationProps.h,
            max: window.innerHeight,
          }
        },
      ])
    } catch (error) {
      console.log(error);
    }
  }
}

function E1() {
  const [w, wset] = new useState(window.innerWidth)
  const [h, hset] = new useState(window.innerHeight)
  const [t, tset] = new useState(0)
  useEffect(() => {
    animationProps.w=w
    animationProps.wset=wset
    animationProps.h=h
    animationProps.hset=hset
    animationProps.t=t
    animationProps.tset=tset
  })
  useMemo(() => {
    console.log("---------------------------")
    console.log(`${w} ${window.innerWidth} | ${h} ${window.innerHeight}  | ${t}   `)
    console.log("---------------------------")
  }, [w,h,t])

  
  return (
    <div class="w-full h-full">
      {w}
      <div class="bg-black w-full h-full font-size-xl"  style={{ width: w, height: h, }}>
      </div>
    </div>
  )
}
export { e1_init, E1 }