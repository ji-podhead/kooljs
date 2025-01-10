import './App.css';
import { ExampleMain } from './examples/exampleMain';
import { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger } from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';


function App_Wrapper() {

// ----------------------------------------------------------------------
//  Those are the the parameters we define for managing the Animations.
//  We also define some UseState Values that will get animated in exampleMain.js.
//  w & h are the animated  screenSize parameter we use in the other examples.
// -----------------------------------------------------------------------
  const [fps, setFps] = useState(900)
  const [play, setPlay] = useState(false)

  const [example_selector, example_selector_set] = new useState(0)
  const mainProps = useMemo(() =>({
      animator: new Animator(),
      play:play,
      setPlay:setPlay,
      fps:fps,
      setFps:setFps,
      example_selector:example_selector,
      example_selector_set:example_selector_set,
    }),[]);
  return (
    <div>
    <div className="App" style={{width: window.innerWidth, height: window.innerHeight}}>
    <ExampleMain props={mainProps}/>
    </div>
    </div>
  );
}
export default App_Wrapper;