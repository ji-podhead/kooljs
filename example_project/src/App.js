import logo from './logo.svg';
import './App.css';
import Main from './app/main'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "./app/kooljs/animations"

const mainProps = {
  screenSize: {
    screenWidth: undefined,
    screenHeight: undefined,
    isPortrait: undefined,
    sidebarWidth: undefined,
    taskbarHeight: undefined,
    scrollbarWidth: undefined,
  },
  animator: undefined,
  animation_speed: undefined,
  play: undefined
}
const animationObjects = {}
function Animations(w, wset, h, hset) {
  useMemo(() => {
    const screenWidthProp = new Prop("useState", [w, wset], mainProps.screenSize.screenWidth)
    const screenHeightProp = new Prop("useState", [h, hset], mainProps.screenSize.screenHeight)
    mainProps.screenSize.screenHeight = window.innerHeight
    mainProps.screenSize.screenWidth = window.innerWidth
    const animator = new Animator()
    mainProps.animator = animator
    animationObjects.screenWidth = new Lerp(animator, screenWidthProp, 90, 1)
    animationObjects.screenHeight = new Lerp(animator, screenHeightProp, 90, 1)
    window.addEventListener('resize', zoom);
    window.addEventListener('orientationchange', zoom);
    window.onbeforeunload = function () {
      window.removeEventListener('resize', zoom);
      window.removeEventListener('orientationchange', zoom);
    };
    animator.init()
  }, []);
  async function zoom() {
    try {
      setIsPortrait(window.innerWidth < window.innerHeight);
      mainProps.animator.update([
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
}
function App() {
  const [fps, setFps] = useState(900)
  const [play, setPlay] = useState(false)
  const [w, wset] = new useState(window.innerWidth)
  const [h, hset] = new useState(window.innerHeight)
  Animations(w, wset, h, hset)
  return (
    <div className="App" >

      <div style={{ width: w, height: h }} class=" bg-red-500 w-full h-full">
        'w: {w} ww: {window.innerWidth} h: {h} wh: {window.innerHeight}'
        <div class="w-[20%] h-[20%] bg-slate-200 flex flex-col">
          <div className='w-full h-1/3'>
            Speed {fps} ms
          </div>
          <button class="bg-green-800 w-1/2 h-full" onClick={() => {
            setFps(fps + 100)
            mainProps.animator.setFPS(fps + 100)
          }}>
            +100ms
          </button>
          <button class="bg-red-500 h-full w-1/2" onClick={() => {
            setFps(fps - 100)
            mainProps.animator.setFPS(fps - 100)
          }}>
            -100ms
          </button>
        </div>

        <div class="w-[20%] h-[20%] bg-slate-400 flex flex-col">
          <div className='w-full h-1/3'>
            Animation status {play}
          </div>
          <button class="bg-red-800 w-1/2 h-full" onClick={() => {
            setPlay(true)
            mainProps.animator.start()
          }}>
            start
          </button>
          <button class="bg-slate-700 h-full w-1/2" onClick={() => {
            setPlay(false)
            mainProps.animator.stop()
          }}>
            stop
          </button>
        </div>

      </div>
      {/* {<Main class={''} mainProps={mainProps} />} */}
    </div>
  );
}
function App_Wrapper() {
  return (
    <div>
      <App />
    </div>
  );
}
export default App_Wrapper;