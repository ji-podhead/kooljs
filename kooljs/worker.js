// Copyright (c) 2025 Ji-Podhead and Project Contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:
// 1. All commercial uses of the Software must:
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).
// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import { Worker_Utils } from "kooljs/worker_utils";


var fps = 10.33;
var loop_resolver = null;
var triggers_step,animator

// ----------------------------------------> Render Maps <-- 
const group_results = new Map()
const active_group_indices = new Map()
const matrix_results = new Map()
// ----------------------------------------> CLASS DEFINITIONS <--

class Lerp {
    constructor(results, buffer, callback_map, type, duration, render_interval, delay, smoothstep, lerp_chain_start, loop, group, group_lookup, lerp_callback_ids,animator) {
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
        
        this.buffer = buffer
        this.matrix_results = results.get("matrix_results")
        this.number_results = results.get("number_results")
        this.lerp_callbacks = new Map();

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
                    matrix_results.set(id, this.matrix_results.get(id))
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
            if (this.active_groups.has(this.group(id))) {
                this.active_group_indices.get(this.group(id)).delete(this.group(id))
                if (this.active_group_indices.get(this.group(id)).size == 0) {
                    this.active_groups.delete((this.group(id)))
                    group_results.delete(this.group.get(id))
                }
                else{
                    group_results.get(this.group.get(id)).delete(this.group.get(id))
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
                    matrix_results.delete(id);
                }
                break
            case (2):
                //check_group(id)

                active_index=this.active_numbers.indexOf(id)
                this.active_numbers=Float32Array.from([...this.active_numbers.slice(0,active_index),...this.active_numbers.slice(active_index+1,this.active_numbers.length)])
                
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
        group_results.clear()
        matrix_results.clear()
        // this.active_group_indices.forEach((val, key) => {
        //     this.active_group_indices.set(key, [])
        // })
    }
}
const default_target_step = [0, 1]
var final_step, final_sub_step;
class LerpSequence {
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
        this.buffer = buffer
        this.matrix_sequences = matrix_sequences
        this.progress = progress
        this.lengths = lengths
        this.lerp_registry=animator.lerp_registry
    }
    update_progress(id) {
        if (this.progress[id] == this.lengths[id] - 1) {
            stop_animations([id])
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
class Matrix_Chain {
    constructor(indices, ref_matrix, orientation_step, max_duration, min_duration, delay_invert, max_length,animator) {
        this.indices = indices;
        this.ref_matrix = ref_matrix;
        this.orientation_step = orientation_step
        this.max_duration = max_duration;
        this.min_duration = min_duration;
        this.delay_invert = delay_invert;
        this.max_length = max_length
        this.animator=animator
        indices.forEach((val,i)=>
        {
            this.animator.lerp_registry.active_group_indices.set(i, new Set())

        })
    }
    reorient_matrix_chain(id, target_step, direction) {
        this.indices[id].map((index, i) => {
            const current = this.animator.get_lerp_value(index);
            const ref = this.ref_matrix.get(i * (target_step + this.length) + direction);
            if (ref[1] == current) {
                return console.log("target animation is reachead");
            }
            this.animator.hard_reset(index);
            this.animator.reorient_target({
                index: index,
                step: 0, // this is alway zero, since the matrix itself has a steplength of 2, but the ref matrix lnegth can be bigger
                direction: 1,
                matrix_row: 0,
                verbose: false,
                reference: ref,
            });
            if (this.delay_invert[id] && direction == 0) {
                const target = this.animator.get_delay(this.indices[indices.length] - index);
                this.animator.set_delay(this.indices[this.indices.length] - index, this.animator.get_delay(index));
                this.animator.set_delay(index, target);
            }
            this.animator.reorient_duration_by_progress({
                index: index,
                min_duration: this.min_duration[id],
                max_duration: this.max_duration[id],
            });
            // console.log(`index: ${index} i: ${i}
            //     new_duration ${duration}
            //     current_position: ${current[0]}, ${current[1]} target_position ${ref[0]}, ${ref[1]} `
            // )
        });
    }
    start_matrix_chain(direction, id) {
        this.reorient_matrix_chain({
            id: id,
            direction: direction,
            target_step: this.orientation_step.has(id) ? this.orientation_step.get(id) : default_target_step[direction == 0 ? 1 : 0],
        })
        this.animator.lerp_registry.active_group_list.set(this.id, this.indices.length)
        this.animator.start_animations(this.indices)
    }
    stop(id) {
        this.animator.lerp_registry.active_groups.delete(this.id)
        this.animator.lerp_registry.active_group_indices.get(this.id).clear()
        this.animator.stop_animations(this.indices[id])
    }
}
class Constant {
    constructor(constants,animator) {
        this.matrix = new Map();
        this.number = undefined;
        this.render_triggers = new Map();
        this.render_callbacks = new Map();
        this.animator=animator
        if (constants.get("matrix") != undefined) {
            constants.get("matrix").forEach((val, i) => {
                this.matrix.set(i, new Map());
                val.map((m, i2) => {
                    this.matrix.get(i).set(i2, new Float32Array(m));
                });
            });
        }
        if (constants.get("number") != undefined) {
            this.number = constants.get("number");
        }
        this.render_triggers = constants.get("render_triggers");
        this.render_callbacks = constants.get("render_callbacks");
    }
    update(type, id, value) {
        this.constant_registry[type].set(id, value);
        if (this.render_callbacks.has(id))
            this.render_callbacks.get(id).map((l) => {
                callback_map.get(l.id)(l.args);
            });
        if (this.render_triggers.has(id))
            this.animator.start_animations(this.render_triggers.get(id));
    }
    get(type, index, row) {
        if (row != undefined) {
            this.get_row(index, row);
        } else return this.constant_registry[type].get(index);
    }
    get_row(index, row) {
        return this.constant_registry["matrix"].get(index).get(row);
    }
    get_number(index) {
        return this.constant_registry["number"].get(index);
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
class Animator extends {Worker_Utils} {
    

    constructor(new_fps, lerps, lerpChains, results, buffer, triggers, constants, condi_new, matrix_chains, springs) {
        this.fps = new_fps;
        this.callback_map = new Map();
        this.trigger_registry = new Map();
        this.callback_map = new Map();
        triggers.forEach((trigger, key) => trigger_registry.set(key, trigger));
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
        this.sequence_registry = new LerpSequence(
            new Float32Array(lerpChains.get("buffer")),
            (lerpChains.get("matrix_buffer")),
            new Uint8Array(lerpChains.get("progress")),
            new Uint8Array(lerpChains.get("lengths"))
        )
        this.lerp_registry = new Lerp(
            results,
            buffer,
            callback_map,
            new Uint8Array(lerps.get("type")),
            new Uint8Array(lerps.get("duration")),
            new Uint8Array(lerps.get("render_interval")),
            new Uint8Array(lerps.get("delay")),
            new Uint8Array(lerps.get("smoothstep")),
            new Uint8Array(lerps.get("lerp_chain_start")),
            new Uint8Array(lerps.get("loop")),
            (lerps.get("group")),
            (lerps.get("group_lookup")),
            lerps.get("lerp_callbacks")
        )
        this.matrix_chain_registry = new Matrix_Chain(
            matrix_chains.get("indices"),
            matrix_chains.get("ref_matrix"),
            matrix_chains.get("orientations_step"),
            new Uint8Array(matrix_chains.get("max_duration")),
            new Uint8Array(matrix_chains.get("min_duraiton")),
            new Uint8Array(matrix_chains.get("delay_invert")),
            new Uint8Array(matrix_chains.get("max_length"))
        )
        this.this.constant_registry = new Constant(constants)
    }
     animate_matrix(id, delta_t, target) {
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
    }
     animate_number(id, delta_t, target) {
         
        target[id] = smoothLerp(
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
    }
    async  animate(index, method, target) {
            if (this.lerp_registry.progress[index] <= this.lerp_registry.duration[index]) {
                if (this.lerp_registry.delay_delta[index] < this.lerp_registry.delay[index]) {
                    this.lerp_registry.delay_delta[index] += 1;
                } else {
                    allow_render =
                        this.lerp_registry.progress[index] % this.lerp_registry.render_interval[index];
                    if (allow_render == 0) {
                        delta_t = this.lerp_registry.progress[index] / this.lerp_registry.duration[index];
                        if(method!=undefined)res = method(index, delta_t, target)
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
                            trigger_registry.get(index) != undefined
                                ? trigger_registry.get(index).get(this.sequence_registry.progress[index])
                                : undefined;
                        if (triggers_step != undefined) {
                            targets = triggers_step.get(this.lerp_registry.progress[index] - 1);
                            targets &&
                                targets.map((target) => {
                                    if (target == index) hard_reset(target);
                                    else soft_reset(target);
                                });
                        }
                    }
                }
            } else {
                    this.sequence_registry.update_progress(index)
            }
    }
    async  animateLoop() {
        try {
            loop_resolver = new AbortController();
            loop_resolver.signal.addEventListener("abort", () => {
                clearTimeout(timeoutId);
            });
            while (loop_resolver.signal.aborted == false) {
                startTime = performance.now();
                this.lerp_registry.active_timelines.forEach((id) => animate(id))
                this.lerp_registry.active_numbers.map((id) => animate(id, animate_number, this.lerp_registry.number_results))
                this.lerp_registry.active_matrices.forEach((id) => animate(id, animate_matrix, this.lerp_registry.matrix_results))
                this.lerp_registry.active_groups.forEach((group_id) => {
                    this.lerp_registry.active_group_indices.get(group_id).forEach((id) => animate(id, animate_matrix, this.lerp_registry.matrix_results))
                })
                render();
                if (this.lerp_registry.active_groups.size > 0
                    || this.lerp_registry.active_timelines.size > 0
                    || this.lerp_registry.active_matrices.size > 0
                    || this.lerp_registry.active_numbers.length > 0
                ) {
                    await new Promise((resolve, reject) => {
                        timeoutId = setTimeout(() => {
                            resolve();
                        }, Math.max(0, fps - (performance.now() - startTime)));
                    });
                } else {
                    return stop_loop();
                }
            }
        } catch {
            (err) => {
                stop_loop();
                stop_animations("all");
                return Error("had a error during animation. stoppingloop! " + err);
            };
        }
    }
    async render() {
        if (!self.crossOriginIsolated) {
            buffer = new ArrayBuffer(this.lerp_registry.buffer)
        }
        else {
            buffer = new SharedArrayBuffer(this.lerp_registry.buffer)
        }
        postMessage(
            {
                message: "render",
                number_results: Float32Array.from(this.lerp_registry.active_numbers.map((i)=>this.lerp_registry.number_results[i])),
                active_numbers: this.lerp_registry.active_numbers,
                matrix_results: matrix_results,
                group_results: group_results,
                active_group_indices: active_group_indices,
            },
            [buffer])
    }
    addTrigger (args){super.addTrigger(...args)}
    get_status(args){super.get_status(...args)}
    addTrigger(args){super.addTrigger(...args)}
    removeTrigger(args){super.removeTrigger(...args)}
    get_active_group_indices(args){super.get_active_group_indices(...args)}
    get_time(args){super.get_time(...args)}
    set_time(args){super.set_time(...args)}
    get_step(args){super.get_step(...args)}
    set_step(args){super.set_step(...args)}
    get_sequence_length(args){super.get_sequence_length(...args)}
    set_sequence_start(args){super.set_sequence_start(...args)}
    get_sequence_start(args){super.get_sequence_start(...args)}
    set_sequence_length(args){super.set_sequence_length(...args)}
    is_active(args){super.is_active(...args)}
    get_active(args){super.get_active(...args)}
    start_animations(args){super.start_animations(...args)}
    stop_animations(args){super.stop_animations(...args)}
    setLerp(args){super.setLerp(...args)}
    setMatrix(args){super.setMatrix(...args)}
    get_lerp_value(args){super.get_lerp_value(...args)}
    soft_reset(args){super.soft_reset(...args)}
    hard_reset(args){super.hard_reset(...args)}
    get_duration(args){super.get_duration(...args)}
    set_duration(args){super.set_duration(...args)}
    change_framerate(args){super.change_framerate(...args)}
    get_constant(args){super.get_constant(...args)}
    get_constant_number(args){super.get_constant_number(...args)}
    get_constant_row(args){super.get_constant_row(...args)}
    render_constant(args){super.render_constant(...args)}
    update_constant(args){super.update_constant(...args)}
    set_delay(args){super.set_delay(...args)}
    get_delay(args){super.get_delay(...args)}
    get_delay_delta(args){super.get_delay_delta(...args)}
    set_delay_delta(args){super.set_delay_delta(...args)}
    lambda_call(args){super.lambda_call(...args)}
    get_step_lerp_target_value(args){super.get_step_lerp_target_value(...args)}
    reorient_duration(args){super.reorient_duration(...args)}
    reorient_duration_by_distance(args){super.reorient_duration_by_distance(...args)}
    reverse(args){super.reverse(...args)}
    reorient_target(args){super.reorient_target(...args)}
    reorient_duration_by_progress(args){super.reorient_duration_by_progress(...args)}
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
            update(event.data.type, event.data.data);
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
            animator.matrix_chain_registry.start_matrix_chain(event.data.indices);
            break;
        case "stop_groups":
            animator.stop_animations(event.data.indices);
            break;
        case "reset_animations":
            animator.reset_animations(event.data.indices);
            break;
        case "addTrigger":
            animator.addTrigger(
                event.data.id,
                event.data.target,
                event.data.step,
                event.data.time
            );
            break;
        case "removeTrigger":
            animator.removeTrigger(
                event.data.id,
                event.data.target,
                event.data.step,
                event.data.time
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
