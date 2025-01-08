function Util(mainProps){
    return(
        <div class="w-[20%] h-[20%]">
        <div  class="w-full h-full bg-slate-200 flex flex-col">
        'w: {mainProps.w} ww: {window.innerWidth} h: {mainProps.h} wh: {window.innerHeight}'
          <div className='w-full h-1/3'>
            Speed {mainProps.fps} ms
          </div>
          <button class="bg-green-800 w-1/2 h-full" onClick={() => {
            mainProps.setFps(mainProps.fps + 100)
            mainProps.animator.setFPS(mainProps.fps + 100)
          }}>
            +100ms
          </button>
          <button class="bg-red-500 h-full w-1/2" onClick={() => {
            mainProps.setFps(mainProps.fps - 100)
            mainProps.animator.setFPS(mainProps.fps - 100)
          }}>
            -100ms
          </button>
        </div>

        <div class="w-[20%] h-[20%] bg-slate-400 flex flex-col">
          <div className='w-full h-1/3'>
            Animation status {mainProps.play}
          </div>
          <button class="bg-red-800 w-1/2 h-full" onClick={() => {
            mainProps.setPlay(true)
            mainProps.animator.start()
          }}>
            start
          </button>
          <button class="bg-slate-700 h-full w-1/2" onClick={() => {
            mainProps.setPlay(false)
            mainProps.animator.stop()
          }}>
            stop
          </button>
        </div>
        </div>
    )
   }
   export { Util}