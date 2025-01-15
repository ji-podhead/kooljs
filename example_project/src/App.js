import './App.css';
import { e1_init, E1 } from './examples/e1';
import { e2_init, E2 } from './examples/e2';
import { Animator} from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';
function App() {
  const [fps, setFps] = useState(24)
  const [play, setPlay] = useState(false)
  //const [, setExampleProps] = useState(["LOADING"])
  //const [example_selector, example_selector_set] = new useState(0)
  useEffect(() => {
    const animator = new Animator(fps)
    //const utilProps = { animator, play, setPlay, fps, setFps }
    new Promise((resolve) => {
      e2_init(animator)
      resolve();
    }).then(() => {
      animator.init(true);
    });
  }, []);
  return (
    <div>
      <div className="App" class="bg-blue-100 w-full h-full" style={{width:window.innerWidth, height:window.innerHeight}}>
        <E2></E2>        
      </div>
    </div>
  );
}

export default App;