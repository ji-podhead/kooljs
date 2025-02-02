
import ExampleDescription from "./utils/utils";
const length = 30
const elements=new Array(length)
const indices= new Float32Array(length)
const min_width=30
var animator_instance,new_min,width
var red,green,blue,bg_gradient
function bg(val){
  red= (255*(val/100))/4
  green= 0
  blue= (255*(val/100))
  bg_gradient=`linear-gradient(to right, rgb(20,0,40), rgb(${red}, ${green}, ${blue})`
  return bg_gradient
}
function setWidth(id,val){
  document.getElementById("e3_"+id).style.width = `${val}%`;
  document.getElementById("e3_"+id).style.background=bg(val);
}
function randomWidth(min,max){
  new_min=(Math.random()*(max-min))
  return([min+new_min,Math.random()*(max-new_min)])
}
function Example(animator) {
    animator_instance=animator
    for (let i=0;i<length;i++){
      width=randomWidth(min_width,100)
      elements[i]=
        {
          anim: animator.Lerp({ 
          render_callback:((val)=>setWidth(i,val)), 
          duration: Math.floor(10+(60*Math.random())), 
          delay:Math.floor(Math.random()*60),
          steps: [width[0],width[1],width[0]],
          loop:true,
          }),
          div: <div id={"e3_"+i} key={"e3_"+i} style={{width:width[0]+"%", height: 100/length+"%",  backgroundImage: bg(width[0])}}>i: {i}</div>,
          width: width
      }
      indices[i]=elements[i].anim.id
    }
    return (
    <div class="w-full h-full bg-[#ffffff]">
      <ExampleDescription header={header} description={exampleDiscription}/>
      <div class="w-full h-full">
        <div class="shrink-0 items-start justify-center w-full h-full font-size-xl flex flex-col">
          {
            elements.map((e)=>(e.div))
          }          
        </div>
      </div>
    </div>
  )}
const start=(()=>{
    animator_instance.start_animations(indices)
})
const stop=(()=>{
  animator_instance.stop_animations("all")
})
const reset=(()=>{
  animator_instance.reset_animations("all")
})
const init=(()=>{
  animator_instance.init()
})
const header="Animation Squences"
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

