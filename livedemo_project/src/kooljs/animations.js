// Copyright (c) 2025 Ji-Podhead and Project Contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

// 1. All commercial uses of the Software must:  
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).  
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).  

// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
const types = ["callback", "function", "number", "Linear", "Lerp", "constant"]
const animation_types = ["constant", "linear", "lerp"]
const animationProps = {}
class Callback {
    /**
     * A class to manipulate the  animated values, after the main calculations have been done.
     * If you pass type function it will run on the separate thread and you so fore need to pass a lambda/array function.
     * @param {"string = callback | function | number | Linear | Lerp | constant"} type - the type of the conditional weight; can be "callback" | "function" | "number" | "Linear" | "Lerp" | "constant": required parameter.
     * @param {"callback | lambda function | number | Linear | Lerp |"} target - the the target weight that will get added to the animation.required parameter. 
     * @param {"number"} [multiplikator=1] - the multiplikator for the calculation. default=1.
     * @param {"number"} [threshold=0] - the calculated weight will only get added to the animation value, after it reaches the threshold value; default=0;
     * @param {dict} [mainthread_args=undefined]  - the arguments that will get passed to the callback. The Animation Values will be added to the value of the field with the key animation_value; default=undefined
     */
    constructor(callback, threshold) {
        this.threshold = threshold
        this.callback = callback
    }
}
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
        this.id = 0
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
    constructor(animator, { accessor, duration = 10, render_interval = 1, smoothstep = 1, delay = 0, animationTriggers, callback, steps = undefined, lerpStart = undefined, steps_max_length }) {
        //currentValue = currentValue;
        if (animator == undefined) {
            return
        }
        const prop = new Prop(accessor)
        index = animator.registry_map.get("duration")["length"]
        this.id = index
        this.type = 2
        this.lerpStart = undefined
        animator.registry_map.get("type").push(2)
        if (steps != undefined) {
            const original_length = steps.length
            // last changes are here and steps related
            animator.registry_map.get("lerp_chain_start").push(animator.chain_map_points_length)

//                     >>> TRIGGERS <<<
//                       Trigger_Map           <- new Map
//                          Index              <- this.id eg 1
//                           \|/ 
//                           Step              <- new Map eg [1,5,6]
//    _________ _______ ____ \|/_       
//   |  stride |target | start   |     
//   |   [3]   |[0 1 2]|[0 0.5 1]|   <- Float32     
//   *****************************

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
        animator.registry_map.get("duration").push(duration)
        animator.registry_map.get("render_interval").push(render_interval)
        animator.registry_map.get("delay_delta").push(0)
        animator.registry_map.get("delay").push(delay)
        animator.registry_map.get("progress").push(0)
        animator.registry_map.get("smoothstep").push(smoothstep)
        prop.id = index
        animator.animation_objects.set(prop.id, {
            index: index,
            callback: callback,
            prop: prop
        })
        if (callback != undefined) {
            animator.callback_map.get("callback").push(callback.callback)
            animator.callback_map.get("threshold").push(callback.threshold)

        }
        animator.indexlist.set(index, prop.id)
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
class MatrixLerp {
    constructor(das_selbe_wie_lerp_bloß_andere_tüp) {
        this.das_selbe_wie_lerp_bloß_andere_tüp = das_selbe_wie_lerp_bloß_andere_tüp
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

        //      --> REGRISTRIES <-- 
        this.registry_map = new Map()
        this.callback_map = new Map()
        this.trigger_map= new Map()
        this.chain_map = new Map()
        this.registry_map.set('type', []);
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
        // --> chains <--
        this.chain_map_points = []
        this.chain_map_points_length = 0
        this.chain_map.set('buffer', []);
        this.chain_map.set('progress', []);
        this.chain_map.set('lengths', []);
        //      --> Spring <--
        this.spring_map.set("spring_elements", [])
        this.spring_map.set("spring_duration", [])
        this.spring_map.set("spring_tension", [])
        
        //      --> CONDITIONAL <--
        this.callback_map.set("callback", [])
        this.callback_map.set("threshold", [])

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
                        try{
                    ev.data.result_indices.map((value, index) => {
                        // console.log(`index: ${value} val: ${ev.data.results[index]}`)
                        this.animation_objects.get(value).prop.updater(ev.data.results[index], ev.data.result_indices[index])
                        
                    })
                }catch(err){
                    console.log("got err while setting value " + err)
                }
                }
                })
            
            };
            if (ev.data.message == "finished") {
                console.log('finished event:', ev);
                // eslint-disable-next-line array-callback-return
                ev.data.map((index) => {
                    this.obj = this.animation_objects.get(this.indexlist[index])
                    this.registry_map.get("progress")[index] = 0
                    this.registry_map.get("delay_delta")[index] = 0
                    if (this.obj.callback) {
                        this.obj.callback()
                    }
                })
            };
            if (ev.data.message == "trigger_event") {
                console.log('trigger event:');
                console.log(ev.data);
            };
        }
    }
    update_chain(id, val) {
        this.animation_objects.get(id).chain = new Float32Array(this.chain_map.get("buffer")).set(val)
    }
    init(autostart = true) {
        this.chain_map.set("buffer", new Float32Array(this.chain_map.get("buffer")))
        this.worker.postMessage({ method: 'init', data: this.registry_map, chain_map: this.chain_map, trigger_map:this.trigger_map,constants: this.constant_map, callback_map: this.callback_map, spring_map: this.spring_map });
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
    update_constant(data) {
        data.map((x) => {

            this.worker.postMessage({ method: 'update_constant', type: x.constant.type, id: x.constant.id, value: x.value });

        })
    }
    start(indices) {
        this.status=true
        this.worker.postMessage({ method: 'start', indices: indices });
    }
    stop() {
        this.status=false
        this.worker.postMessage({ method: 'stop' });
    }
    setFPS(fps) {
        this.worker.postMessage({ method: 'change_framerate', fps_new: fps });
    }
}
export { Prop, Animator, Lerp, Callback, Constant }