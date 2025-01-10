import './App.css';
import { e1_init, E1 } from './examples/exampleMain';
import { Animator} from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';
function App() {

  // ----------------------------------------------------------------------
  //  Those are the the parameters we define for managing the Animations.
  //  We also define some UseState Values that will get animated in exampleMain.js.
  //  w & h are the animated  screenSize parameter we use in the other examples.
  // -----------------------------------------------------------------------
  //utils  
  const [fps, setFps] = useState(24)
  const [play, setPlay] = useState(false)
  //const [, setExampleProps] = useState(["LOADING"])
  //const [example_selector, example_selector_set] = new useState(0)
  // Example1

  useEffect(() => {
    const animator = new Animator(fps)
    //const utilProps = { animator, play, setPlay, fps, setFps }
    new Promise((resolve) => {
      e1_init(animator)
      resolve();
    }).then(() => {
      animator.init(true);
    });
  }, []);
  return (
    <div>
      <div className="App" class="bg-blue-100 w-full h-full" style={{width:window.innerWidth, height:window.innerHeight}}>
        <E1></E1>        
      </div>
    </div>
  );
}

export default App;