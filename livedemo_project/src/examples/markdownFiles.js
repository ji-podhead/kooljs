
export const e3= `// this is our placeholder dict for the elements that get animated
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
        {/* <div class="text-xl h-[10%] flex flex-col text-wrap items-center text-center justify-center">
          <b>Example 3 - Sequence </b><br></br>
          click the buttons on the left to trigger animations.
        </div> */}
        <div class="shrink-1 items-center justify-center w-full h-full font-size-xl flex flex-row">
          <div id="a" class="w-10 h-10 bg-blue-400">a</div>
          <div id="b" class="w-10 h-10 bg-blue-500">b</div>
        </div>
      </div>
    </div>
  )}
  `