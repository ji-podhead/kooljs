var finished = []
var animationmap = new Map()
var fps = 33.33
var task = undefined
var controller = null;
var signal = null;
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Registry {
    constructor() {
        this.constant = undefined
        this.min = undefined
        this.max = undefined
        this.type = undefined
        this.duration = undefined
        this.render_interval = undefined
        this.delay_delta = undefined
        this.delay = undefined
        this.progress = undefined
        this.activelist = []
        this.results=[]
    }
}
class Conditional_Weight {
    constructor() {
        // hier einach -1 für keine weights setzen, 
        // oder eine liste erstellen die nur die elemente enthält die eine condi haben
        this.cond_type = undefined
        this.cond_multiplicator = undefined
        this.cond_threshold = undefined
        this.cond_target = undefined
    }
}
const registry = new Registry()
function lerp(min, max, v) {
    const t = (min * v) + (max * (1 - v))
    return t
}
function smoothLerp(min, max, v) {
    const t = smoothstep(v)
    return (min * t) + (max * (1 - t))
}
function smoothstep(x) {
    return x * x * (3 - 2 * x);
}
var v
async function animate() {
    registry.activelist.reverse().map((val,index) => {
        if (registry.progress[val] < registry.duration[val]) {
            if (registry.delay_delta[val] < registry.delay[val]) {
                registry.delay_delta[val] += 1
            }
            else {
                //buffer.set("progress")[index] += 1
                registry.progress[val] += 1
                if (registry.progress[val] % registry.render_interval[val] == 0) {
                    v = registry.progress[val] / registry.duration[val];
                    registry.results[val]=smoothLerp(registry.min[val], registry.max[val], v)
                }else{
                    registry.delay_delta[val]=0
                    registry.progress[val]=0
                    finished.push(index);
                }
            }
        }
    })
}
  async function animateLoop() {
        controller = new AbortController();
        signal = controller.signal;
        while (true) {
           await sleep(fps)
            if (signal.aborted==true) {
                break
               }
            if (registry.activelist["length"] > 0) {
                finished=[]
                animate()
                if (registry.results["length"] > 0) {
                    render()
                }
                if (finished["length"] > 0 && registry.results.length >0) {
                    fin()
                }
            }
        }
}
function init(x, start, active,fps) {
    registry.activelist = []
    x.forEach((array, name) => {
        registry[name] = new Float32Array(array)
    })
    if (start == true) {
        start_loop()
    }
}
function render() {
    postMessage({message:"render",results:registry.results, result_indices:registry.activelist})
}
function trigger() {
    postMessage({message:"trigger",results:registry.results, result_indices:registry.activelist})
}
var resultsnew
function fin() {
    postMessage({
        message: "finish",
        results: registry.results,
        result_indices: registry.activelist
    });
    resultsnew = new Float32Array(registry.results.length - finished.length);
    registry.activelist = registry.activelist.filter((index) => {
        if (!finished.includes(index)) {
            resultsnew[index] = registry.results[index];
            return true; // Behalten Sie das Element bei
        }
        return false; // Entfernen Sie das Element
    });
        if(registry.activelist["length"]==0){
            stop_loop()
        }
    registry.results=resultsnew
    finished=[]
}
function start_loop() {
    task = animateLoop()
}
function stop_loop() {
    if (controller !== null) {
        controller.abort()
        controller = null
    }
}
function update(id, values) {
    Object.entries(values).map((val) => {
        registry[val[0]][id] = val[1]
        if (registry.activelist.includes(id) == false) {
            registry.results= new Float32Array(registry.results.length+1)
            registry.activelist.push(id)
            
        }else{
            registry.results[id]=val[1]
        }  
    })
    if(controller==null){
        start_loop()
    }else{
        stop_loop()
        start_loop()
    }
}
function change_framerate(fps_new) {
    fps = fps_new
}
onmessage = (event) => {
    // eslint-disable-next-line default-case
    switch (event.data.method) {
        case 'init':
            init(event.data.data, event.data.start, event.data.activelist);
            break;
        case 'update':
            update(event.data.id, event.data.values);
            break;
        case 'start_loop':
            change_framerate(event.data.fps)
            start_loop();
            break;
        case 'stop':
            stop_loop();
            break;
        case 'change_framerate':
            change_framerate(event.data.fps_new);
            break;
        case 'start':
            change_framerate(event.data.fps)
            start_loop(event.data.data);
            break;
    }
};
