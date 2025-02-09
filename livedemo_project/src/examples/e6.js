import ExampleDescription from "./utils/utils";
import   {
  get_status,
  addTrigger,removeTrigger,
  get_time,set_delta_t,
  get_step,set_step,
  is_active,get_active,
  start_animations,stop_animations,
  setLerp,setMatrix,
  get_lerp_value,
  soft_reset,hard_reset,
  get_duration,set_duration,
  set_sequence_length,
  change_framerate,
  get_constant,get_constant_number,get_constant_row,render_constant,
  update_constant,
  set_delay,get_delay,
  get_delay_delta,set_delay_delta,
  lambda_call
} from 'kooljs/worker'
const animProps={
  animator:undefined,//                      <- animator               << Animator >> 
  start_animation:undefined,//               <- random values + start  << Animator.Lambda >>
  size_animation:undefined,//                <- single number lerp     << Lerp >>
  size_constant:undefined,//                 <- xy                     << Constant-Matrix >>
  color_animation:undefined,//               <- xyz                    << MatrixLerp >> 
  size_constant_id:undefined
}
function bg(val){
  return `linear-gradient(to right, rgb(0,0,0), rgb(${val[0]}, ${val[1]}, ${val[2]})`
}
function setStyle(val){
  console.log(val)
  document.getElementById("inner").style.width = `${Math.floor(val[0])}%`;
  document.getElementById("inner").style.height = `${Math.floor(val[1])}%`;
}
function Example(animator) {
    animProps.animator=animator
    animProps.color_animation=animator.Matrix_Lerp({
      render_callback:((val)=>document.getElementById("main").style.background = (bg(val))),
      steps:[[0,0,0],[50,50,255]],
      duration:10
    })
    animProps.size_animation=animator.Matrix_Lerp({ 
        render_callback:((val)=>setStyle(val)),
        duration: 10, 
        steps: [[0,0],[100,100]],
    })
    animProps.size_constant_id=animator.get_constant_size("matrix")
    animProps.start_animation = animator.Lambda({
      callback:  (()=>{
        setMatrix(`${animProps.color_animation.id}`,1, [Math.random()*50, Math.random()*50, Math.random()*255]);
        const random_size=get_constant_row(`${animProps.size_constant_id}`,0);
        console.log(random_size);
        setMatrix(`${animProps.size_animation.id}`,1, random_size);
        start_animations([`${animProps.size_animation.id}`])
      }),
      animProps:animProps
    }) 
    animProps.size_constant=animator.constant({
      type:"matrix",
      value:[[0,0,0],[50,50,255]],
      render_triggers:[animProps.color_animation.id],
      render_callbacks:[{id:animProps.start_animation.id,args: undefined }]
    })
    return (
    <div class="w-full h-full bg-slate-700">
      <ExampleDescription header={header} description={exampleDiscription}/>
      <div class="w-full h-full flex items-center justify-center">
      <div id={"main"} key={"main"} class="w-[95%] h-[95%] bg-[#21d9cd] border-4 border-[#21d9cd] flex rounded-md justify-center justify-items-center items-center">
      <div id={"inner"} key={"inner"} class="w-10 h-10 bg-white">
          inner
      </div>
      </div>
    </div>
    </div>
  )}
const set_size=(()=>{
    //animProps.animator.start_animations([animProps.size_animation.id])
    animProps.animator.update_constant([{type:"matrix",id:animProps.size_constant.id,value:[(30+Math.random()*70),30+Math.random()*70]}])
})
const start=(()=>{
  animProps.animator.start()
})
const stop=(()=>{
  animProps.animator.stop()
})
const header="callbacks"
const exampleDiscription=`This example demonstrates how to create animations using a sequence instead of min/max values.
you can change the sequence by calling animator.update(). If you dont specify the max length of the sequence using the sequence_max_lengt argument, the length of the initial array will be used.
`
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
      animator.update_lerp([{animObject: animationProps.target,value: [0.0, 100.0, 0.0]}])
     })
  const start=(()=>{
      animator.start([animationProps.target.id])
     })
    
  // the divs that get animated
  function E2(animator) {
      animator=animator
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
    name:"set random size",
    info:"Stops the animation sequence using the function thats running on the worker.",
    button:{
      name:"set random size",
      onClick: set_size
    },
  },
  {
    name:"Start",
    info:"This event will continues to play any animation, that was running before calling stop().",
    button:{
      name:"start",
      onClick: start
    }
  },
  {
    name:"Stop",
    info:"This event will pause the animation-loop, but any running animations wont reset when you call start() again.",
    button:{
      name:"stop",
      onClick: stop
    },
  },
]

const TutorialWidget={
  name:"simple_Animation_2",
  info: "This Examples shows how to use Lerp animation with a sequence.",
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e3.js",
  mdfile:mdFile
}

export { Example,Controls,TutorialWidget }

