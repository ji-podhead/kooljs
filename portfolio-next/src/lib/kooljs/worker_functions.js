// Copyright (c) 2025 Ji-Podhead and Project Contributors
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:
// 1. All commercial uses of the Software must:
//    a) Include visible attribution to all contributors (listed in CONTRIBUTORS.md).
//    b) Provide a direct link to the original project repository (https://github.com/ji-podhead/kooljs).
// 2. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import { Worker_Utils } from "./worker_utils.js";

const get_status = Worker_Utils.prototype.get_status
const set_group_orientation = Worker_Utils.prototype.set_group_orientation
const addTrigger = Worker_Utils.prototype.addTrigger
const removeTrigger = Worker_Utils.prototype.removeTrigger
const get_active_group_indices = Worker_Utils.prototype.get_active_group_indices
const get_time = Worker_Utils.prototype.get_time
const set_time = Worker_Utils.prototype.set_time
const get_step = Worker_Utils.prototype.get_step
const set_step = Worker_Utils.prototype.set_step
const get_sequence_length = Worker_Utils.prototype.get_sequence_length
const set_sequence_start = Worker_Utils.prototype.set_sequence_start
const get_sequence_start = Worker_Utils.prototype.get_sequence_start
const set_sequence_length = Worker_Utils.prototype.set_sequence_length
const is_active = Worker_Utils.prototype.is_active
const get_active = Worker_Utils.prototype.get_active
const start_animations = Worker_Utils.prototype.start_animations
const stop_animations = Worker_Utils.prototype.stop_animations
const setLerp = Worker_Utils.prototype.setLerp
const setMatrix = Worker_Utils.prototype.setMatrix
const get_lerp_value = Worker_Utils.prototype.get_lerp_value
const soft_reset = Worker_Utils.prototype.soft_reset
const hard_reset = Worker_Utils.prototype.hard_reset
const get_duration = Worker_Utils.prototype.get_duration
const set_duration = Worker_Utils.prototype.set_duration
const change_framerate = Worker_Utils.prototype.change_framerate
const get_constant = Worker_Utils.prototype.get_constant
const get_constant_number = Worker_Utils.prototype.get_constant_number
const get_constant_row = Worker_Utils.prototype.get_constant_row
const render_constant = Worker_Utils.prototype.render_constant
const update_constant = Worker_Utils.prototype.update_constant
const set_delay = Worker_Utils.prototype.set_delay
const get_delay = Worker_Utils.prototype.get_delay
const get_delay_delta = Worker_Utils.prototype.get_delay_delta
const set_delay_delta = Worker_Utils.prototype.set_delay_delta
const lambda_call = Worker_Utils.prototype.lambda_call
const get_step_lerp_target_value = Worker_Utils.prototype.get_step_lerp_target_value
const reorient_duration = Worker_Utils.prototype.reorient_duration
const reorient_duration_by_distance = Worker_Utils.prototype.reorient_duration_by_distance
const reverse = Worker_Utils.prototype.reverse
const reorient_target = Worker_Utils.prototype.reorient_target
const reorient_duration_by_progress = Worker_Utils.prototype.reorient_duration_by_progress
const set_group_values = Worker_Utils.prototype.set_group_values
const get_group_values = Worker_Utils.prototype.get_group_values
const start_group = Worker_Utils.prototype.start_group
const stop_group = Worker_Utils.prototype.stop_group
const reverse_group_delays = Worker_Utils.prototype.reverse_group_delays
const reset_group = Worker_Utils.prototype.reset_group
const lerp = Worker_Utils.prototype.lerp
const normalizeDistance = Worker_Utils.prototype.normalizeDistance
const clamp = Worker_Utils.prototype.clamp
export {
    lerp,
    normalizeDistance,
    clamp,
    reset_group,
    reverse_group_delays,
    start_group,
    stop_group,
    get_group_values,
    set_group_values,
    get_status,
    addTrigger,
    removeTrigger,
    get_active_group_indices,
    get_time,
    set_time,
    get_step,
    set_step,
    get_sequence_length,
    set_sequence_start,
    get_sequence_start,
    set_sequence_length,
    is_active,
    get_active,
    start_animations,
    stop_animations,
    setLerp,
    setMatrix,
    get_lerp_value,
    soft_reset,
    hard_reset,
    get_duration,
    set_duration,
    change_framerate,
    get_constant,
    get_constant_number,
    get_constant_row,
    render_constant,
    update_constant,
    set_delay,
    get_delay,
    get_delay_delta,
    set_delay_delta,
    lambda_call,
    get_step_lerp_target_value,
    reorient_duration,
    reorient_duration_by_distance,
    reverse,
    reorient_target,
    set_group_orientation,
    reorient_duration_by_progress,
}