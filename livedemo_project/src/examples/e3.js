var animationProps = {
    animator:undefined,
    target_a:undefined,
    target_b:undefined,
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
const add_trigger=(()=>{
  animationProps.animator.addTrigger(animationProps.target_a.id,animationProps.target_b.id,1,9)
  })
const remove_trigger=(()=>{
  animationProps.animator.removeTrigger(animationProps.target_a.id,animationProps.target_b.id,1,9)
  })
  function Example(animator) {
  
    animationProps.animator=animator
    animationProps.target_a=animator.Lerp({ 
      render_callback: ((val)=>document.getElementById("e3_a").style.transform = `translate(0,${val}%)`),
        duration: 40, 
        steps: [0, 400, 0],
        steps_max_length:10,
        loop:true
  })
  animationProps.target_b=animator.Lerp({ 
    render_callback: ((val)=>document.getElementById("e3_b").style.transform = `translate(0,${val}%)`),
      duration: 10, 
      steps: [0, 400, 0],
})
    return (
    <div class="w-full h-full bg-[#ffffff]">
      <div class="z-10 w-1/2 h-1/4 absolute flex pointer-events-none  flex flex-col items-center" style={{ width:window.innerWidth*0.67}}>
      <div class=" rounded-b-md   max-w-[45%]  text-black bg-[#5C8F8D]  items-center bg-opacity-45 border-b-2 border-l-2 border-r-2 border-black">
      <div class=" text-xl ">
        Triggers
      </div>
      <div class=" text-sm pl-5 text-left text-wrap w-[90%]">
        This example demonstrates how to create animations using a sequence instead of min/max values.
        you can change the sequence by calling animator.update(). If you dont specify the max length of the sequence using the sequence_max_lengt argument, the length of the initial array will be used.
      </div>
      </div>
      </div>
      <div class="w-full h-full items-center justify-center flex flex-col">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="e3_a" class="w-10 h-10 bg-blue-400">a</div>
          <div id="e3_b" class="w-10 h-10 bg-blue-500">b</div>
        </div>
      </div>
    </div>
  )}


  // this is just util stuff for the example project
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
    info:" This Event will start the animation of target_a. Notice that the animation is looped.",
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
    name:"add Trigger",
    info:"Adds target_b as trigger of target_a. The trigger events starts when step is 2 and the delta_t is 0.1 ",
    button:{
      name:"add",
      onClick:() => {add_trigger() }
    }
  }, 
  {
    name:"remove Trigger",
    info:"Removes target_b from taget_b trigger targets.",
    button:{
      name:"remove",
      onClick:() => {remove_trigger() }
    }
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
    info:"Updates the animation sequence. The new Sequence has a length of 10, hence we used the steps_max_length parameter.",
    button:{
      name:"update",
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

