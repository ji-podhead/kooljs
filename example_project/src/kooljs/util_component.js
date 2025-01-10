function Util(props){
    return(
        <div class="w-[20%] h-[20%]">
        <div  class="w-full h-full bg-slate-200 flex flex-col">
        'w: {props.w} ww: {window.innerWidth} h: {props.h} wh: {window.innerHeight}'
          <div className='w-full h-1/3'>
            Speed {props.fps} ms
          </div>
          <button class="bg-green-800 w-1/2 h-full" onClick={() => {
            props.setFps(props.fps + 100)
            props.animator.setFPS(props.fps + 100)
          }}>
            +100ms
          </button>
          <button class="bg-red-500 h-full w-1/2" onClick={() => {
            props.setFps(props.fps - 100)
            props.animator.setFPS(props.fps - 100)
          }}>
            -100ms
          </button>
        </div>

        <div class="w-[20%] h-[20%] bg-slate-400 flex flex-col">
          <div className='w-full h-1/3'>
            Animation status {props.play}
          </div>
          <button class="bg-red-800 w-1/2 h-full" onClick={() => {
            props.setPlay(true)
            props.animator.start()
          }}>
            start
          </button>
          <button class="bg-slate-700 h-full w-1/2" onClick={() => {
            props.setPlay(false)
            props.animator.stop()
          }}>
            stop
          </button>
        </div>
        </div>
    )
   }
   export { Util}