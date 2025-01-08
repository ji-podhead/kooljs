import React, { useState, useEffect, useMemo, useCallback } from 'react';
const types = ["callback", "function", "number", "Linear", "Lerp", "constant"]
class AnimationTrigger {
    /**
     * @param {Lerp} target - the animation this object will trigger
     * @param {float} start  - normalized time intervall(0-1) to trigger the animation at. a value of 1 will trigger the animation at the end
     */
    constructor(target, start) {
        this.time = start
        this.target = target.id
    }
}
// wenn eine constant als target gesetzt wird, dann muss auch manuell geupdated werden, 
// weil ich sonst ein parent-target(list) hier einbauen müsst, was die sache viel zu kompliziert macht 
// und keiner universalen logik mehr entspricht 
class Conditional_Weight {
    /**
     * A class to manipulate the  animated values, after the main calculations have been done.
     * If you pass type function it will run on the separate thread and you so fore need to pass a lambda/array function.
     * @param {"string = callback | function | number | Linear | Lerp | constant"} type - the type of the conditional weight; can be "callback" | "function" | "number" | "Linear" | "Lerp" | "constant": required parameter.
     * @param {"callback | lambda function | number | Linear | Lerp |"} target - the the target weight that will get added to the animation.required parameter. 
     * @param {"number"} [multiplikator=1] - the multiplikator for the calculation. default=1.
     * @param {"number"} [threshold=0] - the calculated weight will only get added to the animation value, after it reaches the threshold value; default=0;
     * @param {dict} [mainthread_args=undefined]  - the arguments that will get passed to the callback. The Animation Values will be added to the value of the field with the key animation_value; default=undefined
     */
    constructor(type, target, multiplicator = 1, threshold = 0, mainthread_args = undefined) {
        this.type = types.find(t => t == type)
        this.multiplicator = multiplicator
        this.threshold = threshold
        this.target = target
        this.mainthread_args = mainthread_args
        if (type == "callback" && mainthread_args == undefined) {
            return Error("mainthread_args is undefined")
        }
    }
}
var tempSet, tempGet
class Prop {
    update_callback(value) {
        this.setter(value)
    }
    update_map(value) {
        this.setter.set(this.point_to, value)
    }
    update_dict(value) {
        this.point_to = value
    }
    update_other(value) {
        this.setter = value
    }
    set(value) {
        this.updater(value)
    }

    get() {
        if (this.type == "useState") {
            return this.getter()
        }
        else if (this.type == "callback") {
            return this.getter("hier irgendwie ein val übergeben")
        }
        else {
            return this.setter
        }
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
    constructor(type, target, point_to = undefined, default_value = undefined) {
        this.type = type
        this.default_value = default_value
        this.point_to = point_to;
        this.id = 0
        switch (this.type) {
            case "useState": {

                if (target == undefined) {
                    return Error("you need to pass a use state instance because they cant get created conditionaly")
                }
                this.setter = target[1]
                this.getter = target[0]
                this.updater = this.update_callback
                break;
            }
            case "callback": {
                if (target == undefined) {
                    return Error("target is undefined")
                }
                else {
                    this.updater = this.update_callback
                    this.setter = target
                }
            }
            case "int": {
                if (this.target == undefined) {
                    this.setter = 0
                }
                else {
                    this.setter = target
                }
                this.updater = this.update_other
            }
            case "map": {
                this.setter = target
                this.updater = this.update_map
            }
            case "object": {
                this.setter = target
                this.updater = this.update_dict
            }
            default: {
                this.updater = this.update_other
                if (this.setter == undefined) {
                    this.setter = 0
                }
                else {
                    this.setter = target
                }
            }
        }
    }
}
var index
class Constant {
    /**
     * Constructor for Lerp class.
     * You can either pass in the target as a react prop or a map prop
     * the object you pass as prob will get overriden and will either be a map, or a react use state
     * @param {Prop} prop - the Prob instance that will be used to return the animated value
     * @param {Animator} animator - the Animator Instance
     * @param {number} delay - the maximum time to wait before starting the animation
     * @param {AnimationTrigger} animationTrigger - the AnimationTrigger instance to trigger other animations
     * @returns {number} returns the index of the typed array where the constant value is stored in the worker 
     */
    constructor(animator, prop, delay = 0, animationTrigger = undefined) {
        //currentValue = currentValue;
        index = animator.registry_map.get("min").length
        animator.registry_map.get("min").push(undefined)
        animator.registry_map.get("max").push(undefined)
        animator.registry_map.get("constant").push(prop.get())
        animator.registry_map.get("duration").push(1)
        animator.registry_map.get("render_interval").push(1)
        animator.registry_map.get("delay_delta").push(0)
        animator.registry_map.get("delay").push(delay)
        animator.registry_map.get("progress").push(0)
        prop.id = index
        this.id = index
        animator.animation_objects.set(prop.id, {
            index: index,
            callback: undefined,
            animationTrigger: animationTrigger,
            prop: prop
        })
        animator.indexlist.set(index, prop.id)
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
     * @param {AnimationTrigger} animationTrigger - the AnimationTrigger instance to trigger other animation
     * @param {Conditional_Weight} conditinoal_weight - the Conditional_Weight instance
     * @param {number} min - the minimum value of the animation; NOT REQUIRED HERE! we set this in our first update call 
     * @param {number} max - the maximum value of the animation; NOT REQUIRED HERE! we set this in our first update call  
    * @returns {[prop_target, index]} - returns an array consisting of the prob target and the index of the typed array where the Lerp value is stored in the worker. You can use the index for conditional weights that get calculated on the worker.
    */
    constructor(animator, prop = undefined, duration = 10, render_interval = 1, delay = 0, callback = undefined, animationTrigger = undefined, conditional_weight = undefined, min = undefined, max = undefined,) {
        //currentValue = currentValue;
        index = animator.registry_map.get("min")["length"]
        if (min != undefined && max != undefined) {
            animator.activelist.push(index)
        }
        else {
            min = min == undefined ? 1 : min
            max = max == undefined ? 1 : max
        }
        animator.registry_map.get("min").push(min)
        animator.registry_map.get("max").push(max)
        animator.registry_map.get("duration").push(duration)
        animator.registry_map.get("render_interval").push(render_interval)
        animator.registry_map.get("delay_delta").push(0)
        animator.registry_map.get("delay").push(delay)
        animator.registry_map.get("progress").push(1)
        animator.conditional_map.get("cond_type").push(conditional_weight != undefined && conditional_weight.mainthread_args == undefined ? conditional_weight.type : undefined)
        animator.conditional_map.get("cond_multiplicator").push(conditional_weight != undefined && conditional_weight.mainthread_args == undefined ? conditional_weight.multiplicator : undefined)
        animator.conditional_map.get("cond_threshold").push(conditional_weight != undefined && conditional_weight.mainthread_args == undefined ? conditional_weight.threshold : undefined)
        animator.conditional_map.get("cond_target").push(conditional_weight != undefined && conditional_weight.mainthread_args == undefined ? conditional_weight.target : undefined)
        animator.update_list.push(0)
        prop.id = index
        this.id = index
        animator.animation_objects.set(prop.id, {
            index: index,
            callback: callback,
            animationTrigger: animationTrigger,
            prop: prop
        })
        if (conditional_weight != undefined && conditional_weight.type == "callback") {
            animator.animation_objects[prop.id]["conditional_weight"] = conditional_weight
        }
        animator.indexlist.set(index, prop.id)
        //return [prop.setter,index]
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
    constructor(fps = 9000) {
        //      --> REGRISTRIES <-- 
        this.registry_map = new Map()
        this.conditional_map = new Map()
        //      --> CONSTANT <-- 
        this.registry_map.set('constant', []);
        //      --> LERP <-- 
        this.registry_map.set('min', []);
        this.registry_map.set('max', []);
        this.registry_map.set('type', []);
        this.registry_map.set('duration', []);
        this.registry_map.set('render_interval', []);
        this.registry_map.set('delay_delta', []);
        this.registry_map.set('delay', []);
        this.registry_map.set('progress', []);
        //      --> CONDITIONAL <--
        this.conditional_map.set('conditional_weight', []);
        this.conditional_map.set("cond_type", [])
        this.conditional_map.set("cond_multiplicator", [])
        this.conditional_map.set("cond_threshold", [])
        this.conditional_map.set("cond_target", [])
        //      --> UTIL <--
        this.fps = fps
        this.animation_objects = new Map()
        this.indexlist = new Map()
        this.update_list = []
        this.obj = undefined
        this.activelist = []
        this.worker = new Worker(new URL('./worker.js', import.meta.url));
        //      --> WORKER MESSAGES <--
        this.worker.onmessage = ev => {
            if (ev.data.message == "render") {
                console.log(ev.data.results)
                ev.data.result_indices.map((value, index) => {
                    this.animation_objects.get(value).prop.updater(ev.data.results[value])
                    // nur für mainthread conditional weighjts
                    //   if(this.animation_objects[this.indexlist[value]].conditional_weight!=undefined){
                    //    // this.animation_objects.get(this.indexlist[key]).conditional_weight_func(this.animation_objects.get(this.indexlist[key]).conditional_weight_args)
                    //   }
                })
            };
            if(ev.data.message=="finished"){
                console.log('finished event:', ev);
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

    init(autostart = true) {
        var length = this.registry_map.get("min")["length"]
        this.worker.postMessage({ method: 'init', data: this.registry_map, start: false, activelist: [] });
    }
    /**
     * Updates the animations with new data
     * @param {Object} data - the data to update
     * @example
     * animator.update([
     *       {
     *         target: constant,
     *         value:{constant:10}
     *       },
     *       {
     *         target: screenHeight,
     *         value:{
     *         min: screenHeight,
     *         max: window.innerHeight,
     *         }
     *       },
     *     ])
     */
    update(data) {
        // const update_index=[]
        // const update_val=[]
        // const update_name=[]
        // eslint-disable-next-line array-callback-return
        data.map((x) => {
            // this.update_list.push({ id: x.animObject.id, values: x.value })
            this.worker.postMessage({ method: 'update', id: x.animObject.id, values: x.value });
        })
        this.update_list = []
    }
    start() {
        this.worker.postMessage({ method: 'start', fps: this.fps });
    }
    stop() {
        this.worker.postMessage({ method: 'stop' });
    }
    setFPS(fps) {
        this.worker.postMessage({ method: 'change_framerate', fps_new: fps });
    }
}
export { Prop, Animator, Lerp, Conditional_Weight, Constant, AnimationTrigger }