import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "../kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
const animationObjects = {}
function ExampleMain(props){
  const [w, wset] = new useState(window.innerWidth)
  const [h, hset] = new useState(window.innerHeight)
    useMemo(() => {
    const screenWidthProp = new Prop("useState", [w, wset])
    const screenHeightProp = new Prop("useState", [h, hset])
    console.log(props)
    animationObjects.screenWidth = new Lerp(props.animator, screenWidthProp, 90, 1)
    animationObjects.screenHeight = new Lerp(props.animator, screenHeightProp, 90, 1)
    window.addEventListener('resize', zoom);
    window.addEventListener('orientationchange', zoom);
    window.onbeforeunload = function () {
      window.removeEventListener('resize', zoom);
      window.removeEventListener('orientationchange', zoom);
      return({})
    };
    props.animator.init()
  }, [props.animator]);
  async function zoom() {
    try {
      props.animator.update([
        {
          animObject: animationObjects.screenWidth,
          value: {
            min: w,
            max: window.innerWidth,
          }
        },
        {
          animObject: animationObjects.screenHeight,
          value: {
            min: h,
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
    <div class="bg-red-700" style={{width:w,height:h}}>
        {'selector && <example2/>'}
    </div>
)
}
export {ExampleMain}