// Copyright (c) 2025 Ji-Podhead and Project Contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:
// 1. All commercial uses of the Software must:
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).
// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import { Worker_Utils } from "kooljs/worker_utils";




var triggers_step,animator,active_index,triggers_step

// ----------------------------------------> Render Maps <-- 

// ----------------------------------------> CLASS DEFINITIONS <--

class Lerp extends Worker_Utils {
    constructor(results, buffer, callback_map, type, duration, render_interval, delay, smoothstep, lerp_chain_start, loop, group, group_lookup, lerp_callback_ids) {
        super()
        this.type = type
        this.duration = duration
        this.render_interval = render_interval
        this.delay_delta = new Uint8Array(delay.length)
        this.delay = delay
        this.progress = new Uint8Array(delay.length);
        this.smoothstep = smoothstep
        this.lerp_chain_start = lerp_chain_start
        this.loop = loop

        this.group = group
        this.group_lookup = group_lookup
        this.active_groups = new Set()
        this.active_group_indices = new Map()
        this.active_timelines = new Set()
        this.active_matrices = new Set()
        this.active_numbers = new Uint8Array()


        this.group_results_render = new Map()
        this.active_group_indices_render = new Map()
        this.matrix_results_render = new Map()
        this.number_results_render = new Float32Array()
        
        this.buffer = buffer
        this.matrix_results = results.get("matrix_results")
        this.number_results = results.get("number_results")
        this.group_results=new Map()
        this.lerp_callbacks = new Map();
        this.loop_resolver = null;
        lerp_callback_ids.forEach((val, key) => {
            // no shallow copy just copying the pointer
            this.lerp_callbacks.set(key, callback_map.get(val));
        });
    }
    activate(id) {
        switch (this.type[id]) {
            case (2):
                if (this.active_numbers.includes(id) == false) {
                    this.active_numbers=Float32Array.from( [...this.active_numbers, id] )
                    return false
                }
                else{
                    return true
                }
            case (3):
                //if(this.group.has(id)!=true){
                if (this.active_matrices.has(id) == false) {
                    this.active_matrices.add(id)
                    
                    return false
                }
                else{
                    return true
                }
            case (4):
                if (this.active_timelines.has(id) == false) {
                    this.active_timelines.add(id)
                    return false
                }
                else{
                    return true
                }
        }
    }
    delete_group_member(id) {
        if (this.group.has(id)) {
            const group=this.group.get(id)
            if (this.active_groups.has(group)) {
                this.active_group_indices.get(group).delete(id)
                this.group_results_render.get(group).delete(this.group_lookup.get(id))
                if (this.active_group_indices.get(group).size == 0) {
                    this.active_groups.delete((group))
                    this.group_results_render.delete(group)
                }
                return true
            }
            return false
        }
        else{return false}
    }
    deactivate(id) {
        switch (this.type[id]) {
            case (3):
                if(this.delete_group_member(id)==false){
                    this.active_matrices.delete(id);
                    this.matrix_results_render.delete(id);
                }
                break
            case (2):
                active_index=this.active_numbers.indexOf(id)
                this.active_numbers=Float32Array.from([...this.active_numbers.slice(0,active_index),...this.active_numbers.slice(active_index+1,this.active_numbers.length)])
                this.number_results_render=Float32Array.from(this.active_numbers.map((val) => this.number_results.get(val)))
                break
            case (4):
                this.active_timelines.delete(id);
        }
    }
    stop_all() {
        this.active_numbers = []
        this.active_matrices.clear()
        this.active_timelines.clear()
        this.active_groups.clear()
        this.active_groups.forEach((val, key) => {
            this.active_group_indices.get(key).clear()
            
        })
        this.group_results_render.clear()
        this.matrix_results_render.clear()
        this.number_results_render=new Float32Array()
        // this.active_group_indices.forEach((val, key) => {
        //     this.active_group_indices.set(key, [])
        // })
    }
}
const default_target_step = [0, 1]
var final_step, final_sub_step;
class LerpSequence extends Worker_Utils{
    /**
     * The constructor for the LerpChain class.
     * Initializes properties related to the state and progress of the lerp chain.
     *
     * @property {Array|undefined} buffer - The buffer holding the chain data.
     * @property {Map|undefined} matrixChains - The map containing matrix chains.
     * @property {Array|undefined} progress - The progress of each chain.
     * @property {Array|undefined} lengths - The lengths of each chain.
     */

    constructor(buffer, matrix_sequences, progress, lengths,animator) {
        super()
        this.buffer = buffer
        this.matrix_sequences = matrix_sequences
        this.progress = progress
        this.lengths = lengths
        this.lerp_registry=animator.lerp_registry
      
    }
    update_progress(id) {
        if (this.progress[id] == this.lengths[id] - 1) {
            this.stop_animations([id])
        } else {
            this.reset_and_update(id);
            return false;
        }
    }
    reset_and_update(id) {
        this.lerp_registry.delay_delta[id] = 0;
        this.lerp_registry.progress[id] = 0;
        this.progress[id] += 1;
    }
    reset(id) {
        switch(this.lerp_registry.type[id]){
            case(2):
                this.lerp_registry.number_results[id]=this.buffer[this.lerp_registry.lerp_chain_start[id]]
                break
            case(3):
                if(!this.lerp_registry.group.get(id))
                this.lerp_registry.matrix_results.set(
                    id,
                    this.matrix_sequences.get(id).get(0)
                );
                break
        }
        this.lerp_registry.delay_delta[id] = 0;
        this.lerp_registry.progress[id] = 0;
        this.progress[id] = 0;
    }
    soft_reset(id) {
        if(this.lerp_registry.activate(id)==false){
        final_step = this.progress[id] == this.lengths[id] - 1;
        final_sub_step = this.lerp_registry.progress[id] >= this.lerp_registry.duration[id];
        if (final_step && final_sub_step) {
            this.reset(id);
        } else if (final_sub_step) {
            this.reset_and_update(id);
        }
    }
    }
}
var indices
class Matrix_Chain extends Worker_Utils{
    constructor(indices, ref_matrix, orientation_step, max_duration, min_duration, custom_delay, max_length,animator) {
        super()
        this.indices = indices;
        this.ref_matrix = ref_matrix;
        this.orientation_step = orientation_step
        this.max_duration = max_duration;
        this.min_duration = min_duration;
        this.custom_delay =custom_delay;
        this.max_length = max_length
        this.lerp_registry=animator.lerp_registry
        this.sequence_registry=animator.sequence_registry
        this.constant_registry=animator.constant_registry
        this.start_loop=animator.start_loop
        this.callback_map=animator.callback_map
        this.result_map=new Map()
        indices.forEach((val,i)=>
        {
            this.lerp_registry.active_group_indices.set(i, new Set())
            this.lerp_registry.group_results.set(i, new Map())
            val.map((group,i2)=>{
                this.lerp_registry.group_results.get(i).set(i2,ref_matrix.get(i).get(i2))
            })

        })
    }
    reorient_matrix_chain({id, target_step, direction}) {
        var indices=this.indices.get(id)
        indices.map((index, i) => {
            var ref = this.ref_matrix.get(id)
            const current = this.get_lerp_value(index);
            const base=i*this.max_length[id]
            this.lerp_registry.active_group_indices.get(id).add(index)
            ref=ref.get(target_step[ direction]+base );
            if (ref[1] == current) {
                return console.log("target animation is reachead");
            }
            this.hard_reset(index);
            this.reorient_target({
                index: index,
                step: 0, // this is alway zero, since the matrix itself has a steplength of 2, but the ref matrix lnegth can be bigger
                direction: 1,
                matrix_row: 0,
                verbose: false,
                reference: ref,
            });
            if (this.custom_delay[id] >=0) {
                const delay=(this.lambda_call(this.custom_delay[id],{animation_index:index,index:i,indices:indices,direction:direction,target_step:target_step}) ||0)
                this.set_delay(index, delay);
            }
            this.reorient_duration_by_progress({
                index: index,
                min_duration: this.min_duration[id],
                max_duration: this.max_duration[id],
                soft_reset:false
            });
            // console.log(`index: ${index} i: ${i}
            //     new_duration ${duration}
            //     current_position: ${current[0]}, ${current[1]} target_position ${ref[0]}, ${ref[1]} `
            // )
        });
    }
    start_matrix_chain(direction, id) {
        this.result_map.clear()
        this.lerp_registry.group_results_render.set(id,this.result_map)
        
        //this.lerp_registry.active_group_indices_render.set(id,this.lerp_registry.active_group_indices.get(id))
        this.reorient_matrix_chain({
            id: id,
            direction: direction,
            target_step: this.orientation_step.has(id) ? this.orientation_step.get(id) : default_target_step[direction == 0 ? 1 : 0],
        })
        this.lerp_registry.active_groups.add(id)
    
    }

}
class Constant extends Worker_Utils {
    constructor(constants,animator) {
        super()
        this.reg=new Map()
        this.reg.set("matrix",new Map())
        this.reg.set("number",undefined)
        this.render_triggers = new Map();
        this.render_callbacks = new Map();
        this.animator=animator
        if (constants.get("matrix") != undefined) {
            constants.get("matrix").forEach((val, i) => {
                this.reg.get("matrix").set(i, new Map());
                val.map((m, i2) => {
                    this.reg.get("matrix").get(i).set(i2, new Float32Array(m));
                });
            });
        }
        if (constants.get("number") != undefined) {
            this.reg.set("number",constants.get("number"))
        }
        this.render_triggers = constants.get("render_triggers");
        this.render_callbacks = constants.get("render_callbacks");
    }
    update(type, id, value) {
        //["matrix","number"].includes["type"]&&this.reg.get(type).has(id)&&
        this.reg.get(type).set(id, value);
        if (this.render_callbacks.has(id))
            this.render_callbacks.get(id).map((l) => {
                this.animator.callback_map.get(l.id)(l.args);
            });
        if (this.render_triggers.has(id))
            this.animator.start_animations(this.render_triggers.get(id));
    }
    get(type, index, row) {
        if (row != undefined) {
            this.get_row(index, row);
        } else return this.reg.get(type).get(index);
       
    }
    get_row(index, row) {
        return this.reg.get("matrix").get(index).get(row);
    }
    get_number(index) {
        return this.reg.get("number").get(index);
    }
}
// ----------------------------------------> ANIMATION <--
var t;
var targets, allow_render, args, delta_t, res
var startTime, timeoutId
var indices, buffer
function smoothLerp(min, max, v, amount) {
    t = smoothstep(v);
    //  t=(t*amount)/t
    return max * t + min * (1 - t);
}
function smoothstep(x) {
    return x * x * (3 - 2 * x);
}
class Animator extends Worker_Utils {
    constructor(new_fps, lerps, lerpChains, results, buffer, triggers, constants, condi_new, matrix_chains, springs) {
        super()
        this.fps = new_fps;
        this.callback_map = new Map();
        this.trigger_registry = new Map();
        this.callback_map = new Map();
        triggers.forEach((trigger, key) => this.trigger_registry.set(key, trigger));
        condi_new.forEach((val, key) => {
            try {
                this.callback_map.set(key, eval(val));
            } catch (err) {
                console.error(
                    "failed to eval callback function on the worker for: " + key
                );
                console.error(val);
                console.error(err);
            }
        });

        this.lerp_registry = new Lerp(
            results,
            buffer,
            this.callback_map,
            new Uint8Array(lerps.get("type")),
            new Uint8Array(lerps.get("duration")),
            new Uint8Array(lerps.get("render_interval")),
            new Uint8Array(lerps.get("delay")),
            new Uint8Array(lerps.get("smoothstep")),
            new Uint8Array(lerps.get("lerp_chain_start")),
            new Uint8Array(lerps.get("loop")),
            (lerps.get("group")),
            (lerps.get("group_lookup")),
            lerps.get("lerp_callbacks"),
            this
        )
        this.sequence_registry = new LerpSequence(
            new Float32Array(lerpChains.get("buffer")),
            (lerpChains.get("matrix_buffer")),
            new Uint8Array(lerpChains.get("progress")),
            new Uint8Array(lerpChains.get("lengths")),
            this
        )
        this.matrix_chain_registry = new Matrix_Chain(
            matrix_chains.get("indices"),
            matrix_chains.get("ref_matrix"),
            matrix_chains.get("orientation_step"),
            new Uint8Array(matrix_chains.get("max_duration")),
            new Uint8Array(matrix_chains.get("min_duration")),
            new Uint8Array(matrix_chains.get("custom_delay")),
            new Uint8Array(matrix_chains.get("max_length")),
            this
        )
        this.constant_registry = new Constant(constants,this)
   this.animateLoop = async function() {
        try {
            this.loop_resolver = new AbortController();
            this.loop_resolver.signal.addEventListener("abort", () => {
                clearTimeout(timeoutId);
            });
            while (this.loop_resolver.signal.aborted == false) {
                startTime = performance.now();
                this.lerp_registry.active_timelines.forEach((id) => this.animate(id))
                this.lerp_registry.active_numbers.map((id,i) =>
                     this.animate(id, this.animate_number, this.lerp_registry.number_results,2,i))
                this.lerp_registry.active_matrices.forEach((id) => this.animate(id, this.animate_matrix, this.lerp_registry.matrix_results,3))
                this.lerp_registry.active_groups.forEach((group_id) => {
                    this.lerp_registry.active_group_indices.get(group_id).forEach((id,i) => {this.animate(id,  this.animate_matrix, this.lerp_registry.matrix_results,0,group_id,i)})
                })
                this.render();
                if (this.lerp_registry.active_groups.size > 0
                    || this.lerp_registry.active_timelines.size > 0
                    || this.lerp_registry.active_matrices.size > 0
                    || this.lerp_registry.active_numbers.length > 0
                ) {
                    await new Promise((resolve, reject) => {
                        timeoutId = setTimeout(() => {
                            resolve();
                        }, Math.max(0, this.fps - (performance.now() - startTime)));
                    });
                } else {
                    return this.stop_loop();
                }
            }
        } catch {
            (err) => {
                this.stop_loop();
                this.stop_animations("all");
                return Error("had a error during animation. stoppingloop! " + err);
            };
        }
    }
     this.animate_matrix=((id, delta_t, target)=>{
        //lookup = this.lerp_registry.a.get(id) != undefined ? this.lerp_registry.group_lookup.get(id) : id
        for (let i = 0; i < this.sequence_registry.matrix_sequences.get(id).get(this.sequence_registry.progress[id]).length; i++) {
            
            target.get(id)[i] = smoothLerp(
                this.sequence_registry.matrix_sequences
                    .get(id)
                    .get(this.sequence_registry.progress[id])[i],
                this.sequence_registry.matrix_sequences
                    .get(id)
                    .get(this.sequence_registry.progress[id] + 1)[i],
                delta_t,
                this.lerp_registry.smoothstep[id]
            );

        }
        
    })
    
     this.animate_number=((id, delta_t, target, render_index)=> {
        this.lerp_registry.number_results_render[render_index]=target[id] = smoothLerp(
            this.sequence_registry.buffer[
            this.lerp_registry.lerp_chain_start[id] +
            this.sequence_registry.progress[id]
            ],
            this.sequence_registry.buffer[
            this.lerp_registry.lerp_chain_start[id] +
            this.sequence_registry.progress[id] +
            1
            ],
            delta_t,
            this.lerp_registry.smoothstep[id]
        )
    })
    this.animate=async function(index, method, target,type,reference){
            if (this.lerp_registry.progress[index] <= this.lerp_registry.duration[index]) {
                if (this.lerp_registry.delay_delta[index] < this.lerp_registry.delay[index]-1) {
                    this.lerp_registry.delay_delta[index] += 1;
                }
                else if(this.lerp_registry.delay_delta[index]==0||(this.lerp_registry.delay_delta[index] < this.lerp_registry.delay[index])){
                    this.lerp_registry.delay_delta[index] += 1;
                 if(method!=undefined){ switch(type){
                        case(0):
                        this.lerp_registry.group_results_render.get(reference).set(this.lerp_registry.group_lookup.get(index),this.lerp_registry.matrix_results.get(index))
                        break
                        case(2):
                               this.lerp_registry.number_results_render = Float32Array.from([this.lerp_registry.number_results_render,this.lerp_registry.number_results[index]])
                                break;
                        case(3):
                            this.lerp_registry.matrix_results_render.set(index, this.lerp_registry.matrix_results.get(index))
                        break
                    }
                }
                }
                 else {
                    allow_render = this.lerp_registry.progress[index] % this.lerp_registry.render_interval[index];
                    if (allow_render == 0) {
                        delta_t = this.lerp_registry.progress[index] / this.lerp_registry.duration[index];
                        if(method!=undefined)res = method(index, delta_t, target,reference)
                        args = {
                            id: index,
                            value: res,
                            step: this.sequence_registry.progress[index],
                            time: this.lerp_registry.progress[index],
                            step: this.sequence_registry.progress[index],
                        };
                        if (this.lerp_registry.lerp_callbacks.has(index)) {
                            try {
                                this.lerp_registry.lerp_callbacks.get(index)(args);
                            }
                            catch (err) { console.log(err) }
                        }
                    }
                    this.lerp_registry.progress[index] += 1;
                    if (allow_render == 0) {
                        triggers_step =
                            this.trigger_registry.get(index) != undefined
                                ? this.trigger_registry.get(index).get(this.sequence_registry.progress[index])
                                : undefined;
                        if (triggers_step != undefined) {
                            targets = triggers_step.get(this.lerp_registry.progress[index] - 1);
                            targets &&
                                targets.map((target) => {
                                    if (target == index) this.hard_reset(target);
                                    else this.soft_reset(target);
                                });
                        }
                    }
                }
            } else {
                    this.sequence_registry.update_progress(index)
            }
    }
    
    this.render=()=>{
        if (!self.crossOriginIsolated) {
            buffer = new ArrayBuffer(this.lerp_registry.buffer)
        }
        else {
            buffer = new SharedArrayBuffer(this.lerp_registry.buffer)
        }
        postMessage(
            {
                message: "render",
                number_results: this.lerp_registry.number_results_render,
                active_numbers: this.lerp_registry.active_numbers,
                matrix_results: this.lerp_registry.matrix_results_render,
                group_results: this.lerp_registry.group_results_render,
            },
            [buffer])
    }


}
}
var const_map_new;
onmessage = (event) => {
    switch (event.data.method) {
        case "init":
            animator=new Animator(
                event.data.fps,
                event.data.data,
                event.data.chain_map,
                event.data.results,
                event.data.buffer,
                event.data.trigger_map,
                event.data.constants,
                event.data.callback_map,
                event.data.matrix_chain_map,
                event.data.spring_map
            );
            break;
        case "update":
            animator.update(event.data.type, event.data.data);
            break;
        case "update_constant":
            if (event.data.type == "matrix") {
                const_map_new = new Map();
                event.data.value.map((val, i) => {
                    if (typeof val != "") {
                        event.data.value[i] = new Float32Array(val);
                    }
                    const_map_new.set(i, event.data.value[i]);
                });
                animator.constant_registry.update(event.data.type, event.data.id, const_map_new);
            } else {
                animator.constant_registry.update(
                    event.data.type,
                    event.data.id,
                    event.data.value
                );
            }
            break;
        case "start":
            start_loop();
            break;
        case "set_lambda":
            animator.callback_map.set(event.data.id, eval(event.data.callback));
            break;
        case "stop":
            animator.stop_loop();
            break;
        case "change_framerate":
            animator.change_framerate(event.data.fps_new);
            break;
        case "lambda_call":
            animator.lambda_call(event.data.id, event.data.args);
            break;
        case "start_animations":
            animator.start_animations(event.data.indices);
            break;
        case "stop_animations":
            animator.stop_animations(event.data.indices);
            break;
        case "start_groups":
            animator.start_group(event.data.directions,event.data.indices);
            break;
        case "stop_groups":
            animator.stop_group(event.data.indices);
            break;
        case "reset_animations":
            animator.reset_animations(event.data.indices);
            break;
        case "addTrigger":
            animator.addTrigger({
                id:event.data.id,
                target:event.data.target,
                step:event.data.step,
                time:event.data.time}
            );
            break;
        case "removeTrigger":
            animator.removeTrigger({
                id:event.data.id,
                target:event.data.target,
                step:event.data.step,
                time:event.data.time}
            );
            break;
        default:
            console.warn("no method selected during worker call");
            break;
    }
};
// ----------------------------------------> REQUIRES IMPLEMENTATION <--

class Spring {
    constructor(elements, duration, spring_tension, spring_whatever) {
        this.elements = elements;
        this.duration = duration;
        this.spring_tension = spring_tension;
    }
}
//dijkstra algo für matrix
function shortest_path() { }
// k nearest neigbor for matrix (not sure if also for lerp)
function knn() { }
//matrix and callback for lerp
function convex_hull() { }
function spring() { }
export {
    Animator as animator,Lerp,Matrix_Chain,Constant,LerpSequence
}

// this has to commented out when creating the docs

//t = callback_registry.callback.get(val)?.(val, t) ?? undefined; //  Null-Coalescing-Operator -- if callback not undefined then use and process the value t for callback
// const eslapsed = performance.now() - startTime;
// const waitTime = Math.max(0, fps - elapsed);
// postMessage({
//     message: "finish",
//     results: this.lerp_registry.results,
//     result_indices: this.lerp_registry.activelist
// });
// function triggers() {
//     postMessage({ message: "trigger", results: this.lerp_registry.results, result_indices: this.lerp_registry.activelist })
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
