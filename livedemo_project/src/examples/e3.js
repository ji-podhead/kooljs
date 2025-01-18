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
    <div class="w-full h-full bg-[#ffffff]">
      <div class="z-10 w-1/2 h-1/2 absolute ">
      <div class="w-[70%] h-[25%] rounded-br-md  text-black bg-[#5C8F8D] flex flex-col justify-center items-center bg-opacity-45 border-b-2 border-r-2 border-black">
      <div class=" text-xl ">
        Example 3: Animation Squences
      </div>
      <div class="w-[90%] text-sm text-left text-wrap">
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
  const md3 = `\`\`\`javascript
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
  function E3(animator) {
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
    name:"Update Sequence",
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
  gitlink:"https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e3.js",
  mdfile:md3
}

export { E3,Controls3,TutorialWidget3 }

