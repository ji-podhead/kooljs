// Copyright (c) 2025 Ji-Podhead and Project Contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:
// 1. All commercial uses of the Software must:
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).
// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

var type,trigger,newtriggers
var group,distance, duration;
class Worker_Utils{


/**
 * Adds a trigger to the trigger registry.
 * If the trigger does not exist at the given time and step in the given animation, it is created.
 * If the trigger does exist, the target is added to the existing trigger.
 * @param {number} id - The id of the animation to add the trigger to.
 * @param {number} target - The target of the trigger.
 * @param {number} step - The step of the trigger.
 * @param {number} time - The time of the trigger.
 */
 addTrigger({id, target, step, time}) {
    if (this.trigger_registry.get(id) == undefined) {
        this.trigger_registry.set(id, new Map());
    }
    if (this.trigger_registry.get(id).get(step) == undefined) {
        this.trigger_registry.get(id).set(step, new Map());
        this.trigger_registry
            .get(id)
            .get(step)
            .set(time, new Uint8Array([target]));
    } else if (this.trigger_registry.get(id).get(step).get(time) == undefined) {
        this.trigger_registry
            .get(id)
            .get(step)
            .set(time, new Uint8Array([target]));
    } else {
        trigger = this.trigger_registry.get(id).get(step).get(time);
        if (trigger.includes(target) == false) {
             newtriggers = new Array(trigger);
            newtriggers.push(target);
            newtriggers = new Uint8Array(newtriggers);
            this.trigger_registry.get(id).get(step).set(time, newtriggers);
        } else {
            console.warn(
                `trigger already exists: target ${target} in timeframe ${time} in step ${step} on animation with id ${id}`
            );
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
 removeTrigger({id, target, step, time}) {
    trigger = this.trigger_registry.get(id).get(step)
    if (trigger != undefined) {
        if (trigger.get(time) != undefined) {
            trigger = trigger.get(time);
        } else {
            return console.warn(
                "the slected timeframe in the  step does not include the target"
            );
        }
    } else {
        return console.warn("the trigger registr has does not include the step");
    }
    const targetId = trigger.indexOf(target);
    if (targetId != undefined && trigger.length > 1) {
        const newtriggers = new Uint8Array(new Array(trigger).splice(targetId, 1));
        console.log(
            `removed trigger target ${target} in timeframe ${time} in step ${step} from from id ${id}`
        );
        this.trigger_registry.get(id).get(step).set(time, newtriggers);
    } else {
        this.trigger_registry.get(id).get(step).set(time, undefined);
    }
}
 update(type, values) {
    values.map((x) => {
        if (this.sequence_registry.lengths[x.id] != x.values.length - 1) {
            if (this.lerp_registry.loop[x.id] == 1) {
                this.removeTrigger(
                   {id:x.id,
                    target:x.id,
                    step:this.sequence_registry.lengths[x.id] - 1,
                    time:this.lerp_registry.duration[x.id]}
                );
                this.addTrigger(
                    {
                    id:x.id,
                    target:x.id,
                    step:x.values.length - 2,
                    time:this.lerp_registry.duration[x.id]}
                );
            }
            this.sequence_registry.lengths[x.id] = x.values.length - 1;
        }
        if (type == 2) {
            x.values.map((val, i) => {
                this.sequence_registry.buffer[this.lerp_registry.lerp_chain_start[x.id] + i] =
                    val;
            });
        } else if (type == 3) {
            x.values.map((val, i) => {
                this.sequence_registry.matrix_sequences.get(x.id).set(i, val);
            });
        }
        this.sequence_registry.reset(x.id);
    });
}

lambda_call(id, args) {
    try {
        const callbackObject = this.callback_map.get(id);
        if (callbackObject && typeof callbackObject.callback === 'function') {
            const final_args = [];
            if (callbackObject.args) {
                callbackObject.args.forEach(argName => {
                    if (args && Object.prototype.hasOwnProperty.call(args, argName)) {
                        final_args.push(args[argName]);
                    } else {
                        final_args.push(undefined);
                    }
                });
            }
            return callbackObject.callback.apply(this, final_args);
        }
    } catch (err) {
        console.error(`Error in lambda call for id ${id}:`, err);
        console.error(this.callback_map.get(id));
    }
}
// ----------------------------------------> EVENTS <--


 start_loop() {
    if (this.loop_resolver == null) {
        this.animateLoop();
    }
}
stop_loop() {
    if (this.loop_resolver != null) {
        this.loop_resolver.abort();
        this.loop_resolver = null;
    }
}

  start_animations(indices) {
    indices.map((id) => {
        this.lerp_registry.delete_group_member(id)
        this.sequence_registry.soft_reset(id);
    });
    this.start_loop();
}


  stop_animations(indices) {
    if (indices === "all") {
        this.lerp_registry.stop_all();
        this.stop_loop();
    }
    else {
        indices.map((id) => {
            this.lerp_registry.deactivate(id);
        });

    if (this.lerp_registry.active_numbers.length == 0&&
        this.lerp_registry.active_timelines.size == 0&&
        this.lerp_registry.active_matrices.size == 0&&
        this.lerp_registry.active_groups.size == 0
    ) {
        this.stop_loop();
    }
}
}


    reset_animations(indices) {
    if (indices == "all") {
        if(this.sequence_registry!=undefined){this.sequence_registry.stop_loop()}
        else {this.stop_loop()}
        indices = this.lerp_registry.type.map((t,i)=>{return i});
    }
    var stopped=0
    const results={
        number_results: new Map(),
        matrix_results: new Map(),
    }
    indices.map((x) => {
        this.sequence_registry.reset(x);
        this.lerp_registry.activate(x);

            switch (this.lerp_registry.type[x]) {
                case 2:
                    results.number_results.set(x,this.sequence_registry.buffer[this.lerp_registry.lerp_chain_start[x]])
                    stopped+=1
                    break;
                case 3:
                        results.matrix_results.set(
                            x,
                            this.sequence_registry.matrix_sequences.get(x).get(0)
                        );
                        stopped+=1
                    break;
                default:
                    break;
            }
    });
    if ( this.loop_resolver == null&&stopped> 0)
        postMessage({
            message: "render",
            number_results: results.number_results,
            matrix_results: results.matrix_results,
        });
}

  change_framerate(fps_new) {
    this.fps = fps_new;
}

  render_constant(id, type) {
    postMessage({
        message: "render_constant",
        id: id,
        type: type,
        value: get_constant(id, type),
    });
}

// ----------------------------------------> User API <--

 setLerp(index, step, value) {
    this.sequence_registry.buffer[this.lerp_registry.lerp_chain_start[index] + step] =
        value;
}

 setMatrix(index, step, value) {
    try{
    value.map((x, i) => {
        this.sequence_registry.matrix_sequences.get(index).get(step)[i] = x;
    });
    }
    catch(err){
        console.error(` error in setMatrix:
            ${err}`
        )
    }
}

 update_constant(id, type, value) {
    this.constant_registry.update(type, id, value);
}

 get_constant(id, type) {
    return this.constant_registry.get(type, id);
}

 get_time(id) {
    return this.lerp_registry.progress[id];
}


 is_active(id) {
    if(!this.lerp_registry.active_groups.has(this.lerp_registry.group.has(id)) || !this.lerp_registry.active_group_indices.get(this.lerp_registry.group.get(id)).has(id)){
    type=this.lerp_registry.type[id]
    switch(type){
        case(2 | 3):
        return this.lerp_registry.active_numbers.includes(id);
        case(3):
        return this.lerp_registry.active_matrices.has(id)
    }
} else {return this.lerp_registry.active_group_indices.get(this.lerp_registry.group.get(id)).has(id)}

}

 get_step(id) {
    return this.sequence_registry.progress(id);
}


 get_lerp_value(id) {
    type=this.lerp_registry.type[id]
    group=this.lerp_registry.group.get(id)
    if(!group || !this.lerp_registry.active_groups.has(id))
    switch(type){
        case(2):  return this.lerp_registry.number_results.get(id);
        case(3): return this.lerp_registry.matrix_results.get(id)
    }
    else{
        return this.lerp_registry.active_group_indices.get(group).has(id)
    }

}

 soft_reset(id) {
    this.sequence_registry.soft_reset(id);
}

 hard_reset(id) {
    this.sequence_registry.reset(id);
}

 set_time(id, val) {
    this.lerp_registry.progress = val;
}


 set_step(id, val) {
    this.sequence_registry.progress[id] =
        val > this.sequence_registry.lengths[id] ? this.sequence_registry.lengths[id] : val;
}

 set_sequence_start(id, val) {
    this.lerp_registry.lerp_chain_start[id] = val;
}
 get_sequence_start(id) {
    return this.lerp_registry.lerp_chain_start[id];
}
 set_sequence_length(id, val) {
    this.sequence_registry.lengths[id] = val;
}

 get_sequence_length(id) {
    return this.sequence_registry.lengths[id];
}

 get_step_lerp_target_value(id, step) {
    if (this.lerp_registry.type[id] == 2)
        return this.sequence_registry.buffer[this.lerp_registry.lerp_chain_start[id] + step];
    else if (this.lerp_registry.type[id] == 3)
        return this.sequence_registry.matrix_sequences.get(id).get(step);
}


 get_duration(id) {
    return this.lerp_registry.duration[id];
}

 set_duration(id, val) {
    this.lerp_registry.duration[id] = val;
}


 get_delay(id) {
    return this.lerp_registry.delay[id];
}

 set_delay(id, val) {
    this.lerp_registry.delay[id] = val;
}


 get_delay_delta(id) {
    return this.lerp_registry.delay_delta[id];
}

 set_delay_delta(id, val) {
    this.lerp_registry.delay_delta[id] = val;
}


 get_constant_row(id, row) {
    return this.constant_registry.get_row(id, row);
}


 get_constant_number(id) {
    return this.constant_registry.get_number(id);
}

 get_active_group_indices(group){
    return this.lerp_registry.active_groups.get(group)
}
 get_active(type) {
    switch(type){
        case(2):
            return this.lerp_registry.active_numbers
        case(3):return this.lerp_registry.active_matrices;
        case(4): return this.lerp_registry.active_timelines
}
}

 get_status() {
    return this.loop_resolver != null;
}

 reorient_target({
    index,
    step=0,
    direction=1,
    reference,
    matrix_row = 0,
    start_reference,
    verbose = false,

}) {
    verbose && console.log("replacing indices " + index);
    if (this.lerp_registry.type[index] != 2) {
        if(start_reference){
            this.setMatrix(index, step, start_reference);
        }
        else{
            this.setMatrix(index, step, this.get_lerp_value(index));
        }
        this.setMatrix(index, step + direction, reference, matrix_row);
    } else {
        this.setLerp(index, step, reference);
        this.setLerp(index, step + direction, matrix_row);
    }
}

 reorient_duration({
    index,
    min_duration,
    max_duration,
    verbose = false,
}) {
    if (min_duration != undefined) {
        this.soft_reset(index);
        const time = this.is_active(index) ? this.get_time(index) : 0;
        const duration =
            time < min_duration ? Math.floor(max_duration - time) : max_duration;
        this.set_duration(index, duration);
        verbose &&
            console.log("new start_duration for " + index + " is " + duration);
    }
}

 lerp(value, target, min, max, threshold) {
    const t = (value - min) / (max - min);
    const result = target * t + (1 - t) * threshold;
    return result;
}

 normalizeDistance(target, current, max) {
    const distance = Math.abs(current - target);
    return distance / Math.abs(max - target);
}

 clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

 reorient_duration_by_distance({
    index,
    target,
    max_distance,
    min_duration,
    max_duration,
    mode = "max_distance",
    reorientate_steps=false
}) {
    const current = this.get_lerp_value(index);

    if (this.lerp_registry.type[index] != 2) {
        var dif
        switch (mode) {
            case "max_distance":
                const distances = [];
                dif=[]
                for (let i = 0; i < target.length; i++) {
                    distances.push(Math.abs(target[i] - current[i]));
                    dif.push(target[i] - current[i])
                }
                distance = Math.max(...distances);

                break;
            case "manhattan_distance":
                distance = 0;
                dif=[]
                for (let i = 0; i < target.length; i++) {
                    distance += Math.abs(target[i] - current[i]);
                    dif.push(target[i] - current[i])
                }
                break;
            case "cosine_similarity":
                const dotProduct = 0;
                const magnitudeTarget = 0;
                const magnitudeCurrent = 0;
                dif=[]
                for (let i = 0; i < target.length; i++) {
                    dotProduct += target[i] * current[i];
                    dif.push(target[i] - current[i])
                    magnitudeTarget += target[i] ** 2;
                    magnitudeCurrent += current[i] ** 2;
                }
                magnitudeTarget = Math.sqrt(magnitudeTarget);
                magnitudeCurrent = Math.sqrt(magnitudeCurrent);
                distance = 1 - dotProduct / (magnitudeTarget * magnitudeCurrent);
                break;
            case "vector_magnitude":
                distance = 0;
                dif=[]
                for (let i = 0; i < target.length; i++) {
                    distance += (target[i] - current[i]) ** 2;
                    dif.push((target[i] - current[i]))
                }
                distance = Math.sqrt(distance);
                break;
            default:
                throw new Error(`Unbekannter Modus: ${mode}`);
        }
    } else if (this.lerp_registry.type[index] == 2)
        distance = Math.abs(target - max_distance);
    duration =
        min_duration + (distance / max_distance) * (max_duration - min_duration);
    this.soft_reset(index);
    this.set_duration(index, duration);
    return {
        duration:duration,
        diffrences:dif
    };
}
 reorient_duration_by_progress({ index, min_duration, max_duration,soft_reset=true }) {
    const progress = this.get_time(index) / max_duration;

    duration = min_duration + progress * (max_duration - min_duration);
    if(soft_reset){
        this.soft_reset(index);
    }
    else{

    }
    this.set_duration(index, duration);
    return duration;
}

 reverse(id) {
    if (type(id) != "number") {
        for (
            let i = this.lerp_registry.lerp_chain_start[id];
            i <= this.lerp_registry.lerp_chain_start[id] + this.sequence_registry.lengths[id];
            i++
        ) {
            this.sequence_registry.buffer[this.sequence_registry.lengths[id] - i] =
                this.sequence_registry.buffer[i];
        }
    } else {
        const newMap = new Map();
        this.sequence_registry.matrix_sequences.get(id).forEach((val, i) => {
            newMap.set(this.sequence_registry.lengths[id] - i, val);
        });
        this.sequence_registry.matrix_sequences.set(id, newMap);
    }
}
reverse_group_delays(id){
    this.matrix_chain_registry.indices.get(id).map((val,i)=>{
        const target_index=this.matrix_chain_registry.indices.get(id).length-i
        const target=this.matrix_chain_registry.indices.get(id)[target_index-1]
        const target_delay=this.get_delay(target)
        this.set_delay(target,this.get_delay(val))
        this.set_delay(val,target_delay)
    })
}
set_group_orientation(id,orientation){
    this.matrix_chain_registry.orientation_step.set(id,orientation)
}

start_group(directions, indices,reorient) {
    indices.map((indices2,i)=>{
        if(!this.lerp_registry.active_groups.has(i)){
        this.matrix_chain_registry.start_matrix_chain(directions[i],indices2,reorient)
        }
    })
    this.start_loop();
}


reset_group(id,start,target){
    this.matrix_chain_registry.reset_group(id,start,target)

}
stop_group(indices) {
    if(indices=="all"){

        indices=[...this.lerp_registry.active_groups]
    }
    indices.map((id,i)=>{
    if(this.lerp_registry.active_groups.has(id)){
        this.lerp_registry.active_groups.delete(id)
        this.lerp_registry.active_group_indices.get(id).clear()
        this.matrix_chain_registry.progress[id]=0
        this.stop_animations(this.matrix_chain_registry.indices.get(id))
    }

    })
}
get_group_values(id){
    return{
        active:this.lerp_registry.active_groups.has(id),
        progress:this.matrix_chain_registry.progress[id],
        orientation:this.matrix_chain_registry.orientation_step.get(id),
        active_indices:this.lerp_registry.active_group_indices.get(id),
        loop:this.matrix_chain_registry.group_loop[id]
    }
}
set_group_values(id,field,value,step){
    switch(field){
        case "max_duration":
            this.matrix_chain_registry.max_duration[id]=value
            break;
        case "min_duration":
            this.matrix_chain_registry.min_duration[id]=value
            break;
        case "progress":
            this.matrix_chain_registry.progress[id]=value
            break;
        case "sequence_length":
            this.matrix_chain_registry.sequence_length[id]=value
            break;
        case "group_loop":
            this.matrix_chain_registry.group_loop[id]=value
        case "orientation_step":
            this.matrix_chain_registry.orientation_step.set(id,value)
            break;
        case "ref_matrix":
            if(this.matrix_chain_registry.uni_size[id]==1){
                this.matrix_chain_registry.ref_matrix.get(id).get(step).map((x,i)=>{
                    this.matrix_chain_registry.ref_matrix.get(id).get(step)[i]=value[i]
                })
                }
            else{
                const size=this.matrix_chain_registry.max_length[id]
                this.matrix_chain_registry.ref_matrix.get(id).set(id*size+step).map((x,i)=>x=   value[i])
            }

            break;
    }
}
}
export{
Worker_Utils
}