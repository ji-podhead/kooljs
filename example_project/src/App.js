import './App.css';
import { e1_init, E1 } from './examples/exampleMain';
import { Animator} from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';
const exampleProps=[{w:0,h:0}]
function App() {

  // ----------------------------------------------------------------------
  //  Those are the the parameters we define for managing the Animations.
  //  We also define some UseState Values that will get animated in exampleMain.js.
  //  w & h are the animated  screenSize parameter we use in the other examples.
  // -----------------------------------------------------------------------
  //utils  
  const [fps, setFps] = useState(900)
  const [play, setPlay] = useState(false)
  //const [, setExampleProps] = useState(["LOADING"])
  const [example_selector, example_selector_set] = new useState(0)
  // Example1
  const [w, wset] = new useState(window.innerWidth)
  const [h, hset] = new useState(window.innerHeight)
  const [t, tset] = new useState(0)
  useMemo(() => {
    console.log("---------------------------")
    console.log(`${w} ${window.innerWidth} | ${h} ${window.innerHeight}  | ${t}   `)
    console.log("---------------------------")
  }, [w,h,t])
  useEffect(() => {
    const animator = new Animator()
    const e1Props = { animator, w, wset, h, hset, t, tset }
    
    const utilProps = { animator, play, setPlay, fps, setFps, example_selector, example_selector_set }
    new Promise((resolve) => {
      e1_init(e1Props,w,h)
      resolve();
    }).then(() => {
      utilProps.animator.init(true);
    });
  }, []);
  return (
    <div>
      <div className="App" style={{ width: w, height: h }} class="bg-red-500">
      {t}
        
      </div>
    </div>
  );
}

export default App;