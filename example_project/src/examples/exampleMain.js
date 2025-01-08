import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "../kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
const animationObjects = {}
function ExampleMain(mainProps){
 
    useMemo(() => {
    const screenWidthProp = new Prop("useState", [mainProps.w, mainProps.wset])
    const screenHeightProp = new Prop("useState", [mainProps.h, mainProps.hset])
    animationObjects.screenWidth = new Lerp(mainProps.animator, screenWidthProp, 90, 1)
    animationObjects.screenHeight = new Lerp(mainProps.animator, screenHeightProp, 90, 1)
    window.addEventListener('resize', zoom);
    window.addEventListener('orientationchange', zoom);
    window.onbeforeunload = function () {
      window.removeEventListener('resize', zoom);
      window.removeEventListener('orientationchange', zoom);
    };
    mainProps.animator.init()
  }, []);
  async function zoom() {
    try {
      mainProps.animator.update([
        {
          animObject: animationObjects.screenWidth,
          value: {
            min: mainProps.w,
            max: window.innerWidth,
          }
        },
        {
          animObject: animationObjects.screenHeight,
          value: {
            min: mainProps.h,
            max: window.innerHeight,
          }
        },
      ]
      )
    } catch (error) {
      console.log(error);
    }
  }
  return    (
    <div class="bg-red-700" style={{width:mainProps.w,height:mainProps.h}}>
        {'selector && <example2/>'}
    </div>
)
}
export {ExampleMain}