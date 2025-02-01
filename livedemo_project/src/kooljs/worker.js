// Copyright (c) 2025 Ji-Podhead and Project Contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

// 1. All commercial uses of the Software must:  
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).  
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).  

// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
var finished = []
var fps = 10.33
var signal,controller = null
var triggers_step
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
// ----------------------------------------> CLASS DEFINITIONS <--
class Lerp {
    constructor() {
        this.type = undefined
        this.delta_t = undefined
        this.duration = undefined
        this.render_interval = undefined
        this.delay_delta = undefined
        this.delay = undefined
        this.progress = undefined
        this.smoothstep = undefined
        this.lerp_chain_start=undefined
        this.loop=undefined
        this.activelist = []
        this.results = new Map()
    }
    reset(id) {
        if (this.activelist.includes(id) == false) {
            this.activelist.push(id)
        }
    }
    get(index){//this function is for custom callback functions. its used for getting other values via index
        return this.results.get(index)
    }
}
var trigger_registry = new Map()
class LerpChain{
    constructor(){
        this.buffer=undefined
        this.matrixChains=undefined
        this.progress=undefined
        this.lengths=undefined
    }
    update_progress(id){
        const step=this.progress[id]
        if(step==this.lengths[id]-1){
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
    lerp_registry.progress[id]=0
    this.progress[id]=0
    }
    soft_reset(id){
        if(lerp_registry.progress[id]==lerp_registry.duration[id]){
            lerp_registry.reset(id)
            lerp_registry.progress[id]=0
        }
        if(lerpChain_registry.progress[id]==lerpChain_registry.lengths[id]-1){
            lerpChain_registry.reset(id)
        }
        else if(lerp_registry.activelist.includes(id)==false){
            lerp_registry.activelist.push(id)
        }
    }
}
class Callback {
    constructor() {
        // hier einach -1 für keine weights setzen, 
        // oder eine liste erstellen die nur die elemente enthält die eine condi haben
        this.callback=new Map()
        this.condition=new Map()
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
const callback_registry = new Callback()
const lerpChain_registry = new LerpChain()

// ----------------------------------------> ANIMATION <--
var t
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
    finished=[]
    lerp_registry.activelist.map((val, index) => {
        //checking if the element is finished and needs to be deleted
        if (lerp_registry.progress[val] <= lerp_registry.duration[val]) {
            //waiting for delay
            if (lerp_registry.delay_delta[val] < lerp_registry.delay[val]) {
                lerp_registry.delay_delta[val] += 1
            }
            else {
                //increment progress
                
                // if (lerp_registry.progress[val] % lerp_registry.render_interval[val] == 0) {
                    lerp_registry.delta_t[val] = lerp_registry.progress[val] / lerp_registry.duration[val];

                    switch(lerp_registry.type[val]){
                        case(2):
                        lerp_registry.results.set(val, smoothLerp(
                                lerpChain_registry.buffer[lerp_registry.lerp_chain_start[val]+lerpChain_registry.progress[val]],
                                lerpChain_registry.buffer[lerp_registry.lerp_chain_start[val]+lerpChain_registry.progress[val]+1],
                                lerp_registry.delta_t[val] ,
                                lerp_registry.smoothstep[val]
                            ))
                            break
                        case(3):
                            for (let i=0;i< lerpChain_registry.matrixChains.get(val).get(lerpChain_registry.progress[val]).length;i++)
                            {
                                lerp_registry.results.get(val)[i]=  smoothLerp(
                                    lerpChain_registry.matrixChains.get(val).get(lerpChain_registry.progress[val])[i],
                                    lerpChain_registry.matrixChains.get(val).get(lerpChain_registry.progress[val]+1)[i],
                                    lerp_registry.delta_t[val] ,
                                    lerp_registry.smoothstep[val]
                                )
                            }
                            break;
                        default:
                            return console.error("wrong type"+String(val));
                    }
                    const args={id:val,value:lerp_registry.results.get(val),time:lerp_registry.progress[val] ,step:lerpChain_registry.progress[val]} //time war vorther lerp_registry.delta_t[val]
                   if(callback_registry.condition.get(val)!=undefined
                   &&callback_registry.condition.get(val)(args)==true) {
                     callback_registry.callback.get(val)(args)
                   }
                   triggers_step=trigger_registry.get(val)!=undefined?trigger_registry.get(val).get(lerpChain_registry.progress[val]):undefined
                   if ( triggers_step != undefined) {
                              targets= triggers_step.get(lerp_registry.progress[val])
                              targets&&targets.map((target)=>{

                               lerpChain_registry.soft_reset(target)
                               })
                   }
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
//t = callback_registry.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback

async function animateLoop() {
    var startTime 
    controller = new AbortController();
    signal = controller.signal;
    while (true) {
        if (signal.aborted || controller==null) break
        startTime = performance.now();
        finished = [] // HIER zurücksetzen VOR der Animation
        if (lerp_registry.activelist.length > 0) {
            await animate().then(finished=>{
                 render()
                if (finished.length > 0) fin(finished)
            }) 
        }
        
        const elapsed = performance.now() - startTime;
        const waitTime = Math.max(0, fps - elapsed);
        await sleep(waitTime);

    }
}
// ----------------------------------------> WORKER UTILS <--
function fin(finished) {
    // postMessage({
    //     message: "finish",
    //     results: lerp_registry.results,
    //     result_indices: lerp_registry.activelist
    // });
    lerp_registry.activelist = lerp_registry.activelist.filter((active) => !finished.includes(active));
    if (lerp_registry.activelist["length"] == 0) {
        stop_loop()
    }
}
function start_loop() {
    if(controller==null){
        animateLoop()
    }
}
function stop_loop() {
    if (controller !== null) {
        controller.abort()
        controller = null
    }
    //lerp_registry.activelist=[]
    // lerp_registry.last_value=[]
}
function start_animations(indices){
    indices.map((id)=>{
        lerpChain_registry.soft_reset(id)
        start_loop()
    })
}
function stop_animations(indices){
    if(indices=="all"){
        indices=lerp_registry.activelist
    }
    indices.map((id)=>{
        if(lerp_registry.activelist.includes(id)){
        //lerpChain_registry.reset(id)
        lerp_registry.activelist=lerp_registry.activelist.filter((x)=>x!=id)
        }
    if (lerp_registry.activelist.length == 0) {
        stop_loop()
    } 
  })
}

async function reset_animations(indices){
    if(indices=="all"){stop_loop();indices=lerp_registry.activelist}
    //stop_animations(indices)
    const stopped=[]    
    indices.map((x)=>{
        lerpChain_registry.reset(x);
        lerp_registry.reset(x)
        if(lerp_registry.activelist.includes(x)==false || controller==null){
            stopped.push(x)
            switch(lerp_registry.type[x]){
            case(2):
            lerp_registry.results.set(x,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[x]])
            break
            case(3):
            lerp_registry.results.set(x,lerpChain_registry.matrixChains.get(x).get(0))
            break
            default:break;
            
        }
    }
    })
    if(stopped.length>0)    postMessage({ message: "render", results: lerp_registry.results, result_indices: indices })
}
function change_framerate(fps_new) {
    fps = fps_new
}
function init(lerps, lerpChains, matrixChains, triggers, constants, condi_new, springs) {
    trigger_registry=(triggers)
    condi_new.forEach((val,key)=>{
          callback_registry.callback.set(key,eval(val.callback))
          callback_registry.condition.set(key,eval(val.condition))
    })
    lerpChains.forEach((arr,name)=>{
            lerpChain_registry[name]=new Float32Array(arr)
          //  console.log(lerpChain_registry[name])
    })
    lerpChain_registry.matrixChains=matrixChains
    lerps.forEach((array, name) => {
            if(["loop"].includes(name)==false ){
            lerp_registry[name] = new Float32Array(array)
            }
            else{lerp_registry[name] = new Uint8Array(array)}
    })
    if(constants.get("matrix")!=undefined){
    constants.get("matrix").forEach((val)=>{
        constant_registry.matrix.push(new Float32Array(val))
    })
}
    if(constants.get("number")!=undefined){
            constant_registry.number=(new Float32Array(constants.get("number")))
    }
    lerp_registry.type.map((t,i)=>{
        if(t==2){
            lerp_registry.results.set(i,-1)
        }
        else{
            lerp_registry.results.set(i,new Float32Array(lerpChain_registry.matrixChains.get(i).get(0)))
        }
    })
    lerp_registry.delta_t=new Float32Array(lerp_registry.duration.length)
}
function addTrigger(id,target,step,time){
    var trigger = []
    if(trigger_registry.get(id)==undefined){
        trigger_registry.set(id,new Map())
    }
    if(trigger_registry.get(id).get(step)==undefined){
        trigger_registry.get(id).set(step, new Map())
        trigger_registry.get(id).get(step).set(time,new Uint8Array([target]))
    }
    else if(trigger_registry.get(id).get(step).get(time)==undefined){
        trigger_registry.get(id).get(step).set(time,new Uint8Array([target]))
    }
    else{
    trigger=trigger_registry.get(id).get(step).get(time)
    if(trigger.includes(target)==false){
        const newtriggers= new Uint8Array(new Array(trigger).push(target))
        console.log(newtriggers)
        trigger_registry.get(id).get(step).set(time,newtriggers)
    }
    else{
        console.warn(`trigger already exists: target ${target} in timeframe ${time} in step ${step} on animation with id ${id}`)
    }
}
}
function removeTrigger(id,target,step,time){
    var trigger=trigger_registry.get(id).get(step)
    
    if(trigger!=undefined)
        {
            if(trigger.get(time)!=undefined){
                trigger=trigger.get(time)
            }
            else{
                return(console.warn("the slected timeframe in the  step does not include the target"))
            }
            
        }
        else{
            return(console.warn("the trigger registr has does not include the step"))
        }
    
    console.log(trigger)
    const targetId=trigger.indexOf(target)
    if(targetId!=undefined&&trigger.length>1){
        const newtriggers= new Uint8Array(new Array(trigger).splice(targetId,1))
        console.log(`removed trigger target ${target} in timeframe ${time} in step ${step} from from id ${id}`)
        trigger_registry.get(id).get(step).set(time,newtriggers)
    }
    else {
        trigger_registry.get(id).get(step).set(time,undefined)
    }
    // else{
    //     trigger_registry.get(id).set(step,undefined)
    // }
}
function update(type,values){
        values.map((x)=>{
            if(lerpChain_registry.lengths[x.id]!=x.values.length-1){
                console.log(trigger_registry.get(x.id))
                if(lerp_registry.loop[x.id]==1){
                removeTrigger(x.id,x.id,lerpChain_registry.lengths[x.id]-1,lerp_registry.duration[x.id])
                addTrigger(x.id,x.id,x.values.length-2,lerp_registry.duration[x.id])
                
                //trigger_registry.get(x.id).set(lerpChain_registry.lengths[x.id]-1,undefined)
            }
            lerpChain_registry.lengths[x.id]=x.values.length-1
        }
            if(type==2){
            x.values.map((val,i)=>{
                lerpChain_registry.buffer[lerp_registry.lerp_chain_start[x.id]+i]=val
            })
        }
        else if(type==3){
            x.values.map((val,i)=>{
                lerpChain_registry.matrixChains.get(x.id).set(i,val)
            })
        }
        lerpChain_registry.reset(x.id)
    })
}

// ----------------------------------------> EVENTS <--
async function render() {
    postMessage({ message: "render", results: lerp_registry.results, result_indices: lerp_registry.activelist })
}
onmessage = (event) => {
    switch (event.data.method) {
        case 'init':
            init(event.data.data, event.data.chain_map, event.data.matrix_chain_map, event.data.trigger_map, event.data.constants, event.data.callback_map,event.data.spring_map,);
            break;
        case "update":
            update(event.data.type,event.data.data)
            break
        case 'update_constant':
            constant_registry.update(event.data.type, event.data.id,event.data.value);
            break;
        case 'start':
            start_loop();
            break;
        case 'stop':
            stop_loop();
            break;
        case 'change_framerate':
            change_framerate(event.data.fps_new);
            break;
        case 'start_animations':
            start_animations(event.data.indices);
            break;
        case 'stop_animations':
            stop_animations(event.data.indices);
            break;
        case 'reset_animations':
            reset_animations(event.data.indices);
            break;
        case 'addTrigger':
            addTrigger(event.data.id,event.data.target,event.data.step,event.data.time);
            break;
        case 'removeTrigger':
            removeTrigger(event.data.id,event.data.target,event.data.step,event.data.time);
            break;
        default:
            console.warn("no method selected during worker call")
            break
    }
};
function setLerp(index,step,value){
    //console.log(lerpChain_registry.buffer[lerp_registry.lerp_chain_start[index]+step])
    lerpChain_registry.buffer[lerp_registry.lerp_chain_start[index]+step]=value
}
function setMatrix(index,step,value){
   // console.log(lerpChain_registry.matrixChains.get(index).get(step))
    value.map((x,i) => {
        lerpChain_registry.matrixChains.get(index).get(step)[i]=x
    })
   // lerpChain_registry.matrixChains.get(index).get(step)
}
function get_time(id){return lerp_registry.delay_delta(id)}
function current_step(id){return lerpChain_registry.progress(id)}
function get_lerp_value(id){return lerp_registry.results.get(id)}
function reset_lerp(id){lerp_registry.reset_lerp(id)}
function set_duration(id,val){lerp_registry.duration[id]=val}
function set_sequence_length(id,val){lerpChain_registry.lengths[id]=val}
export {
    addTrigger,removeTrigger,
    get_time,current_step,
    start_animations,stop_animations,
    setLerp,setMatrix,
    get_lerp_value,
    reset_lerp,
    set_duration,
    set_sequence_length,
    change_framerate
}

// ----------------------------------------> REQUIRES IMPLEMENTATION <--

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
  