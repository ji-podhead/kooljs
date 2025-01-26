var finished = []
var fps = 10.33
var signal,controller = null
var triggers, triggers_step, status_start, status, startTime, target
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
// ----------------------------------------> CLASS DEFINITIONS <--
class Lerp {
    constructor() {
        this.type = undefined
        this.type = undefined
        this.duration = undefined
        this.render_interval = undefined
        this.delay_delta = undefined
        this.delay = undefined
        this.progress = undefined
        this.smoothstep = undefined
        this.lerp_chain_start=undefined
        this.activelist = []
        this.results = []
        this.last_value=[]
    }
    reset(id) {
        if (this.activelist.includes(id) == false) {
            this.results = new Float32Array(this.results.length + 1)
            this.activelist.push(id)
        }
        this.progress[id]=1
    }
    update(id, values) {
        Object.entries(values).map((val) => {
            this[val[0]][id] = val[1]
        })     
        start_animations(id)
    }
    get(index){//this function is for custom callback functions. its used for getting other values via index
        return this.last_value[index]
    }
}
var trigger_registry = new Map()
class LerpChain{
    constructor(){
        this.buffer=undefined
        this.progress=undefined
        this.lengths=undefined
    }
    update_progress(id){
        const step=this.progress[id]
        if(step==this.lengths[id]-1){
            
           // this.reset(id)
            return true
        }
        else{
            
            this.progress[id]+=1
            lerp_registry.progress[id]=0
            return(false)
        }
    }
    reset(id){
    lerp_registry.reset(id)
    this.progress[id]=0
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
   update(type, id, value){
        constant_registry[type][id]=value
    }
    get(type,index){
        return constant_registry[type][index]
        }
}
// ----------------------------------------> DATABASE <--
const lerp_registry = new Lerp()
const constant_registry = new Constant()
const condi = new Callback()
const lerpChain_registry = new LerpChain()
// ----------------------------------------> ANIMATION <--
var v,t
function smoothLerp(min, max, v, amount) {
    t = smoothstep(v)
  //  t=(t*amount)/t
    return (max * t) + (min * (1 - t))
}
function smoothstep(x) {
    return x * x * (3 - 2 * x);
}
//var triggers,triggers_step
var targets
async function animate() {
    lerp_registry.activelist.map((val, index) => {
        //checking if the element is finished and needs to be deleted
        if (lerp_registry.progress[val] < lerp_registry.duration[val]) {
            //waiting for delay
            if (lerp_registry.delay_delta[val] < lerp_registry.delay[val]) {
                lerp_registry.delay_delta[val] += 1
            }
            else {
                //increment progress
                
                // if (lerp_registry.progress[val] % lerp_registry.render_interval[val] == 0) {
                    // v = normalized time delta
                    v = lerp_registry.progress[val] / lerp_registry.duration[val];
                        triggers=trigger_registry.get(val)
                        triggers_step=triggers!=undefined?triggers.get(lerpChain_registry.progress[val]):undefined
                    if ( triggers_step != undefined) {
                               targets= triggers_step.get(lerp_registry.progress[val])
                               targets&&targets.map((target)=>{
                                lerpChain_registry.reset(target)
                                //trigger_registry.get(val).set(lerpChain_registry.progress[val],triggers_step)
                                })
                        }
                        t= smoothLerp(lerpChain_registry.buffer[lerp_registry.lerp_chain_start[val]+lerpChain_registry.progress[val]],
                        lerpChain_registry.buffer[lerp_registry.lerp_chain_start[val]+lerpChain_registry.progress[val]+1],
                        v,
                        lerp_registry.smoothstep[val]
                    )
                    //t += perform callback if there is one
                    //t = condi.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback
                    t=condi.callback.get(val)!=undefined?condi.callback.get(val)(val,t,v):t//?.(val, t) ?? undefined;
                    //adding the lastvalue for static 
                    lerp_registry.last_value[val] = lerp_registry.results[index] =t // the length of results is equal to the length of activelists
                // }
                lerp_registry.progress[val] += 1
            }
        } else {
            if(lerp_registry.lerp_chain_start[val]!=undefined&&lerpChain_registry.update_progress(val)==true){
                finished.push(val);
            }
        }
    })
    return finished
}
async function animateLoop() {
    var startTime 
    controller = new AbortController();
    signal = controller.signal;
    while (true) {
        startTime = performance.now();

        finished = [] // HIER zurücksetzen VOR der Animation
        if (lerp_registry.activelist.length > 0) {
            await animate().then(finished=>{
                if (lerp_registry.results.length > 0) render()
                if (finished.length > 0) fin()
            }) 
        }
        if (signal.aborted) break
        const elapsed = performance.now() - startTime;
        const waitTime = Math.max(0, fps - elapsed);
        await sleep(waitTime);

    }
}
// ----------------------------------------> WORKER UTILS <--
function fin() {
    // postMessage({
    //     message: "finish",
    //     results: lerp_registry.results,
    //     result_indices: lerp_registry.activelist
    // });
    lerp_registry.activelist = lerp_registry.activelist.filter((active) => !finished.includes(active));
    if (lerp_registry.activelist["length"] == 0) {
        stop_loop()
        lerp_registry.results=[]
    }else{
        lerp_registry.results = new Float32Array(lerp_registry.activelist.length);
    }
    finished = []
}
function start_loop() {
    animateLoop()
}
function stop_loop() {
    if (controller !== null) {
        controller.abort()
        controller = null
    }
    lerp_registry.activelist=[]
    lerp_registry.results=[]
    // lerp_registry.last_value=[]
}
function start_animations(indices){
    indices.map((id)=>{
        lerpChain_registry.reset(id)
    if (controller == null) {
        start_loop()
    } 
        
    })
}
function change_framerate(fps_new) {
    fps = fps_new
}
function init(lerps, lerpChains, triggers, constants, condi_new, springs) {
    trigger_registry=(triggers)
    condi.callback=new Map()
    condi_new.get("callback").forEach((val,ke)=>{
          condi.callback.set(ke,eval(val))
    })
    lerpChains.forEach((arr,name)=>{
        if(name!="buffer"){
            lerpChain_registry[name]=arr
        }
        else{
            lerpChain_registry[name]=new Float32Array(arr)
          //  console.log(lerpChain_registry[name])
        }
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
    lerp_registry.last_value=new Float32Array(lerp_registry.progress)
    lerp_registry.activelist = []
}
// ----------------------------------------> EVENTS <--
async function render() {
    postMessage({ message: "render", results: lerp_registry.results, result_indices: lerp_registry.activelist })
}
onmessage = (event) => {
    // eslint-disable-next-line default-case
    switch (event.data.method) {
        case 'init':
            init(event.data.data, event.data.chain_map, event.data.trigger_map, event.data.constants, event.data.callback_map,event.data.spring_map,);
            break;
        case 'update_lerp':
            lerp_registry.update(event.data.id, event.data.values);
            break;
        case "update":
                    if(event.data.type==2){
                        event.data.data.map((x)=>{
                            lerpChain_registry.lengths[x.id]=x.values.length-1
                            x.values.map((val,i)=>{
                                lerpChain_registry.buffer[lerp_registry.lerp_chain_start[x.id]+i]=val
                            })
                            lerpChain_registry.reset(x.id)
                           // lerpChain_registry.reset(event.data.id)
                        })
                    // lerpChain_registry.buffer=new Float32Array(event.data.buffer)
                    }
            break
        case 'update_constant':
            constant_registry.update(event.data.type, event.data.id,event.data.value);
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
            start_animations(event.data.indices);
            break;
    }
};
function get_lerp_value(id){return lerp_registry.get(id)}
function reset_lerp(id){return lerp_registry.reset_lerp(id)}
export {get_lerp_value,reset_lerp,set,change_framerate}

// ----------------------------------------> REQUIRES IMPLEMENTATION <--
function set(id){
    //activelist,results,lastvalue,min/max
}
class Spring{
    constructor(elements,duration,spring_tension,spring_whatever,){
            this.elements=elements
            this.duration=duration
            this.spring_tension=spring_tension
    
    }
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
// function triggers() {
//     postMessage({ message: "trigger", results: lerp_registry.results, result_indices: lerp_registry.activelist })
// }


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
  