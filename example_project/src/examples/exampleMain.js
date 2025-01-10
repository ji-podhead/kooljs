import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "../kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
const animationObjects = {}
function e1_init(props) {
  const screenWidthProp = new Prop("useState", [props.w, props.wset])
  const screenHeightProp = new Prop("useState", [props.h, props.hset])
  const triggerProp = new Prop("useState", [props.t, props.tset])
  animationObjects.triggerobj = new Lerp(props.animator, triggerProp, 10, 1,undefined,undefined,undefined,undefined,1,10)

  animationObjects.screenWidth = new Lerp(props.animator,screenWidthProp,10,1,0,undefined, new AnimationTrigger(animationObjects.triggerobj,5))
  animationObjects.screenHeight = new Lerp(props.animator,screenHeightProp,10,1,0,undefined, undefined,undefined,undefined,undefined)
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
      props.animator.update([
        {   
          animObject: animationObjects.screenWidth,
          value: {
            min: props.w,
            max: window.innerWidth,
          }
        },
        {
          animObject: animationObjects.screenHeight,
          value: {
            min: props.h,
            max: window.innerHeight,
          }
        },
      ])
    } catch (error) {
      console.log(error);
    }
  }
}

function E1(props) {
  if(props!=="LOADING"){
  return (
    <div>
      <div class="bg-red-700 w-full h-full font-size-xl"  style={{ width: props.w/2, height: props.h }}>
   {props.w}
     aaaaaaaa
      </div>
    </div>
  )
}
}
export { e1_init, E1 }