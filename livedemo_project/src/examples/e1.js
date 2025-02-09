import { useEffect, useMemo } from "react";
import { Animator } from "kooljs/";
Animator()

// this is our placeholder dict for the elements that get animated
var animationProps = {
    animator:undefined,
    target_a:undefined,
    target_b:undefined,
}

const start_a=(()=>{animationProps.animator.start_animations([animationProps.target_a.id])})
const start_b=(()=>{animationProps.animator.start_animations([animationProps.target_b.id])})
const stop=(()=>{animationProps.animator.stop()})
const animationB=(()=>{
  // animationProps.target_b=animationProps.animator.Lerp({ 
  //   render_callback: ((val) => {
  //     document.getElementById("e1_b").style.transform = `translate(0,${val}%)`;
  //   }), 
  //   duration: 40, 
  //   steps: [0, 400],
  // })
  return(
  <div>  
  <div id="e1_b" key="e1_b" class="w-10 h-10 bg-blue-500">b</div>
  </div>
  )}
  )
function Example(animator) {
 //const B1 = useEffect(()=>{
 //const animator=   new Animator(40)
  animationProps.animator=animator 
  animationProps.target_a=animator.Lerp({ 
        render_callback: ((val) => {
          document.getElementById("e1_a").style.transform = `translate(0,${val}%)`;
        }), 
        duration: 50, 
        steps: [0, 400],
     })
     animationProps.target_b=animationProps.animator.Lerp({ 
      render_callback: ((val) => {
        document.getElementById("e1_b").style.transform = `translate(0,${val}%)`;
      }), 
      duration: 40, 
      steps: [0, 400],
   })
  //animator.init()
 // return(animationB())
//},[])
    const B1 =animationB
    return (
    <div class="w-full h-full bg-[#bbe2de]">
      <div class="z-10 w-1/2 h-1/4 absolute flex pointer-events-none  flex flex-col items-center" style={{ width:window.innerWidth*0.67}}>
      <div class=" rounded-b-md   max-w-[45%]  text-black bg-[#5C8F8D] justify-items-center items-center bg-opacity-45 border-b-2 border-l-2 border-r-2 border-black">
      <div class=" text-xl ">
        Initializing Animator
      </div>
      <div class=" text-sm text-left text-wrap w-[90%]">
        This Example shows how to intitialize the animator in React.
      </div>
      </div>
      </div>

      <div class="w-full h-full items-center justify-center flex flex-col">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="e1_a" key="e1_a" class="w-10 h-10 bg-blue-400">a</div>
        <B1></B1>
        </div>
      </div>
    </div>
  )}


  // this is just util stuff for the example project
  const mdFile = `\`\`\`javascript
import { useEffect, useMemo } from "react";
import { Animator } from "../kooljs/animations";


// this is our placeholder dict for the elements that get animated
var animationProps = {
    animator:undefined,
    target_a:undefined,
    target_b:undefined,
}

const start_a=(()=>{animationProps.animator.start_animations([animationProps.target_a.id])})
const start_b=(()=>{animationProps.animator.start_animations([animationProps.target_b.id])})
const stop=(()=>{animationProps.animator.stop()})

const animationB=(()=>{
  animationProps.target_b=animationProps.animator.Lerp({ 
    render_callback: ((val) => {
      document.getElementById("e1_b").style.transform = \`translate(0,\${val}%)\`;
    }), 
    duration: 40, 
    steps: [0, 400],
  })
  return(
    <div>  
      <div id="e1_b" key="e1_b" class="w-10 h-10 bg-blue-500">b</div>
    </div>
    )
)}
  
function Example(animator) {
 const B1 = useEffect(()=>{
  const animator=   new Animator(40)
    animationProps.animator=animator 
    animationProps.target_a=animator.Lerp({ 
          render_callback: ((val) => {
            document.getElementById("e1_a").style.transform = \`translate(0,\${val}%)\`;
          }), 
          duration: 50, 
          steps: [0, 400],
      })
    animator.init()
    return(animationB())
  },[])
    const B1 =animationB
    return (
    <div class="w-full h-full bg-[#bbe2de]">
      <div class="w-full h-full items-center justify-center flex flex-col">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="e1_a" key="e1_a" class="w-10 h-10 bg-blue-400">a</div>
          <B1></B1>
        </div>
      </div>
    </div>
  )}
  \`\`\``
const Controls=[
  {
    name:"Start Animation a",
    info:"this event will start the animation declared in our main Example Function.",
    button:{
      name:"start_a",
      onClick: (()=>start_a())
    }
  },
  {
    name:"Start Animation b",
    info:"Starts the animation of the Component AnimationB which is called by our main component.",
    button:{
      name:"start_b",
      onClick: (()=>start_b())
    }
  },
  {
    name:"stop animation",
    info:"This Event will stop the animatior. Notice that if one sequence is not finished, it will startt as soon as any other animation gets started.",
    button:{
      name:"stop",
      onClick:(() => stop())
    }
  }
  ]

const TutorialWidget={
  name:"initialize Animator",
  info: "This Example should give you an idea about how to initialize the animator. After you created the animations, you need to call Animator.init() in order to copy the regsitry to the worker. It is possible to call the init() method redundantly, however keep in mind that this might cause a lot of overhead if you do this very often when having lots of animations.",
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e3.js",
  mdfile:mdFile
}

export { Example,Controls,TutorialWidget }

