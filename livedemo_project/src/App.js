
import './App.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animator } from "./kooljs/animations"
import {  Example as E1 } from './examples/e1';
import {  Example as E2 } from './examples/e2';
import {  Example as E3} from './examples/e3';
import {  Example as E4} from './examples/e4';
import {  Example as E5} from './examples/e5';
import {  Example as E6} from './examples/e6';

import { Widgets, AnimationControl, Header, CodeBlocks } from "./utils"
import { Util } from './kooljs/util_component';
const Animated_Components = []
const animator = new Animator(50)
function App() {
  
    const [fps, setFps] = useState(24)
  const [play, setPlay] = useState(false)
  const [selector, setSelector] = useState(-1)
  useEffect(() => {
    new Promise((resolve) => {
      Animated_Components.push(E1(animator))
      Animated_Components.push(E2(animator))
      Animated_Components.push(E3(animator))
      Animated_Components.push(E4(animator))
      Animated_Components.push(E5(animator))
      Animated_Components.push(E6(animator))
      resolve();
    }).then(() => {
      animator.init(true);
      setSelector(0)
    });
  }, []);

  return (

    <div class="App  bg-[#242d36] w-full h-full flex flex-col  items-center justify-center" style={{ width: window.innerWidth, height: window.innerHeight }}>
      <div class=" w-[95%]  h-[7%] " >
        <Header />
      </div>
      <div class="flex flex-col w-[95%] h-[90%] items-center justify-center">

        <div class="w-full h-full flex flex-row">
          <div class="w-[20%] h-full ">
            <AnimationControl args={{ sel: selector }} />
          </div>
          <div class="w-[80%] h-full flew flex-col bg-white border-r-4 border-r-[#BF8DE1] rounded-br-md border-b-[#BF8DE1]">
            <div class="w-full h-[50%] flex flex-row">
              <div class="w-full h-full flex flex-row">
                <div class="w-[90%] h-full">
                  {Animated_Components[selector]}
                </div>
                <div class="w-[10%] h-full ">
                  <Widgets setsel={setSelector} animator={animator} />
                </div>
              </div>
            </div>
            <div class="h-[50%] w-full ">
              <CodeBlocks sel={selector} />
            </div>
          </div >
        </div>
      </div>
    </div>
  );
}

export default App;
