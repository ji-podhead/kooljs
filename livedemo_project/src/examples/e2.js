import ExampleDescription from "./utils/utils";
// this is our placeholder dict for the elements that get animated
var animationProps = {
  setc: ((val) => {
      document.getElementById("e2_b").style.transform = `translate(0,${val}%)`;
      //console.log(document.getElementById("b").style.transform) 
    }),
    animator:undefined,
    target_a:undefined
}

// utility functions to start the animation and update the sequence
const update=(() => {
    animationProps.animator.update_lerp([{id: animationProps.target_a.id,values:  [0, 100 ,0,200,100,300,200,400,300,0]}])
   })
const start=(()=>{
    animationProps.animator.start_animations([animationProps.target_a.id])
   })
const stop=(()=>{
  animationProps.animator.stop_animations([animationProps.target_a.id])
  })
const reset=(()=>{
  animationProps.animator.reset_animations([animationProps.target_a.id])
  })
const init=(()=>{
  animationProps.animator.init()
  })
// the divs that get animated
function Example(animator) {
  
    animationProps.animator=animator
    animationProps.target_a=animator.Lerp({ 
      render_callback: animationProps.setc, 
        duration: 10, 
        steps: [0, 400, 0],
        steps_max_length:10,
  })
    return (
    <div class="w-full h-full bg-[#ffffff]">
      <ExampleDescription header={header} description={exampleDiscription}/>
      <div class="w-full h-full items-center justify-center flex flex-col">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="e2_a" class="w-10 h-10 bg-blue-400">a</div>
          <div id="e2_b" class="w-10 h-10 bg-blue-500">b</div>
        </div>
      </div>
    </div>
  )}

const header="Animation Squences"
const exampleDiscription=`This example demonstrates how to create animations using a sequence instead of min/max values.
you can change the sequence by calling animator.update(). If you dont specify the max length of the sequence using the sequence_max_lengt argument, the length of the initial array will be used.`
const mdFile = `\`\`\`javascript
  // this is our placeholder dict for the elements that get animated
  var animationProps = {
    setc: ((val) => {
        document.getElementById("b").style.transform = \`translate(\${val}%)\`;
        console.log(document.getElementById("b").style.transform) 
      }),
      animator:undefined,
      target:undefined
  }
  
  // utility functions to start the animation and update the sequence
  const update=(() => {
      animationProps.animator.update_lerp([{animObject: animationProps.target,value: [0.0, 100.0, 0.0]}])
     })
  const start=(()=>{
      animationProps.animator.start([animationProps.target.id])
     })
    
  // the divs that get animated
  function E2(animator) {
      animationProps.animator=animator
      animationProps.target=animator.Lerp({ accessor: [animationProps.c, animationProps.setc], duration: 10, steps: [0.1, 400.1, 0.1, 100, 20, 30, 40, 500, 0],sequence_max_lengt:10 })
    return (
      <div class="w-full h-full flex flex-row">
        <div class="w-full h-full items-center justify-center flex flex-col ">
          <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
            <div id="a" class="w-10 h-10 bg-blue-400">a</div>
            <div id="b" class="w-10 h-10 bg-blue-500">b</div>
          </div>
        </div>
      </div>
    )}
  \`\`\``
const Controls=[
  {
    name:"Start Animation",
    info:" This Event will start the animation with the values lerpPoint values that where set the last time. The initial values are the ones we have used for the initialisation of the Lerpclass: [0.1, 400.1 ,0.1 ,100, 20, 30, 40, 500, 0]",
    button:{
      name:"start",
      onClick: start
    }
  },
  
  {
    name:"stop animation",
    info:"Stops the animation sequence.",
    button:{
      name:"stop",
      onClick:() => {stop() }
    },
  },
  {
    name:"reset animation",
    info:"Resets the animation sequence.",
    button:{
      name:"reset",
      onClick:() => {reset() }
    },
  },
  {
    name:"Update Sequence",
    info:"Updates the animation sequence. The new array is [0.0, 100.0, 0.0]. It will also reset the animation state and restart the animation.",
    button:{
      name:"update sequence",
      onClick:() => {update() }
    }
  },
  {
    name:"initliaize Animator",
    info:"initliazes the animator. Note that if you updated the sequence, the original sequece will get copied to the worker, since this is the initial value that is stored in the animator.",
    button:{
      name:"initialize Animator",
      onClick:() => {init() }
    }
  },   
]

const TutorialWidget={
  name:"simple_Animation_2",
  info: "This Examples shows how to use Lerp animation with a sequence.",
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e3.js",
  mdfile:mdFile
}

export { Example,Controls,TutorialWidget }

