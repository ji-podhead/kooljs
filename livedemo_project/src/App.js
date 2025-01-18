import './App.css';
import { e1_init, E1 } from './examples/e1';
import { e2_init, E2 } from './examples/e3';
import { e3_init, E3, Controls3, TutorialWidget3 } from './examples/e3';
import { Widgets, AnimationControl, Header, CodeBlocks } from "./utils"
import { Animator } from "./kooljs/animations"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Util } from './kooljs/util_component';
const TutorialComponents = [undefined, undefined, Controls3]
const Animated_Components = [undefined, undefined]
function App() {
  const animator = new Animator(24)
  const [fps, setFps] = useState(24)
  const [play, setPlay] = useState(false)
  const [selector, setSelector] = useState(-1)
  useEffect(() => {
    new Promise((resolve) => {
      Animated_Components.push(E3(animator))
      resolve();
    }).then(() => {
      animator.init(true);
      setSelector(2)
    });
  }, []);

  return (

<div class="App  bg-[#242d36] w-full h-full flex flex-col  items-center justify-center" style={{ width: window.innerWidth, height: window.innerHeight }}>
aaaaaaaaaaaaaaaaaaaa
      <div class=" w-[95%]  h-[7%] " >
          <Header />
        </div>
        <div class="flex flex-col w-[95%] h-[90%] items-center justify-center">

        <div class="w-full h-full flex flex-row">
          <div class="w-[30%] h-full ">
            <AnimationControl args={{ comp: TutorialComponents, sel: selector }} />
          </div>
          <div class="w-full h-full flew flex-col bg-white">
            <div class="w-full h-[50%]">
              {Animated_Components[selector]}
            </div>
            <div class="h-[50%] ">
              <CodeBlocks sel={selector} />
            </div>
          </div >
          <div class="w-[20%] h-full ">
            <Widgets setsel={setSelector} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
