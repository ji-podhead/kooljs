import ExampleDescription from "./utils/utils";
var red,green,blue,bg_gradient
function bg(val){
  red= val[2]
  green= val[3]
  blue= val[4]
  bg_gradient=`linear-gradient(to right, rgb(0,0,0), rgb(${red}, ${green}, ${blue})`
  return bg_gradient
}
function setStyle(id,val){
  //console.log(val)
  document.getElementById("e5_"+id).style.width = `${(val[0]*10)}%`;
  document.getElementById("e5_"+id).style.background=bg(val);
}
const length = 16       
const reference_matrix=[[1,0.3,30,30,30],[4,1,100,100,255]] // <- [scale,opacity,r,g,b]
const animProps={
  animator:undefined,//                 <- animator        << Animator >> 
  idle_animation:undefined,//           <- idleAnims       << MatrixLerp >> 
  boxes: new Array(length),//           <- boxes dict    << div | MatrixLerp >> 
  indices: new Float32Array(length),//  <- anim id's        << Float32 >> 
  selected: undefined,//                <- animator.const    << number >>
  status: undefined,//                  <- animator.const    << number >>
  reference_matrix: undefined,//        <- animator.const    << Float32 >>
  stopActive: undefined,
  startRandom: undefined,
  replace_indices:undefined
}
function Example(animator) {
    animProps.animator=animator
    animProps.selected=animator.constant({type:"number",value:0})
    animProps.reference_matrix=animator.constant({
      type:"matrix",
      value:reference_matrix
    })
    animProps.replace_indices = animator.Lambda({
      callback: `(({index,ref_step})=>{
              const ref = get_constant_row(${animProps.reference_matrix.id},ref_step)
              //console.log(ref)
              //console.log("index " + index)
              const val = get_lerp_value(index)
              //console.log(val)
              setMatrix(index,0,val) // setting step 0 values to the current instance values
              setMatrix(index,1,ref) // setting target values to original idle state
              hard_reset(index)
      })`
    })
    for (let i=0;i<length;i++){
      animProps.boxes[i]=
        {
          anim: animator.Matrix_Lerp({ 
            render_callback:((val)=>setStyle(i,val)), 
            duration: 10, 
            steps: reference_matrix,
            loop:false,
            }),
          div: <div class="w-full h-full flex items-center justify-center bg-black" id={"e5_"+i} key={"e5_"+i}>
                  <div id={"e5_child"+i} key={"e5_child"+i} class="w-0 h-0 bg-white border-[#78BDB8] border-2 rounded-md text-white flex-col gap-2 items-center justify-center" >
                    <div class="text-center text-xl"><b>Div No: {i}</b></div>
                    <div class="text-left w-[80%] h-[10%] text-sm" >
                      Line: --1--
                    </div>
                  </div>
              </div>,
      }
      animProps.indices[i]=animProps.boxes[i].anim.id
    }
    animProps.indices=animator.constant({
      type:"matrix",
      value:[animProps.indices]
    })
    animProps.stopActive = animator.Lambda({
      callback: `(()=>{
        get_constant_row(${animProps.indices.id},0).map((i)=>{
              lambda_call(${animProps.replace_indices.id},{index:i,ref_step:0})
        })
      })`
    })
    animProps.idle_animation= animator.Matrix_Lerp({ 
      render_callback:(()=>{}),
      duration: 100,
      render_interval:20, 
      steps: reference_matrix,
      loop:true,
      callback:{
        callback:`(({time})=>{
          console.log("----------timeline animation----------")
          console.log("time " + time)
          if(time==0){
            const current=get_constant_number(${animProps.selected.id})
            console.log("current_selection " + current)
            if(is_active(current)){
              lambda_call(${animProps.replace_indices.id},{index:current,ref_step:0})
              start_animations([current])  
            }
            const indices = get_constant_row(${animProps.indices.id},0)
            const random_index=indices[Math.floor(Math.random()*indices.length)]
            console.log("new random selection is " + random_index)
            update_constant(${animProps.selected.id},"number",random_index)  
            lambda_call(${animProps.replace_indices.id},{index:random_index,ref_step:1})
            console.log("updated values")
            start_animations([random_index])
            console.log("started animation with index " + random_index)
          }
          else if(time==80){
            const random_index = get_constant_number(${animProps.selected.id})
            console.log("random selection is " + random_index)
            lambda_call(${animProps.replace_indices.id},{index:random_index,ref_step:0})
            console.log("updated values")
            console.log("started animation with index " + random_index)
            start_animations([random_index])
          }
            console.log("--------------------------------")
        })`
      }
      })
    return (
    <div class="w-full h-full bg-[#ffffff]">
      <ExampleDescription header={header} description={exampleDiscription}/>
      <div class="w-full h-full">
      <div class="w-full h-full bg-red-300 grid grid-cols-4 gap-1 justify-center items-center">
        {animProps.boxes.map((e) => e.div)}
      </div>
    </div>
    </div>
  )}
const start=(()=>{
    console.log(animProps.indices.value[0])
    animProps.animator.start_animations(animProps.indices.value[0])
})
const start_idle=(()=>{
  animProps.animator.start_animations([animProps.idle_animation.id])
})
const lambda_stop=(()=>{
  animProps.stopActive.call()
})
const stop=(()=>{
  animProps.animator.stop_animations("all")
})
const reset=(()=>{
  animProps.animator.reset_animations("all")
})
const init=(()=>{
  animProps.animator.init()
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
    name:"Start Animation",
    info:" This Event will start the animation with the values lerpPoint values that where set the last time. The initial values are the ones we have used for the initialisation of the Lerpclass: [0.1, 400.1 ,0.1 ,100, 20, 30, 40, 500, 0]",
    button:{
      name:"start",
      onClick: start
    }
  },
  {
    name:"lambda stop",
    info:"Stops the animation sequence using the function thats running on the worker.",
    button:{
      name:"lambda stop",
      onClick:() => {lambda_stop() }
    },
  },
  {
    name:"idle start",
    info:"Stops the animation sequence using the function thats running on the worker.",
    button:{
      name:"idle start",
      onClick:() => {start_idle()}
    },
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

