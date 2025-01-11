var finished = []
var fps = 33.33
var controller = null;
var signal = null;
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Registry {
    constructor() {
        this.trigger_start = undefined
        this.trigger_target = undefined
        this.trigger_type = undefined
        this.type = undefined
        this.min = undefined
        this.max = undefined
        this.type = undefined
        this.duration = undefined
        this.render_interval = undefined
        this.delay_delta = undefined
        this.delay = undefined
        this.progress = undefined

        this.activelist = []
        this.results = []
        this.last_value=[]
    }
}
class Callback {
    constructor() {
        // hier einach -1 für keine weights setzen, 
        // oder eine liste erstellen die nur die elemente enthält die eine condi haben
        this.callback=undefined
        this.threshold=undefined
    }
}
class Spring{
constructor(elements,duration,spring_tension,spring_whatever,){
        this.elements=elements
        this.duration=duration
        this.spring_tension=spring_tension

}
}
const registry = new Registry()
const condi = new Callback()
function lerp(min, max, v) {
    const t = (min * v) + (max * (1 - v))
    return t
}
function smoothLerp(min, max, v) {
    const t = smoothstep(v)
    return (max * t) + (min * (1 - t))
}
function smoothstep(x) {
    return x * x * (3 - 2 * x);
}
//dijkstra algo für matrix
function shortest_path(){

}
// k nearest neigbor for matrix (not sure if also for lerp)
function knn(){

}
//matrix and callback for lerp
function convex_hull(){

}
function spring(){

}
var v,t
async function animate() {
    registry.activelist.reverse().map((val, index) => {
        //checking if the element is finished and needs to be deleted
        if (registry.progress[val] < registry.duration[val]) {
            //waiting for delay
            if (registry.delay_delta[val] < registry.delay[val]) {
                registry.delay_delta[val] += 1
            }
            else {
                //increment progress
                registry.progress[val] += 1
                // First for registry.trigger_target[val]: If this value is null or undefined, 0 is used instead.
                // Then again for registry.type[...]: Similarly, 0 is used if the index is null or undefined.
                if (registry.trigger_target[val] ?? 0 >= registry.trigger_start[val]) {
                    reset(registry.trigger_target[val] ?? 0, registry.type[registry.trigger_target[val] ?? 0])
                }
                if (registry.progress[val] % registry.render_interval[val] == 0) {
                    // v = normalized time delta
                    v = registry.progress[val] / registry.duration[val];
                    // t = lerp
                    t= smoothLerp(registry.min[val], registry.max[val], v)
                    //t += perform callback if there is one
                    //t = condi.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback
                    t=condi.callback.get(val)!=undefined?condi.callback.get(val)(val,t,v):t//?.(val, t) ?? undefined;
                    //adding the lastvalue for static 
                  //  registry.last_value[val] = registry.results[index] =t // the length of results is equal to the length of activelists
                }
                console.log(`"id" ${val} "progres:" ${registry.progress[val]} "res:" ${registry.results[index]}`)
                // at this point the element that is finished can also get removed
            }

        } else {
            registry.delay_delta[val] = 0
            registry.progress[val] = 0
            finished.push(val);
        }
    })
}
async function animateLoop() {
    controller = new AbortController();
    signal = controller.signal;
    while (true) {
        await sleep(fps)
        if (signal.aborted == true) {
            break
        }
        if (registry.activelist["length"] > 0) {
            finished = []
            // eslint-disable-next-line no-loop-func
            animate().then(() => {
                if (registry.results["length"] > 0) {
                    // hier promise einabuen
                    if (finished["length"] > 0) {
                        fin()
                    }
                    render()
                }

            })
        }
    }
}
function init(x, start, condi_new, springs, active, fps) {
//hier über map iterieren
    condi.callback=new Map()
    condi_new.get("callback").forEach((val,ke)=>{
    //     console.log(ke)
    //     console.log(val)
          condi.callback.set(ke,eval(val))
    })
    // // springs.
    // condi_new.get("callback").forEach((funcStr, index) => {
    //     const func = new Function('index', 'value','progress', `'use strict'; return (${funcStr});`);
    //     condi.callback.set(index,func)
    // });
    
    condi.threshold= new Float32Array(condi_new.threshold)
    x.forEach((array, name) => {
        registry[name] = new Float32Array(array)
    })
    registry.last_value=new Float32Array(registry.min)
    registry.activelist = []
    if (start == true) {
        start_loop()
    }
}
async function render() {
    postMessage({ message: "render", results: registry.results, result_indices: registry.activelist })
}
function trigger() {
    postMessage({ message: "trigger", results: registry.results, result_indices: registry.activelist })
}
var resultsnew
//TODO
//IMPLEMENT ON CLIENT
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
            return true; 
        }
        return false; 
    });
    if (registry.activelist["length"] == 0) {
        stop_loop()
    }
    registry.results = resultsnew
    finished = []
}
//this function is for custom callback functions
//its used for getting other values via index
function get_value(index){
return registry.last_value[index]
}
function start_loop() {
    animateLoop()
}
function stop_loop() {
    if (controller !== null) {
        controller.abort()
        controller = null
    }
}
function set(id){
    //activelist,results,lastvalue,min/max
}
function reset(id, type) {
    if (type > 0) {
        registry.progress[id] = 0
    }
    if (registry.activelist.includes(id) == false) {
        registry.results = new Float32Array(registry.results.length + 1)
        registry.activelist.push(id)
    }
}
function update(id, values) {
    Object.entries(values).map((val) => {
        registry[val[0]][id] = val[1]
        registry.progress[id] = 0
        if (registry.activelist.includes(id) == false) {
            registry.results = new Float32Array(registry.results.length + 1)
            registry.activelist.push(id)

        } else {
            registry.results[id] = val[1]
        }
    })
    if (controller == null) {
        start_loop()
    } else {
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
            init(event.data.data, event.data.start, event.data.callback_map,event.data.spring_map);
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

export {get_value,reset,set,change_framerate}

//v = Math.floor(registry.progress[val] / registry.duration[val]);