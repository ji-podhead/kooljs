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
  screens: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  pages: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    guide: 'Guide',
    blog: 'Blog',
    contact: 'Contact'
  },
  animator: undefined,
  animation_speed: undefined,
  play: undefined
}
const animationObjects = {
  //sidebarWidth:{setValue:setSidebarWidth, currentValue:sidebarWidth,min:0,max:targetSidebarWidth,targetValue:targetSidebarWidth},
  //taskbarHeight:{setValue:setTaskbarHeight, currentValue:taskbarHeight,min:0,max:targetTaskbarHeight,targetValue:targetTaskbarHeight},
  //scrollbarWidth:{setValue:setScrollbarWidth, currentValue:scrollbarWidth, min:0,max:targetScrollbarWidth,targetValue:targetScrollbarWidth},
}
function Animations(w,wset,h,hset) {
  // const [sidebarWidth,setSidebarWidth,sidebarWidthProp] = new Prop("int",0,mainProps.screenSize.sidebarWidth)
  // const [taskbarHeight,setTaskbarHeight,taskbarHeightProp] = new Prop("int",0,mainProps.screenSize.taskbarHeight)
  // const [scrollbarWidth,setScrollbarWidth,scrollbarWidthProp] = new Prop("int",0,mainProps.screenSize.scrollbarWidth)
  const [initialized = mainProps.screenSize.initialized, set_Initialized] = useState(false);
  const [isPortrait = mainProps.screenSize.isPortrait, setIsPortrait] = useState(true);
  const [screen = mainProps.screenSize.screen, setScreen] = useState("xs");
  useMemo(() => {
    const screenWidthProp = new Prop("useState", [w,wset], mainProps.screenSize.screenWidth)
    const screenHeightProp = new Prop("useState",[h,hset], mainProps.screenSize.screenHeight)
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
  const [w,wset]= new useState(window.innerWidth)
  const [h,hset]= new useState(window.innerHeight)
  Animations(w,wset,h,hset)
  return (
    <div className="App" >
    
      <div style={{ width: w, height: h}} class=" bg-red-500 w-full h-full">
      'w: {w} ww: {window.innerWidth} h: {h} wh: {window.innerHeight}'
        <div class="w-[20%] h-[20%] bg-slate-200 flex flex-col">
          <div className='w-full h-1/3'>
            Speed {fps} ms
          </div>
          <button class="bg-green-800 w-1/2 h-full" onClick={() => {
            setFps(fps + 100)
            mainProps.animator.setFPS(fps+100)
          }}>
            +100ms
          </button>
          <button class="bg-red-500 h-full w-1/2" onClick={() => {
            setFps(fps - 100)
            mainProps.animator.setFPS(fps-100)
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
// Wir benutzen den wrapper einfach weil wir nicht durch das rendern
// ständig den UseEffect aufruft der unsere animationobjects initilisiert
function App_Wrapper() {
  

  return (
    <div>

      <App />
    </div>
  );
}
export default App_Wrapper;



//BEI ZOOM:



// const targetSidebarWidth = (isPortrait ? Math.round(screenHeight * 0.2) : Math.round(screenWidth * 0.2));
// const targetTaskbarHeight = (Math.round(screenHeight * 0.05));
// const targetScrollbarWidth = (Math.round(screenWidth * 0.02));
// animate(animationObjects).then(() => {
//   console.log("done");
//   if (window.innerWidth < 640) {
//     setScreen("xs")
//   } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
//     setScreen("sm")
//   } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
//     setScreen("md")
//   } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
//     setScreen("lg")
//   } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
//     setScreen("xl")
//   } else if (window.innerWidth >= 1536) {
//     setScreen("2xl")
//   }
// });





// useState: Verwaltet den Zustand einer Komponente. 
// Wird verwendet, um Variablen zu erstellen und zu aktualisieren, die den Zustand einer Komponente darstellen.

// useEffect: Führt eine Funktion aus, wenn die Komponente gerendert wird oder wenn sich bestimmte Werte ändern. 
// Wird verwendet, um Seiteneffekte wie API-Aufrufe oder DOM-Manipulationen durchzuführen.

// useContext: Gibt Zugriff auf den Kontext einer Komponente. 
// Wird verwendet, um Werte aus dem Kontext zu lesen und zu aktualisieren.

// useReducer: Verwaltet den Zustand einer Komponente mit einem Reducer. 
// Wird verwendet, um komplexen Zustand zu verwalten und zu aktualisieren.

// useCallback: Memoisiert eine Funktion, damit sie nicht bei jedem Rendern neu erstellt wird. 
// Wird verwendet, um Funktionen zu optimieren, die als Props an andere Komponenten übergeben werden.

// useMemo: Memoisiert einen Wert, damit er nicht bei jedem Rendern neu berechnet wird. 
// Wird verwendet, um teure Berechnungen zu optimieren.

// useRef: Erstellt eine Referenz auf ein DOM-Element oder eine andere Variable. 
// Wird verwendet, um auf DOM-Elemente zuzugreifen oder Variablen zu speichern, die den Zustand einer Komponente darstellen.

// useLayoutEffect: Führt eine Funktion aus, nachdem die Komponente gerendert wurde und die DOM-Änderungen angewendet wurden. 
// Wird verwendet, um DOM-Manipulationen durchzuführen, die auf die Layout-Änderungen reagieren.

// useTransition: Verwaltet den Übergang zwischen verschiedenen Zuständen einer Komponente. 
// Wird verwendet, um komplexe Übergänge zu verwalten und zu optimieren.