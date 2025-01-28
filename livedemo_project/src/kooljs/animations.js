// Copyright (c) 2025 Ji-Podhead and Project Contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

// 1. All commercial uses of the Software must:  
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).  
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).  

// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
const types = ["callback", "function", "number", "Linear", "Lerp", "constant"]
const animation_types = ["constant", "linear", "lerp"]
const animationProps = {}

class Prop {
    update_callback(value, id) {
        this.setter(value, id)
    }
    get() {
        return this.getter()
    }
    /**
     * 
     * @param {float} default_value - the default value of the variable
     * @param {"useState"|"callback"|"map"|"object"|"int"|"other"} type - the type of the variable
     * @param {function|(float|number)} target - the target setter function of the useState hook or the value/object to be updated
     * @param {function|undefined} pointer - the function to be called with the updated value as argument
     * examples:
     * - useState: new Prob(0.0,"useState",<stateful value and function>)
     * - callback: new Prob(0.0,"callback",(v)=>{console.log(v)})
     * - int: new Prob(0.0,"int") => int
     * - map: new Prob(0.0,"map",new Map(),"key")
     * - object: new Prob(0.0,"object",{},"key")
     * The pointer is used to update the value of another variable or to call a function with the updated value as argument
     */
    constructor(target, point_to = undefined, default_value = undefined) {
        this.default_value = default_value
        this.point_to = point_to;
        this.setter = target[1]
        this.getter = target[0]
        this.updater = this.update_callback
    }
}
var index
class Constant {
    /**
     * Constructor for Lerp class.
     * You can either pass in the target as a react prop or a map prop
     * the object you pass as prob will get overriden and will either be a map, or a react use state
     * @param {Animator} animator - the Animator Instance
     * @param {string} type - the type of the constant can be number, matrix
     * @param {number | } value - the AnimationTrigger instance to trigger other animations
     * @returns {void} 
     */
    constructor(animator, type, value) {
        //currentValue = currentValue;
        index = animator.constant_map.get(type).length
        this.id = index
        this.type = type
        this.value = value
    }
}
class Lerp {
    /**
     * Constructor for Lerp class.
     * You can either pass in the target as a react prop or a map prop
     * the object you pass as prob will get overriden and will either be a map, or a react use state
     * @param {Animator} animator - the Animator Instance
     * @param {Prop} prop - the Prob instance that will be used to return the animated value
     * @param {number} type - 0: lerp; 1: smoothlerp; default: 0
     * @param {number} duration - the length of the animation in frames
     * @param {number} render_interval - the amount of fps to render / calculate the values
     * @param {number} delay - the maximum time to wait before starting the animation
     * @param {function} callback - the callback function to be called after the animation is complete
     * @param {Trigger} animationTrigger - the AnimationTrigger instance to trigger other animation
     * @param {Callback} conditinoal_weight - the Conditional_Weight instance
    * @returns {[prop_target, index]} - returns an array consisting of the prob target and the index of the typed array where the Lerp value is stored in the worker. You can use the index for conditional weights that get calculated on the worker.
    */
    constructor(animator, { accessor, duration = 10, render_interval = 1, smoothstep = 1, delay = 0, animationTriggers, callback, steps = undefined, loop=false, steps_max_length }) {
        //currentValue = currentValue;
        if (animator == undefined) {
            return
        }
        index = animator.animation_objects.size
        this.id = index
        this.lerpStart = undefined
        animator.count+=1
        if (steps != undefined) {
            const original_length = steps.length
            // last changes are here and steps related
            animator.registry_map.get("lerp_chain_start").push(animator.chain_map_points_length)
            if(loop==true){
                animator.registry_map.get("loop").push(1)
                const loop_trigger={
                    step:original_length-2,
                    start:duration,
                    target:index
                  }
                if(animationTriggers==undefined){
                    animationTriggers=[loop_trigger]
                }
                else{
                    animationTriggers.push(loop_trigger)
                }
            }
            else{
                animator.registry_map.get("loop").push(0)
            }
            if (animationTriggers != undefined) {
                const stepMap = new Map()
                
                let st = new Array(steps.length)
                // im sorting after steps and then add the values to the registr.
                    animationTriggers.map((t) => {
                        if (Array.isArray(st[t.step]) == false) {
                            st[t.step] = []
                        }
                        st[t.step].push([t.target, t.start])
                    })
                st.map((s,i) => {
                    if (s.length > 0) {
                        const frames=new Map()
                        s.map((x)=>{
                            if(frames.get(x[1])==undefined){
                                frames.set(x[1],[])
                            }
                            frames.get(x[1]).push(x[0])
                        })
                        
                        frames.forEach((targets, frame) => {
                            const idArray = new Uint16Array(targets); // 2x schneller als normale Arrays
                            frames.set(frame, idArray);
                        });
                        
                    stepMap.set(i,(frames))
                    }                    
                })
            animator.trigger_map.set(this.id,stepMap)
            }

            if (steps_max_length != undefined) {
                const n = new Array(steps_max_length - steps.length).fill(0, 0, steps_max_length - steps.length)
                steps = steps.concat(n)
            }
            animator.chain_map.set("buffer", animator.chain_map.get("buffer").concat(steps))
            animator.chain_map_points_length += steps.length
            animator.chain_map.get("lengths").push(original_length-1) // WE DONT USE STEPS LENGTH HERE! WE UPDATE THE LENGTH VALUE IF THE USER UPDAES THE STEP WHILE THE STEPSLENGTH IS NEW
            animator.chain_map.get("progress").push(0)
        }
        else {
            animator.registry_map.get("lerp_chain_start").push(undefined)
        }
        if (callback != undefined&&callback.callback!=undefined) {
            callback.condition=callback.condition==undefined?true:callback.condition
            animator.callback_map.set(index,callback)
        }
        animator.registry_map.get("duration").push(duration)
        animator.registry_map.get("render_interval").push(render_interval)
        animator.registry_map.get("delay_delta").push(0)
        animator.registry_map.get("type").push(2)
        animator.registry_map.get("delay").push(delay)
        animator.registry_map.get("progress").push(0)
        animator.registry_map.get("smoothstep").push(smoothstep)
        animator.animation_objects.set(this.id, {
            index: index,
            callback: callback,
            prop: new Prop(accessor)
        })
        animator.animation_objects.get(this.id).prop.id=this.id

        //return [prop.setter,index]
    }
}
class lerpDiv {

}
class Spring {
    constructor(animator, elements, duration, spring_tension, spring_whatever) {
        this.elements = elements
    }
}
class Matrix_Lerp {
    constructor(animator, { accessor, duration = 10, render_interval = 1, smoothstep = 1, delay = 0, animationTriggers, callback, steps = undefined, loop=false, steps_max_length }) {
        //currentValue = currentValue;
        if (animator == undefined) {
            return
        }
        index = animator.animation_objects.size
        this.id = index
        animator.count+=1
        animator.registry_map.get("lerp_chain_start").push(0)
        const matrix_map= new Map()
        if (steps != undefined) {
            steps.map((step,index)=>{
                matrix_map.set(index,new Float32Array(step))
            })
        }
        animator.matrix_chain_map.set(index, matrix_map)
        const length=steps_max_length!=undefined?steps_max_length:steps.length-1
        animator.chain_map_points_length += length
        animator.chain_map.get("lengths").push(length)
        animator.chain_map.get("progress").push(0)
        animator.registry_map.get("duration").push(duration)
        animator.registry_map.get("type").push(3)
        animator.registry_map.get("render_interval").push(render_interval)
        animator.registry_map.get("delay_delta").push(0)
        animator.registry_map.get("delay").push(delay)
        animator.registry_map.get("progress").push(0)
        animator.registry_map.get("smoothstep").push(smoothstep)
        animator.animation_objects.set(this.id, {
            index: index,
            callback: callback,
            prop: new Prop(accessor)
        })
        animator.animation_objects.get(this.id).prop.id=this.id
    }
}
class Animator {
    /**
     * The Animator Class lets you create and control the animation thread to manage your animations
     * @param {number} fps - the fps to render animations; default: 33.33
     * @param {boolean} autostart - whether or not to call the init method after construction; default: true
     * @class
     * @author JI-Podhead
     */
    constructor(fps) {
        this.count=0
        //      --> REGRISTRIES <-- 
        this.registry_map = new Map()
        this.callback_map = new Map()
        this.trigger_map= new Map()
        this.chain_map = new Map()
        this.matrix_chain_map = new Map()
        this.spring_map = new Map()
        //--> constant <--
        this.constant_map = new Map()
        this.constant_map.set("number", [])
        this.constant_map.set("matrix", [])
        //--> animation objects (Lerp...) <--

        this.registry_map.set('type', []);
        this.registry_map.set('duration', []);
        this.registry_map.set('render_interval', []);
        this.registry_map.set('delay_delta', []);
        this.registry_map.set('delay', []);
        this.registry_map.set('progress', []);
        this.registry_map.set('smoothstep', []);
        this.registry_map.set('lerp_chain_start', []);
        this.registry_map.set('loop', []);
        // --> chains <--
        this.chain_map_points = []
        this.chain_map_points_length = 0
        this.chain_map.set('buffer', []);
        this.chain_map.set('progress', []);
        this.chain_map.set('lengths', []);
        // --> Matrix chains <--
        this.matrix_chain_map= new Map()
        //      --> Spring <--
        this.spring_map.set("spring_elements", [])
        this.spring_map.set("spring_duration", [])
        this.spring_map.set("spring_tension", [])
        

        //      --> UTIL <--
        this.fps = fps
        this.status=false
        this.animation_objects = new Map()
        this.indexlist = new Map()
        this.obj = undefined
        this.activelist = []
        this.chain_buffer = undefined
        this.worker = new Worker(new URL('./worker.js', import.meta.url));
        //      --> WORKER MESSAGES <--
        this.worker.onmessage = ev => {
            if (ev.data.message == "render") {
               
                requestAnimationFrame(() => {
                    if(this.status!=false){
                        
                    ev.data.result_indices.map((value, index) => {
                        // console.log(`index: ${value} val: ${ev.data.results[index]}`)
                        try{
                        this.animation_objects.get(value).prop.updater(ev.data.results.get(value), ev.data.result_indices[index])
                        }catch(err){
                            console.log(`could not set value of animation ${ev.data.result_indices[index]} -` + err)
                            try{
                            this.stop_animations([ev.data.result_indices[index]])
                            }
                            catch(err){
                                this.stop_animations("all")
                                console.error("stopping all animations. There was am Error while stopping animations: "+ err);
                                
                        }
                    }
                    })
                }
                })
            
            };
            // if (ev.data.message == "finished") {
            //     console.log('finished event:', ev);
            //     // eslint-disable-next-line array-callback-return
            //     ev.data.map((index) => {
            //         this.obj = this.animation_objects.get(this.indexlist[index])
            //         if (this.obj.callback) {
            //             this.obj.callback()
            //         }
            //     })
            // };
        }
    }
    update_chain(id, val) {
        this.animation_objects.get(id).chain = new Float32Array(this.chain_map.get("buffer")).set(val)
    }
    init(autostart = true) {
        this.chain_map.set("buffer", new Float32Array(this.chain_map.get("buffer")))
        this.worker.postMessage({ method: 'init', data: this.registry_map, chain_map: this.chain_map, matrix_chain_map: this.matrix_chain_map, trigger_map:this.trigger_map,constants: this.constant_map, callback_map: this.callback_map, spring_map: this.spring_map });
        this.setFPS(this.fps)
    }
    /**
     * Updates the animations with new data
     * @param {Object} data - the data to update
     */
    update_lerp(data) {
        this.worker.postMessage({ method: 'update', type: 2, data: data })
    }
    Lerp(args) {
        return new Lerp(this, args)
    }
    Matrix_Lerp(args) {
        return new Matrix_Lerp(this, args)
    }
    update_constant(data) {
        data.map((x) => {
            this.worker.postMessage({ method: 'update_constant', type: x.constant.type, id: x.constant.id, value: x.value });
        })
    }
    start_animations(indices) {
        this.status=true
        this.worker.postMessage({ method: 'start_animations', indices: indices });
    }
    stop_animations(indices) {
        this.worker.postMessage({ method: 'stop_animations', indices: indices });
    }
    reset_animations(indices) {
        this.worker.postMessage({ method: 'reset_animations', indices: indices });
    }
    stop() {
        this.status=false
        this.worker.postMessage({ method: 'stop' });
    }
    setFPS(fps) {
        this.worker.postMessage({ method: 'change_framerate', fps_new: fps });
    }
}
export { Prop, Animator, Lerp, Constant }