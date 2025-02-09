import ExampleDescription from "./utils/utils";
import {get_time,stop_animations,setMatrix,get_lerp_value,soft_reset,hard_reset,set_duration,get_constant_number,get_constant_row,update_constant,lambda_call} from "kooljs/worker"
const length = 16       //          [opacity, w,  h, fontsize,      r,g,b]
const reference_matrix=[[-100,0,0,0,0,0,0],[100,    80, 40,   13,    100,130,255]] 
const animProps={
  animator:undefined,//                 <- animator               << Animator >> 
  idle_animation:undefined,//           <- idleAnims              << Lerp >> 
  boxes: new Array(length),//           <- boxes dict             << div | MatrixLerp >> 
  indices: new Float32Array(length),//  <- anim id's              << Float32 >> 
  selected: undefined,//                <- animator.const         << number >>
  status: undefined,//                  <- animator.const         << number >>
  reference_matrix: undefined,//        <- animator.const         << Float32 >>
  stop_active: undefined,//             <- resetting animation    << Animator.Lambda >>
  start_random: undefined,//            <- start anim             << Animator.Lambda >>
  replace_indices:undefined,//          <- edit values            << Animator.Lambda >>
  stop_idle:undefined,//                <- stops idle+active      << Animator.Lambda >>
  set_start_duration: undefined//       <- smooth start/end       << Animator.Lambda >>
}
function bg(val){
  return `linear-gradient(to right, rgb(0,0,0), rgb(${val[4]}, ${val[5]}, ${val[6]})`
}
function setStyle(id,val){
  //console.log(val)
  document.getElementById("e5_child"+id).style.opacity = `${val[0]}%`;
  document.getElementById("e5_child"+id).style.width = `${val[1]}%`;
  document.getElementById("e5_child"+id).style.height = `${val[2]}%`;
  document.getElementById("e5_child"+id).style.fontSize = `${val[3]*2}px`;
  document.getElementById("e5_child_small"+id).style.fontSize = `${val[3]}px`;
  document.getElementById("e5_"+id).style.background = bg(val);
}
function Example(animator) {
    animProps.animator=animator
    for (let i=0;i<length;i++){
      animProps.boxes[i]={
        anim: animator.Matrix_Lerp({ 
          render_callback:((val)=>setStyle(i,val)), 
          duration: 10, 
          steps: reference_matrix,
          loop:false,
          }),
        div:  <div 
              onMouseEnter={()=>{
                start_selected(animProps.indices.value[0][i])
              }}
              class="min-w-full min-h-full flex items-center rounded-md justify-center bg-black" 
              id={"e5_"+i} key={"e5_"+i}
              >
              <div id={"e5_child"+i} key={"e5_child"+i} class="w-0 h-0 truncate opacity-0 bg-white border-[#21d9cd] border-2 rounded-md flex-col gap-2 items-center justify-center" >
                <div class="text-center  "><b>Div No: {i}</b></div>
                <div id={"e5_child_small"+i} class="text-left w-[80%] h-[10%] pl-2" >
                  Line: --{1+Math.floor(i/4)}--
                </div>
              </div>
            </div>
        }
      animProps.indices[i]=animProps.boxes[i].anim.id
    }
    // a variable that represents our selected div on the worker
    animProps.selected=animator.constant({type:"number",value:0})
    // a constant that represents our reference matrix on the worker
    animProps.reference_matrix=animator.constant({
      type:"matrix",
      value:reference_matrix
    })
    // sets target lerp value to the required index of our reference matrix
    animProps.replace_indices = animator.Lambda({
      callback: (({index,ref_step})=>{
              setMatrix(index,0,get_lerp_value(index)) 
              setMatrix(index,1,get_constant_row(`${animProps.reference_matrix.id}`,ref_step)) 
              hard_reset(index)
      }),
      animProps:animProps
    })
    // a constant that represents the indices of animated divs in our worker-registry 
    animProps.indices=animator.constant({ 
      type:"matrix",
      value:[animProps.indices]
    })
    // inverts all divs if their value is not the start value
    animProps.stop_active = animator.Lambda({
      callback: (()=>{
        get_constant_row(`${animProps.indices.id}`,0).map((i)=>{
          if(get_constant_number(`${animProps.selected.id}`)!=i ){
            if( get_constant_row(`${animProps.reference_matrix.id}`,0)!=get_lerp_value(i))
            {
              lambda_call(`${animProps.replace_indices.id}`,{index:i,ref_step:0})
              set_duration(i, get_time(i)<3?3:get_time(i))
              soft_reset(i)
            }
          }
        })
      }),
      animProps:animProps
    })
    // set duration to 10 if progress < 5
    animProps.set_start_duration = animator.Lambda({
      callback: (({id})=>{
        set_duration(id,Math.floor(10-get_time(id)))
      }),
      animProps:animProps
    })
    animProps.start_random = animator.Lambda({
      callback: (()=>{
        const indices = get_constant_row(`${animProps.indices.id}`,0)
        const random_index=indices[Math.floor(Math.random()*indices.length)]
        console.log("new random selection is " + random_index)
        update_constant(`${animProps.selected.id}`,"number",random_index)  
        lambda_call(`${animProps.replace_indices.id}`,{index:random_index,ref_step:1})
        console.log("updated values")
        lambda_call(`${animProps.set_start_duration.id}`,{id:random_index})
        soft_reset(random_index)
        console.log("started animation with index " + random_index)
      }), 
      animProps:animProps
    })
    // our idle animation that is stopped/started once a user-mouse-event interacts with the grid
    // we use the renderinterval and duration to create some sort of animation-timeline
    // this way we only fire 20 function calls on the worker during one animation ciclus
    animProps.idle_animation= animator.Timeline({ 
      duration: 100,
      render_interval:20, 
      length:1,
      loop:true,
      callback:{
        callback:(({time})=>{
          console.log("----------timeline animation----------")
          console.log("time " + time)
          if(time==0){
                  update_constant(`${animProps.selected.id}`,"number",-1)        
                  lambda_call(`${animProps.stop_active.id}`)
                  lambda_call(`${animProps.start_random.id}`)
          }
          else if(time==80){
            const random_index = get_constant_number(`${animProps.selected.id}`)
            console.log("random selection is " + random_index)
            lambda_call(`${animProps.replace_indices.id}`,{index:random_index,ref_step:0})
            console.log("updated values")
            console.log("started animation with index " + random_index)
            soft_reset(random_index)
          }
            console.log("--------------------------------")
        }),
        animProps:animProps
      }
      })
      // a function we can call to stop the idle animation
      animProps.stop_idle = animator.Lambda({
        callback: (()=>{
            stop_animations([`${animProps.idle_animation.id}`])  
            update_constant(`${animProps.selected.id}`,"number",-1)        
            lambda_call(`${animProps.stop_active.id}`)
        }),
        animProps:animProps
      })    
    return (
    <div class="w-full h-full bg-slate-700" 
    onMouseEnter={start_idle}
    onMouseLeave={start_idle}
      >
      <ExampleDescription header={header} description={exampleDiscription}/>
      <div class="w-full h-full flex items-center justify-center">
      <div onMouseEnter={stop_idle} 
        class="w-[95%] h-[95%] bg-[#21d9cd] border-4 border-[#21d9cd] grid grid-cols-4 gap-1 rounded-md justify-center justify-items-center items-center">
        {animProps.boxes.map((e) => e.div)}
      </div>
    </div>
    </div>
  )}

const start_selected=((id)=>{
  requestAnimationFrame(() => {
  animProps.stop_idle.call()
  animProps.animator.update_constant([{type:"number",id: animProps.selected.id, value: id}])
  animProps.replace_indices.call({index:id,ref_step:1})
  animProps.set_start_duration.call({id:id})
  animProps.animator.start_animations([id])
  })
})
const stop_idle=(()=>{
    animProps.stop_idle.call()
})
const start_idle=(()=>{
  animProps.animator.start_animations([animProps.idle_animation.id])
})
const start=(()=>{
  animProps.animator.start()
})
const stop=(()=>{
  animProps.animator.stop_animations("all")
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
    name:"idle start",
    info:"Stops the animation sequence using the function thats running on the worker.",
    button:{
      name:"idle start",
      onClick:start_idle
    },
  },
  {
    name:"stop idle",
    info:"Stops the animation sequence using the function thats running on the worker.",
    button:{
      name:"stop idle",
      onClick: stop_idle
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

