// this is our placeholder dict for the elements that get animated
var animationProps = {
  setc: ((val) => {
      document.getElementById("b").style.transform = `translate(${val}%)`;
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
function E3(animator) {
    animationProps.animator=animator
    animationProps.target=animator.Lerp({ accessor: [animationProps.c, animationProps.setc], duration: 10, steps: [0.1, 400.1, 0.1, 100, 20, 30, 40, 500, 0],sequence_max_lengt:10 })
  return (
    <div class="w-full h-full flex flex-row  bg-[#ffffff]">
      <div class="w-full h-full items-center justify-center flex flex-col ">
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="a" class="w-10 h-10 bg-blue-400">a</div>
          <div id="b" class="w-10 h-10 bg-blue-500">b</div>
        </div>
      </div>
    </div>
  )}

const Controls3=[
  {
    name:"Start Animation",
    info:" This Event will start the animation with the values lerpPoint values that where set the last time. The initial values are the ones we have used for the initialisation of the Lerpclass: [0.1,400.1,0.1,100,20,30,40,500,0]",
    button:{
      name:"start",
      onClick: start
    }
  },
  {
    name:"Update lerp Sequence",
    info:"This Event will update the animation sequence. The new array is [0.0, 100.0, 0.0]. It will also reset the animation state and restart the animation.",
    button:{
      name:"update sequence",
      onClick:() => { console.log("click"); update() }
    }
  }]

const TutorialWidget3={
  name:"3. Animation Sequence",
  info: "This Examples shows how to use Lerp animation with a sequence.",
  index:2,
  gitlink:"https://github.com/ji-podhead/kooljs"
}

export { E3,Controls3,TutorialWidget3 }

