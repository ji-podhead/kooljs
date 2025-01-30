import{addTrigger,removeTrigger,
  get_time,current_step,
  start_animations,stop_animations,
  setLerp,setMatrix,
  get_lerp_value,
  reset_lerp,
  change_framerate} from "../kooljs/worker"
// this is our placeholder dict for the elements that get animated
var animationProps = {
  setc: ((val) => {
      document.getElementById("b").style.transform = `translate(0,${val}%)`;
      console.log(document.getElementById("b").style.transform) 
    }),
    animator:undefined,
    target:undefined
}

// utility functions to start the animation and update the sequence
const update=(() => {
    animationProps.animator.update_lerp([{id: animationProps.target.id,values:  [0.1, 400.1 ,0.1]}])
   })
const start=(()=>{
    animationProps.animator.start_animations([animationProps.target.id])
   })
const stop=(()=>{
  animationProps.animator.reset_animations([animationProps.target.id]).then(()=>{
    console.log("stop")
}
  )
  
  })
  
// the divs that get animated
function E2(animator) {
  
    animationProps.animator=animator
    animationProps.target=animator.Lerp({ 
        accessor: [animationProps.c, animationProps.setc], 
        duration: 10, 
        steps: [0.1, 400.1, 0.1, 100, 20, 30, 40, 500, 0],
        steps_max_length:20,
        loop:true,      
        callback:{
        callback:`(({id})=>{setLerp(id,1,Math.random()*255);console.log(id)})`,
        condition:`(({step})=>step==0)`
    } })
    return (
    <div class="w-full h-full bg-[#ffffff]">
      <div class="z-10 w-1/2 h-1/4 absolute flex pointer-events-none  flex flex-col items-center" style={{ width:window.innerWidth*0.67}}>
      <div class=" rounded-b-md   max-w-[45%]  text-black bg-[#5C8F8D]  items-center bg-opacity-45 border-b-2 border-l-2 border-r-2 border-black">
      <div class=" text-xl ">
        Example 2: Animation Squences
      </div>
      <div class=" text-sm pl-5 text-left text-wrap w-[90%]">
        This example demonstrates how to create animations using a sequence instead of min/max values.
        you can change the sequence by calling animator.update(). If you dont specify the max length of the sequence using the sequence_max_lengt argument, the length of the initial array will be used.
      </div>
      </div>
      </div>
      <div class="w-full h-full items-center justify-center flex flex-col">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="a" class="w-10 h-10 bg-blue-400">a</div>
          <div id="b" class="w-10 h-10 bg-blue-500">b</div>
        </div>
      </div>
    </div>
  )}


  // this is just util stuff for the example project
  const md2 = `\`\`\`javascript
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
const Controls2=[
  {
    name:"Start Animation",
    info:" This Event will start the animation with the values lerpPoint values that where set the last time. The initial values are the ones we have used for the initialisation of the Lerpclass: [0.1, 400.1 ,0.1 ,100, 20, 30, 40, 500, 0]",
    button:{
      name:"start",
      onClick: start
    }
  },
  {
    name:"Update Sequence",
    info:"This Event will update the animation sequence. The new array is [0.0, 100.0, 0.0]. It will also reset the animation state and restart the animation.",
    button:{
      name:"update sequence",
      onClick:() => {update() }
    }
  },
    {
    name:"stop animation",
    info:"This Event will stop the animation sequence.",
    button:{
      name:"stop",
      onClick:() => {stop() }
    }
  }
  ]

const TutorialWidget2={
  name:"simple_Animation_2",
  info: "This Examples shows how to use Lerp animation with a sequence.",
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e3.js",
  mdfile:md2
}

export { E2,Controls2,TutorialWidget2 }

