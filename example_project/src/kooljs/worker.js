var finished = []
var fps = 33.33
var controller = null;
var signal = null;
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
class Lerp {
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
        this.smoothstep = undefined
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
class Constant {
    constructor(matrices,numbers){
        this.matrix=undefined
        this.number=undefined

    }
}
class Spring{
constructor(elements,duration,spring_tension,spring_whatever,){
        this.elements=elements
        this.duration=duration
        this.spring_tension=spring_tension

}
}
const lerp_registry = new Lerp()
const constant_registry = new Constant()
const condi = new Callback()
function lerp(min, max, v) {
    const t = (min * v) + (max * (1 - v))
    return t
}
var v,t
function smoothLerp(min, max, v, amount) {
    t = smoothstep(v)
  //  t=(t*amount)/t
    return (max * t) + (min * (1 - t))
}
function smoothstep(x) {
    return x * x * (3 - 2 * x);
}

async function animate() {
    lerp_registry.activelist.reverse().map((val, index) => {
        //checking if the element is finished and needs to be deleted
        if (lerp_registry.progress[val] < lerp_registry.duration[val]) {
            //waiting for delay
            if (lerp_registry.delay_delta[val] < lerp_registry.delay[val]) {
                lerp_registry.delay_delta[val] += 1
            }
            else {
                //increment progress
                lerp_registry.progress[val] += 1
                // First for registry.trigger_target[val]: If this value is null or undefined, 0 is used instead.
                // Then again for registry.type[...]: Similarly, 0 is used if the index is null or undefined.
                if (lerp_registry.trigger_target[val] ?? 0 >= lerp_registry.trigger_start[val]) {
                    reset(lerp_registry.trigger_target[val] ?? 0, lerp_registry.type[lerp_registry.trigger_target[val] ?? 0])
                }
                if (lerp_registry.progress[val] % lerp_registry.render_interval[val] == 0) {
                    // v = normalized time delta
                    v = lerp_registry.progress[val] / lerp_registry.duration[val];

                    t= smoothLerp(lerp_registry.min[val], lerp_registry.max[val], v,lerp_registry.smoothstep[val])
                    //t += perform callback if there is one
                    //t = condi.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback
                    t=condi.callback.get(val)!=undefined?condi.callback.get(val)(val,t,v):t//?.(val, t) ?? undefined;
                    
                    //adding the lastvalue for static 
                    lerp_registry.last_value[val] = lerp_registry.results[index] =t // the length of results is equal to the length of activelists
                }
                console.log(`"id" ${val} "progres:" ${lerp_registry.progress[val]} "res:" ${lerp_registry.results[index]}`)
                // at this point the element that is finished can also get removed
            }
        } else {
            lerp_registry.delay_delta[val] = 0
            lerp_registry.progress[val] = 0
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
        if (lerp_registry.activelist["length"] > 0) {
            finished = []
            // eslint-disable-next-line no-loop-func
            animate().then(() => {
                if (lerp_registry.results["length"] > 0) {
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
function init(lerps, start, constants, condi_new, springs, active, fps) {
    condi.callback=new Map()
    condi_new.get("callback").forEach((val,ke)=>{
          condi.callback.set(ke,eval(val))
    })

    condi.threshold= new Float32Array(condi_new.threshold)
    lerps.forEach((array, name) => {
        lerp_registry[name] = new Float32Array(array)
    })
    if(constants.get("matrix")!=undefined){
    constants.get("matrix").forEach((val)=>{
        constant_registry.matrix.push(new Float32Array(val))
    })
}
    if(constants.get("number")!=undefined){
            constant_registry.number=(new Float32Array(constants.get("number")))
    }
    lerp_registry.last_value=new Float32Array(lerp_registry.min)
    lerp_registry.activelist = []
    if (start == true) {
        start_loop()
    }
}
async function render() {
    postMessage({ message: "render", results: lerp_registry.results, result_indices: lerp_registry.activelist })
}
function trigger() {
    postMessage({ message: "trigger", results: lerp_registry.results, result_indices: lerp_registry.activelist })
}
var resultsnew
//TODO
//IMPLEMENT ON CLIENT
function fin() {
    postMessage({
        message: "finish",
        results: lerp_registry.results,
        result_indices: lerp_registry.activelist
    });
    resultsnew = new Float32Array(lerp_registry.results.length - finished.length);
    lerp_registry.activelist = lerp_registry.activelist.filter((index) => {
        if (!finished.includes(index)) {
            resultsnew[index] = lerp_registry.results[index];
            return true; 
        }
        return false; 
    });
    if (lerp_registry.activelist["length"] == 0) {
        stop_loop()
    }
    lerp_registry.results = resultsnew
    finished = []
}
//this function is for custom callback functions
//its used for getting other values via index
function get_lerp_value(index){
return lerp_registry.last_value[index]
}
function get_constant_value(type,index){
    return constant_registry[type][index]
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
        lerp_registry.progress[id] = 0
    }
    if (lerp_registry.activelist.includes(id) == false) {
        lerp_registry.results = new Float32Array(lerp_registry.results.length + 1)
        lerp_registry.activelist.push(id)
    }
}
function update_lerp(id, values) {
    Object.entries(values).map((val) => {
        lerp_registry[val[0]][id] = val[1]
        lerp_registry.progress[id] = 0
        if (lerp_registry.activelist.includes(id) == false) {
            lerp_registry.results = new Float32Array(lerp_registry.results.length + 1)
            lerp_registry.activelist.push(id)

        } else {
            lerp_registry.results[id] = val[1]
        }
    })
    if (controller == null) {
        start_loop()
    } else {
        stop_loop()
        start_loop()
    }
}


function update_constant(type, id, value){
constant_registry[type][id]=value
}
function change_framerate(fps_new) {
    fps = fps_new
}
onmessage = (event) => {
    // eslint-disable-next-line default-case
    switch (event.data.method) {
        case 'init':
            init(event.data.data, event.data.start,event.data.constants, event.data.callback_map,event.data.spring_map,);
            break;
        case 'update_lerp':
            update_lerp(event.data.id, event.data.values);
            break;
        case 'update_constant':
            update_constant(event.data.type, event.data.id,event.data.value);
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

export {get_lerp_value as get_value,reset,set,change_framerate}

//v = Math.floor(registry.progress[val] / registry.duration[val]);



// function calculateSpringAnimation(matrix, params) {
//     const { mass, tension, friction, bounce, damping, decay, duration, velocities } = params;
  
//     return matrix.map((value, index) => {
//       const initialValue = value;
//       const targetValue = params.targetValues ? params.targetValues[index] : initialValue;
      
//       const k = 2 * Math.PI * Math.sqrt(tension / mass);
//       const zeta = damping / (2 * mass);
//       const omega = k * Math.sqrt(1 - zeta * zeta);
  
//       return (t) => {
//         const x = targetValue - initialValue;
//         const theta = omega * t;
  
//         let y;
//         if (zeta < 1) {
//           // Unter- oder kritisch gedämpft
//           y = x * Math.exp(-zeta * theta) * (Math.cos(theta) + (zeta / omega) * Math.sin(theta));
//         } else {
//           // Überdämpft
//           y = x * Math.exp(-omega * t);
//         }
  
//         // Bounce-Effekt hinzufügen
//         const bounceFactor = Math.pow(0.9, t / duration);
//         y *= bounceFactor;
  
//         // Auslaufwert berücksichtigen
//         return targetValue + (y - targetValue) * Math.exp(-decay * t);
//       };
//     });
//   }
  
//   // Beispielaufruf:
//   const matrix = [10, 20, 30, 40, 50];
//   const params = {
//     mass: 0.5,
//     tension: 100,
//     friction: 0.05,
//     bounce: 0.9,
//     damping: 0.15,
//     decay: 0.001,
//     duration: 1000,
//     velocities: [0, 0, 0, 0, 0],
//     targetValues: [15, 25, 35, 45, 55]
//   };
  
//   const animations = calculateSpringAnimation(matrix, params);
  