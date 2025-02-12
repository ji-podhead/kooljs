// Copyright (c) 2025 Ji-Podhead and Project Contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

// 1. All commercial uses of the Software must:  
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).  
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).  

// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  
var finished = []
var fps = 10.33
var signal,loop_resolver = null
var triggers_step
const callback_map=new Map()
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
        this.lerp_callbacks=new Map()
    }
    activate(id) {
        if (this.activelist.includes(id) == false) {
            this.activelist.push(id)
            return true
        }
        return false
    }
    get(index){//this function is for custom callback functions. its used for getting other values via index
        return this.results.get(index)
    }
}
var final_step,final_sub_step

class LerpChain{
/**
 * The constructor for the LerpChain class.
 * Initializes properties related to the state and progress of the lerp chain.
 * 
 * @property {Array|undefined} buffer - The buffer holding the chain data.
 * @property {Map|undefined} matrixChains - The map containing matrix chains.
 * @property {Array|undefined} progress - The progress of each chain.
 * @property {Array|undefined} lengths - The lengths of each chain.
 */

    constructor(){
        this.buffer=undefined
        this.matrixChains=undefined
        this.progress=undefined
        this.lengths=undefined
    }
    update_progress(id){
        if(this.progress[id]==this.lengths[id]-1){
            return true
        }
        else{
            this.reset_and_update(id)
            return(false)
        }
    }
    reset_and_update(id){
        lerp_registry.delay_delta[id]=0
        lerp_registry.progress[id]=0
        this.progress[id]+=1
    }
    reset(id){
        if(lerp_registry.type[id]==2){
            lerp_registry.results.set(id,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[id]])
        }
        else if(lerp_registry.type[id]==3){
            lerp_registry.results.set(id,lerpChain_registry.matrixChains.get(id).get(0))
        }
        lerp_registry.delay_delta[id]=0
        lerp_registry.progress[id]=0   
        this.progress[id]=0
    }
    soft_reset(id){
        final_step=this.progress[id]==this.lengths[id]-1
        final_sub_step=lerp_registry.progress[id]>=lerp_registry.duration[id]
        lerp_registry.activate(id)
        if(final_step && final_sub_step){
            this.reset(id)
        }
        else if(final_sub_step){
            this.reset_and_update(id)
        }
    }
}
class Constant {
    constructor(matrices,numbers){
        this.matrix=new Map()
        this.number=undefined
        this.render_triggers=new Map()
        this.render_callbacks=new Map()
    }
   update(type, id, value){
        constant_registry[type].set(id,value)
        if(this.render_callbacks.has(id))  this.render_callbacks.get(id).map((l) => {
            callback_map.get(l.id)(l.args)
        })
        if(this.render_triggers.has(id)) start_animations(this.render_triggers.get(id))
     }
    get(type,index,row){
        if(row!=undefined){
            this.get_row(index,row)
        }
        else return constant_registry[type].get(index)
    }
    get_row(index,row){
        return constant_registry["matrix"].get(index).get(row)
    }
    get_number(index){
        return constant_registry["number"].get(index)
    }
}
// ----------------------------------------> DATABASE <--
const lerp_registry = new Lerp()
const constant_registry = new Constant()
const lerpChain_registry = new LerpChain()
const trigger_registry = new Map()
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
var targets,allow_render, args
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
                allow_render=lerp_registry.progress[val] % lerp_registry.render_interval[val] 
                if (allow_render == 0) {
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
                                lerp_registry.results.get(val)[i]= smoothLerp(
                                    lerpChain_registry.matrixChains.get(val).get(lerpChain_registry.progress[val])[i],
                                    lerpChain_registry.matrixChains.get(val).get(lerpChain_registry.progress[val]+1)[i],
                                    lerp_registry.delta_t[val] ,
                                    lerp_registry.smoothstep[val]
                                )
                            }
                            break;
                        default:
                            break
                    }
                   args={id:val,value:lerp_registry.results.get(val),step:lerpChain_registry.progress[val], time:lerp_registry.progress[val] ,step:lerpChain_registry.progress[val]} //time war vorther lerp_registry.delta_t[val]
                   if(lerp_registry.lerp_callbacks.has(val)) {
                     lerp_registry.lerp_callbacks.get(val)(args)
                   }
                }
                lerp_registry.progress[val] += 1
                if (allow_render==0) {
                    triggers_step=trigger_registry.get(val)!=undefined?trigger_registry.get(val).get(lerpChain_registry.progress[val]):undefined
                    if ( triggers_step != undefined) {
                        targets= triggers_step.get(lerp_registry.progress[val]-1)
                        targets&&targets.map((target)=>{
                            lerpChain_registry.soft_reset(target)
                        })
                    }
                }
            }
        } 
        else {
            if(lerp_registry.lerp_chain_start[val]!=undefined&&lerpChain_registry.update_progress(val)==true){
                finished.push(val);
            }
        }
    })
    return finished
}
var startTime,timeoutId
async function animateLoop() {
      loop_resolver = new AbortController()
      loop_resolver.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
      while (loop_resolver.signal.aborted == false) {
        startTime = performance.now();
        finished = [];
        if (lerp_registry.activelist.length > 0) {
          animate()
          render();
          if (finished.length > 0) {
            lerp_registry.activelist = lerp_registry.activelist.filter((active) => !finished.includes(active));
          }
          if (lerp_registry.activelist["length"] > 0) {
            await new Promise((resolve,reject) => {
              timeoutId = setTimeout(() => {
                resolve();
              }, Math.max(0, fps - (performance.now() - startTime)));
              
            });
          }
        else {
           return stop_loop()
           
          }
        }
      }
  }

function start_loop() {
    if(loop_resolver==null){
            animateLoop()
    }    
}
async function stop_loop() {
    if(loop_resolver!=null){
        loop_resolver.abort()
        loop_resolver=null
    }
}
    /**
     * starts a list of animations
     * @param {Array<number>} indices an array of ids of the animations to start
     */
function start_animations(indices){
    indices.map((id)=>{
        lerpChain_registry.soft_reset(id)
    })
    start_loop()
}
    /**
     * stops a list of animations
     * @param {Array<number>|string} indices an array of ids of the animations to stop; if "all", stops all animations
     */
function stop_animations(indices){
    if(indices==="all"){
        lerp_registry.activelist=[]
        stop_loop()
    }
    else{
        indices.map((id)=>{
            if(lerp_registry.activelist.includes(id)){
                lerp_registry.activelist=lerp_registry.activelist.filter((x)=>x!=id)
            }
        })
    }
    if (lerp_registry.activelist.length == 0) {
        stop_loop()
    } 
}
/**
 * Resets a list of animations.
 * 
 * If "all" is passed, stops the animation loop and resets all active animations.
 * Otherwise, resets each animation in the provided indices, re-activates it, and 
 * updates the results based on its type. If any animations were stopped and reset,
 * a render message is posted with the updated results.
 * 
 * @param {Array<number>|string} indices - An array of animation IDs to reset, or "all" to reset all animations.
 */

async function reset_animations(indices){
    if(indices=="all"){stop_loop();indices=lerp_registry.activelist}
    //stop_animations(indices)
    const stopped=[]    
    indices.map((x)=>{
        lerpChain_registry.reset(x);
        lerp_registry.activate(x)
        if(lerp_registry.activelist.includes(x)==false || loop_resolver==null){
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
    if(stopped.length>0) postMessage({ message: "render", results: lerp_registry.results, result_indices: indices })
}
/**
 * Changes the framerate of the animation loop.
 * 
 * @param {number} fps_new - The new framerate in frames per second.
 */
function change_framerate(fps_new) {
     fps = fps_new 
    }
const integers = ["loop","delay","type","progress","duration","render_interval","lerp_chain_start","activelist"]
function init(new_fps, lerps, lerpChains, matrixChains, triggers, constants, condi_new, lerp_callbacks, springs) {
    fps=new_fps
    triggers.forEach((trigger,key)=>trigger_registry.set(key,trigger))
    condi_new.forEach((val,key)=>{
            callback_map.set(key,eval(val))
    })
    lerp_callbacks.forEach((val,key)=>{
            // no shallow copy just copying the pointer
            lerp_registry.lerp_callbacks.set(key,callback_map.get(val))
    })
    
    lerpChains.forEach((arr,name)=>{
            lerpChain_registry[name]=new Float32Array(arr)
          //  console.log(lerpChain_registry[name])
    })
    lerpChain_registry.matrixChains=matrixChains
    lerps.forEach((array, name) => {
            if(integers.includes(name)==false ){
                lerp_registry[name] = new Float32Array(array)
            }
            else{lerp_registry[name] = new Uint8Array(array)}
    })
    if(constants.get("matrix")!=undefined){
        constants.get("matrix").forEach((val,i)=>{
            constant_registry.matrix.set(i,new Map())
            val.map((m,i2)=>{constant_registry.matrix.get(i).set(i2,new Float32Array(m))})
        })
    }
    if(constants.get("number")!=undefined){
        constant_registry.number=constants.get("number")
    }
    constant_registry.render_triggers=constants.get("render_triggers")
    constant_registry.render_callbacks=constants.get("render_callbacks")
    lerp_registry.type.map((t,i)=>{
        //  TODO hier zur vereinfachung interne get funktionen nehmen
        if(t==2){
            lerp_registry.results.set(i,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[i]])
        }
        else if(t==3){
            lerp_registry.results.set(i,new Float32Array(lerpChain_registry.matrixChains.get(i).get(0)))
        }
    })
    lerp_registry.delta_t=new Float32Array(lerp_registry.duration.length)
    lerp_registry.delay_delta=new Float32Array(lerp_registry.duration.length)
}
/**
 * Adds a trigger to the trigger registry.
 * If the trigger does not exist at the given time and step in the given animation, it is created.
 * If the trigger does exist, the target is added to the existing trigger.
 * @param {number} id - The id of the animation to add the trigger to.
 * @param {number} target - The target of the trigger.
 * @param {number} step - The step of the trigger.
 * @param {number} time - The time of the trigger.
 */
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
            var newtriggers=new Array(trigger)
            newtriggers.push(target)
            newtriggers= new Uint8Array(newtriggers)
            trigger_registry.get(id).get(step).set(time,newtriggers)
        }
        else{
            console.warn(`trigger already exists: target ${target} in timeframe ${time} in step ${step} on animation with id ${id}`)
        }   
    }
}
/**
 * Removes a trigger from the trigger registry.
 * If the trigger does not exist at the given time and step in the given animation, a warning is printed.
 * If the trigger does exist, the target is removed from the existing trigger.
 * If the trigger is empty after removal (i.e. it only contained the target), the trigger is removed.
 * @param {number} id - The id of the animation to remove the trigger from.
 * @param {number} target - The target of the trigger.
 * @param {number} step - The step of the trigger.
 * @param {number} time - The time of the trigger.
 */
function removeTrigger(id,target,step,time){
    var trigger=trigger_registry.get(id).get(step)
    if(trigger!=undefined){
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

/**
 * Calls a lambda function stored in callback_map with the given id and arguments.
 * @param {number} id - The id of the lambda function to call
 * @param {any[]} args - The arguments to pass to the lambda function
 */
function lambda_call(id,args){
       callback_map.get(id)(args)
}
// ----------------------------------------> EVENTS <--
async function render() {
    const active=lerp_registry.activelist.filter((x)=>lerp_registry.type[x]!=4)
    postMessage({ message: "render", results: lerp_registry.results, result_indices: active }) 
}
/**
 * This function can be called by the worker when a constant value is changed.
 * The main thread will receive a message with the changed value.
 * @param {number} id - the id of the constant
 * @param {number} type - the type of the constant (0 = number, 1 = matrix)
 */
async function render_constant(id,type) {
    postMessage({ message: "render_constant", id:id, type: type, value:  get_constant(id,type)})
}
var const_map_new
onmessage = (event) => {
    switch (event.data.method) {
        case 'init':
            init(
                event.data.fps,
                event.data.data, 
                event.data.chain_map, 
                event.data.matrix_chain_map, 
                event.data.trigger_map, 
                event.data.constants, 
                event.data.callback_map, 
                event.data.lerp_callbacks, 
                event.data.spring_map
            );
            break;
        case "update":
            update(event.data.type,event.data.data)
            break
        case 'update_constant':
                if(event.data.type=="matrix"){
                    const_map_new=new Map
                event.data.value.map((val,i)=>{
                    if(typeof(val)!="function"){
                        event.data.value[i]=new Float32Array(val)
                    }        
                    const_map_new.set(i,event.data.value[i])
                })
                constant_registry.update(event.data.type, event.data.id,const_map_new);
            }
            else{
                constant_registry.update(event.data.type, event.data.id,event.data.value);
            }
            
            break;
        case 'start':
            start_loop();
            break;
        case 'set_lambda':
             callback_map.set(event.data.id,eval(event.data.callback))
            break;
        //makes no sense since we would require a promise on the mainthread
        //this is shitty, cause you have to have a list of promises
        //however the user can still use get_active on the worker via callbacks, or lambdas
        // case 'get_active':
        //     postMessage({ message: "get_active", active:lerp_registry.activelist})
        //     break;
        case 'stop':
            stop_loop()
            break;
        case 'change_framerate':
            change_framerate(event.data.fps_new);
            break;
        case 'lambda_call':
            lambda_call(event.data.id,event.data.args);
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
// ----------------------------------------> User API <--

/**
 * Sets a Lerp target value for a certain step of an animation.
 * @param {number} index - the index of the animation
 * @param {number} step - the step for which the value should be set
 * @param {number} value - the value to set
 */
function setLerp(index,step,value){
    //console.log(lerpChain_registry.buffer[lerp_registry.lerp_chain_start[index]+step])
    lerpChain_registry.buffer[lerp_registry.lerp_chain_start[index]+step]=value
}
/**
 * Sets the matrix lerp target value for a certain step of an animation.
 * @param {number} index - the index of the animation
 * @param {number} step - the step for which the value should be set
 * @param {number[]} value - the matrix to set. The matrix is a 1 dimensional array of floats with a length that is a multiple of 4 (e.g. [r1, g1, b1, a1, r2, g2, b2, a2])
 */
function setMatrix(index,step,value){
   // console.log(lerpChain_registry.matrixChains.get(index).get(step))
    value.map((x,i) => {
        lerpChain_registry.matrixChains.get(index).get(step)[i]=x
    })
   // lerpChain_registry.matrixChains.get(index).get(step)
}
/**
 * Updates a constant value.
 * @param {number} id - the id of the constant to update
 * @param {string} type - the type of the constant (number or matrix)
 * @param {number | number[]} value - the new value of the constant
 */
function update_constant(id,type,value){constant_registry.update(type,id,value)}
/**
 * Gets a constant value.
 * @param {number} id - the id of the constant
 * @param {string} type - the type of the constant (number or matrix)
 * @returns {number | number[]} value - the value of the constant
 */
function get_constant(id,type){return constant_registry.get(type,id)}
/**
 * Gets the current progress of the animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The current progress value of the animation.
 */
function get_time(id){return lerp_registry.progress[id]}
/**
 * Checks if an animation is currently running.
 * @param {number} id - The identifier for the animation.
 * @returns {boolean} - true if the animation is currently running, false otherwise.
 */
function is_active(id){return lerp_registry.activelist.includes(id)}
/**
 * Gets the current step of the animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The current step value of the animation.
 */
function get_step(id){return lerpChain_registry.progress(id)}
/**
 * Gets the lerp result value of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The lerp result value of the animation.
 */
function get_lerp_value(id){return lerp_registry.results.get(id)}
/**
 * Starts and resets an animation if its finished, or not playing.
 * @param {number} id - The identifier for the animation.
 */
function soft_reset(id){lerpChain_registry.soft_reset(id)}
/**
 * Starts and resets an animation.
 * @param {number} id - The identifier for the animation.
 */
function hard_reset(id){lerpChain_registry.reset(id)}
/**
 * Sets the current progress of an animation and updates the delta t value accordingly.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The new progress value for the animation.
 */
function set_delta_t(id,val){lerp_registry.progress=val;lerp_registry.delta_t[id]=lerp_registry.duration[id]/lerp_registry.progress[id]}
/**
 * Sets the current step of an animation.
 * If the provided step value exceeds the maximum length of the animation, it will be set to the maximum length.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired step value for the animation.
 */

function set_step(id,val){lerpChain_registry.progress[id]=val>lerpChain_registry.lengths[id]?lerpChain_registry.lengths[id]:val}
/**
 * Gets the duration of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The duration of the animation.
 */
function get_duration(id){return lerp_registry.duration[id]}
/**
 * Sets the duration of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired duration value for the animation.
 */
function set_duration(id,val){lerp_registry.duration[id]=val}
/**
 * Retrieves the delay of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The delay value of the animation.
 */

function get_delay(id){return lerp_registry.delay[id]}
/**
 * Sets the delay of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired delay value for the animation.
 */
function set_delay(id,val){
    lerp_registry.delay[id]=val
}


/**
 * Retrieves the current delay progress value of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The current delay progress value of the animation.
 */
function get_delay_delta(id){
    return lerp_registry.delay_delta[id]}
/**
 * Sets the current delay progress value for an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired delay progress value for the animation.
 */
function set_delay_delta(id,val){lerp_registry.delay_delta[id]=val}
/**
 * Sets the sequence length of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired sequence length for the animation.
 */
function set_sequence_length(id,val){lerpChain_registry.lengths[id]=val}
/**
 * Retrieves a specific row from a matrix constant.
 * @param {number} id - The identifier for the matrix constant.
 * @param {number} row - The index of the row to retrieve from the matrix constant.
 * @returns {Array} - The specified row from the matrix constant.
 */
function get_constant_row(id,row){return constant_registry.get_row(id,row)}

/**
 * Retrieves a constant number value by its identifier.
 * @param {number} id - The identifier for the constant number.
 * @returns {number} - The constant number value associated with the given identifier.
 */
function get_constant_number(id){
    return constant_registry.get_number(id)}
/**
 * Retrieves an array of all active animation identifiers.
 * @returns {Array<number>} - An array of active animation identifiers.
 */
function get_active(id){return lerp_registry.activelist}
/**
 * Retrieves a boolean indicating whether the animation loop is currently running.
 * @returns {boolean} - true if the animation loop is currently running, false otherwise.
 */
function get_status(){
    return loop_resolver!=null
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
// this has to commented out when creating the docs
export {
    get_status,
    addTrigger,removeTrigger,
    get_time,set_delta_t,
    get_step,set_step,
    is_active,get_active,
    start_animations,stop_animations,
    setLerp,setMatrix,
    get_lerp_value,
    soft_reset,hard_reset,
    get_duration,set_duration,
    set_sequence_length,
    change_framerate,
    get_constant,get_constant_number,get_constant_row,render_constant,
    update_constant,
    set_delay,get_delay,
    get_delay_delta,set_delay_delta,
    lambda_call,
}
//t = callback_registry.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback
// const eslapsed = performance.now() - startTime;
// const waitTime = Math.max(0, fps - elapsed);
// postMessage({
//     message: "finish",
//     results: lerp_registry.results,
//     result_indices: lerp_registry.activelist
// });
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
  