
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
function current_step(id){return lerpChain_registry.progress(id)}
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
function set_delay(id,val){lerp_registry.delay[id]=val}
function get_delay_delta(id){return lerp_registry.delay_delta[id]}
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
function get_constant_number(id){return constant_registry.get_number(id)}
/**
 * Retrieves an array of all active animation identifiers.
 * @returns {Array<number>} - An array of active animation identifiers.
 */
function get_active(id){return lerp_registry.activelis}
/**
 * Retrieves a boolean indicating whether the animation loop is currently running.
 * @returns {boolean} - true if the animation loop is currently running, false otherwise.
 */
function get_status(){return loop_resolver!=null}
