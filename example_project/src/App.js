import './App.css';
import { ExampleMain } from './examples/exampleMain';
import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';
const mainProps = {
  animator: undefined,
  animation_speed: undefined,
  play: undefined,setPlay:undefined,
  fps:undefined,setFps:undefined,
  w:undefined,wset:undefined,
  h:undefined,hset:undefined,
  example_selector:undefined,example_selector_set:undefined
}
var Main=""
function App() {
  const [fps, setFps] = useState(900)
  const [play, setPlay] = useState(false)
  const [w, wset] = new useState(window.innerWidth)
  const [h, hset] = new useState(window.innerHeight)
  const [example_selector, example_selector_set] = new useState(0)
  useEffect(()=>{
    mainProps.animator = new Animator()
    mainProps.w=w;mainProps.wset=wset
    mainProps.h=h;mainProps.hset=hset
    mainProps.fps=fps;mainProps.setFps=setFps
    mainProps.play=play;mainProps.setPlay=setPlay
    mainProps.example_selector=example_selector;mainProps.example_selector_set=example_selector_set
  },[])
  return (
    <div className="App" style={{width: window.innerWidth, height: window.innerHeight}}>
      {mainProps.example_selector!=undefined&&<div>
        <ExampleMain mainProps={mainProps}/>
        <Util mainProps={mainProps}/>
      </div>}
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