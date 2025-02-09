/**
 * Retrieves a boolean indicating whether the animation loop is currently running.
 * @returns {boolean} - true if the animation loop is currently running, false otherwise.
 */
function get_status(){
    return `get_status()`
}
/**
 * Adds a trigger to the animation registry. If the trigger for the given
 * id, step, and time doesn't exist, it creates a new one. Otherwise, it
 * adds the target to the existing trigger.
 *
 * @param {number} id - The identifier of the animation.
 * @param {number} target - The target animation identifier.
 * @param {number} step - The step in the animation sequence.
 * @param {number} time - The time frame within the step for the trigger.
 */

function addTrigger(id,target,step,time){
    return `addTrigger(${id},${target},${step},${time})`
}
/**
 * Removes a trigger from the trigger registry for a given animation.
 * 
 * @param {number} id - The id of the animation from which the trigger should be removed.
 * @param {number} target - The target of the trigger to be removed.
 * @param {number} step - The step at which the trigger is set.
 * @param {number} time - The timeframe within the step at which the trigger is set.
 * 
 * If the trigger exists, it is removed from the registry. If the trigger does not exist,
 * a warning is logged to the console. If removing the trigger leaves no other triggers at 
 * the given step and time, the entry is set to undefined.
 */
function removeTrigger(id,target,step,time){
    return `removeTrigger(${id},${target},${step},${time})`
}
/**
 * Gets the current progress of the animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The current progress value of the animation.
 */
function get_time(id){
    return `get_time(${id})`
}
/**
 * Sets the current progress of an animation and updates the delta t value accordingly.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The new progress value for the animation.
 */
function set_delta_t(id,val){
    return `set_delta_t(${id},${val})`
}
/**
 * Gets the current step of the animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The current step value of the animation.
 */
function get_step(id){
    return `get_step(${id})`
}
/**
 * Sets the current step of an animation.
 * If the provided step value exceeds the maximum length of the animation, it will be set to the maximum length.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired step value for the animation.
 */
function set_step(id,val){
    return `set_step(${id},${val})`
}
/**
 * Checks if an animation is currently running.
 * @param {number} id - The identifier for the animation.
 * @returns {boolean} - true if the animation is currently running, false otherwise.
 */
function is_active(id){
    return `is_active(${id})`
}
/**
 * Retrieves an array of all active animation identifiers.
 * @returns {Array<number>} - An array of active animation identifiers.
 */
function get_active(){
    return `get_active()`
}
/**
 * Starts all given animations.
 * @param {list} indices - the index of the animation
 */
function start_animations(indices){
    return `start_animations(${indices})`
}
/**
 * Stops all given animations.
 * @param {list} indices - the index of the animation
 */
function stop_animations(indices){
    return `stop_animations(${indices})`
}
/**
 * Sets a Lerp target value for a certain step of an animation.
 * @param {number} index - the index of the animation
 * @param {number} step - the step for which the value should be set
 * @param {number} value - the value to set
 */
function setLerp(index,step,value){
    return `setLerp(${index},${step},${value})`
}
/**
 * Sets the matrix lerp target value for a certain step of an animation.
 * @param {number} index - the index of the animation
 * @param {number} step - the step for which the value should be set
 * @param {number[]} value - the matrix to set. The matrix is a 1 dimensional array of floats with a length that is a multiple of 4 (e.g. [r1, g1, b1, a1, r2, g2, b2, a2])
 */
function setMatrix(index,step,value){
    return `setMatrix(${index},${step},${value})`
}
/**
 * Gets the lerp result value of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The lerp result value of the animation.
 */
function get_lerp_value(id){
    return `get_lerp_value(${id})`
}
/**
 * Starts and resets an animation if its finished, or not playing.
 * @param {number} id - The identifier for the animation.
 */
function soft_reset(id){
    return `soft_reset(${id})`
}
/**
 * Starts and resets an animation.
 * @param {number} id - The identifier for the animation.
 */
function hard_reset(id){
    return `hard_reset(${id})`
}
/**
 * Sets the duration of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired duration value for the animation.
 */
function get_duration(id){
    return `get_duration(${id})`
}
/**
 * Gets the duration of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The duration of the animation.
 */
function set_duration(id){
    return `set_duration(${id})`
}
/**
 * Sets the sequence length of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired sequence length for the animation.
 */
function set_sequence_length(id,val){
    return `set_sequence_length(${id},${val})`
}
function change_framerate(fps){
    return `change_framerate(${fps})`
}
/**
 * Gets a constant value.
 * @param {number} id - the id of the constant
 * @param {string} type - the type of the constant (number or matrix)
 * @returns {number | number[]} value - the value of the constant
 */
function get_constant(id,type){
    return `get_constant(${id},${type})`
}
/**
 * Retrieves a constant number value by its identifier.
 * @param {number} id - The identifier for the constant number.
 * @returns {number} - The constant number value associated with the given identifier.
 */
function get_constant_number(id){
    return `get_constant_number(${id})`
}
/**
 * Retrieves a specific row from a matrix constant.
 * @param {number} id - The identifier for the matrix constant.
 * @param {number} row - The index of the row to retrieve from the matrix constant.
 * @returns {Array} - The specified row from the matrix constant.
 */
function get_constant_row(id,row){
    return `get_constant_row(${id},${row})`
}
/**
 * Sends a message to the main thread to render a constant with the given id and type.
 * @param {number} id - The id of the constant that should be rendered.
 * @param {number} type - The type of the constant that should be rendered (1 for number, 2 for color, 3 for vector).
 */
function render_constant(id,type){
    return `render_constant(${id},${type})`
}
/**
 * Updates a constant value.
 * @param {number} id - the id of the constant to update
 * @param {string} type - the type of the constant (number or matrix)
 * @param {number | number[]} value - the new value of the constant
 */
function update_constant(id,type,value){
    return `update_constant(${id},${type},${value})`
}
/**
 * Sets the delay of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired delay value for the animation.
 */
function set_delay(id,val){
    return `set_delay(${id},${val})`
}
/**
 * Retrieves the delay of an animation.
 * @param {number} id - The identifier for the animation.
 * @returns {number} - The delay value of the animation.
 */

function get_delay(id){
    return `get_delay(${id})`
}
/**
 * gets the current delay progress value for an animation.
 * @param {number} id - The identifier for the animation.
 */
function get_delay_delta(id){
    return `get_delay_delta(${id})`
}
/**
 * Sets the sequence length of an animation.
 * @param {number} id - The identifier for the animation.
 * @param {number} val - The desired sequence length for the animation.
 */
function set_delay_delta(id,val){
    return `set_delay_delta(${id},${val})`
}
/**
 * Calls a lambda function with the given id and arguments.
 * @param {number} id - The id of the lambda function that should be called.
 * @param {*} args - The arguments to pass to the lambda function.
 */
function lambda_call(id,args){
    return `lambda_call(${id},${args})`
}
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
    lambda_call
}