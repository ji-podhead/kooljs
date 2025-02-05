(()=>{"use strict";var __webpack_require__={d:(e,r)=>{for(var t in r)__webpack_require__.o(r,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},o:(e,r)=>Object.prototype.hasOwnProperty.call(e,r)},__webpack_exports__={},finished=[],fps=10.33,signal,loop_resolver=null,triggers_step,status=!0,final_step,final_sub_step;async function sleep(e){return new Promise((r=>setTimeout(r,e)))}class Lerp{constructor(){this.type=void 0,this.delta_t=void 0,this.duration=void 0,this.render_interval=void 0,this.delay_delta=void 0,this.delay=void 0,this.progress=void 0,this.smoothstep=void 0,this.lerp_chain_start=void 0,this.loop=void 0,this.activelist=[],this.results=new Map}activate(e){return 0==this.activelist.includes(e)&&(this.activelist.push(e),!0)}get(e){return this.results.get(e)}}class LerpChain{constructor(){this.buffer=void 0,this.matrixChains=void 0,this.progress=void 0,this.lengths=void 0}update_progress(e){return this.progress[e]==this.lengths[e]-1||(this.reset_and_update(e),!1)}reset_and_update(e){lerp_registry.delay_delta[e]=0,lerp_registry.progress[e]=0,this.progress[e]+=1}reset(e){2==lerp_registry.type[e]?lerp_registry.results.set(e,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[e]]):lerp_registry.results.set(e,lerpChain_registry.matrixChains.get(e).get(0)),lerp_registry.delay_delta[e]=0,lerp_registry.progress[e]=0,this.progress[e]=0}soft_reset(e){final_step=this.progress[e]==this.lengths[e]-1,final_sub_step=lerp_registry.progress[e]>=lerp_registry.duration[e],lerp_registry.activate(e),final_step&&final_sub_step?this.reset(e):final_sub_step&&this.reset_and_update(e)}}class Callback{constructor(){this.callback=new Map,this.condition=new Map}}class Constant{constructor(e,r){this.matrix=new Map,this.number=void 0}update(e,r,t){constant_registry[e].set(r,t)}get(e,r,t){if(void 0==t)return constant_registry[e].get(r);this.get_row(r,t)}get_row(e,r){return constant_registry.matrix.get(e).get(r)}get_number(e){return constant_registry.number.get(e)}}const lerp_registry=new Lerp,constant_registry=new Constant,callback_registry=new Callback,lerpChain_registry=new LerpChain,lambda_registry=new Callback,trigger_registry=new Map;var t,targets,allow_render,args,startTime;function smoothLerp(e,r,s,i){return r*(t=smoothstep(s))+e*(1-t)}function smoothstep(e){return e*e*(3-2*e)}async function animate(){return finished=[],lerp_registry.activelist.map(((e,r)=>{if(lerp_registry.progress[e]<=lerp_registry.duration[e])if(lerp_registry.delay_delta[e]<lerp_registry.delay[e])lerp_registry.delay_delta[e]+=1;else{if(0==(allow_render=lerp_registry.progress[e]%lerp_registry.render_interval[e])){switch(lerp_registry.delta_t[e]=lerp_registry.progress[e]/lerp_registry.duration[e],lerp_registry.type[e]){case 2:lerp_registry.results.set(e,smoothLerp(lerpChain_registry.buffer[lerp_registry.lerp_chain_start[e]+lerpChain_registry.progress[e]],lerpChain_registry.buffer[lerp_registry.lerp_chain_start[e]+lerpChain_registry.progress[e]+1],lerp_registry.delta_t[e],lerp_registry.smoothstep[e]));break;case 3:for(let r=0;r<lerpChain_registry.matrixChains.get(e).get(lerpChain_registry.progress[e]).length;r++)lerp_registry.results.get(e)[r]=smoothLerp(lerpChain_registry.matrixChains.get(e).get(lerpChain_registry.progress[e])[r],lerpChain_registry.matrixChains.get(e).get(lerpChain_registry.progress[e]+1)[r],lerp_registry.delta_t[e],lerp_registry.smoothstep[e]);break;default:return console.error("wrong type"+String(e))}args={id:e,value:lerp_registry.results.get(e),step:lerpChain_registry.progress[e],time:lerp_registry.progress[e],step:lerpChain_registry.progress[e]},callback_registry.condition.has(e)&&(callback_registry.condition.get(e)||1==callback_registry.condition.get(e)(args))&&callback_registry.callback.get(e)(args)}lerp_registry.progress[e]+=1,0==allow_render&&void 0!=(triggers_step=void 0!=trigger_registry.get(e)?trigger_registry.get(e).get(lerpChain_registry.progress[e]):void 0)&&(targets=triggers_step.get(lerp_registry.progress[e]-1))&&targets.map((e=>{lerpChain_registry.soft_reset(e)}))}else void 0!=lerp_registry.lerp_chain_start[e]&&1==lerpChain_registry.update_progress(e)&&finished.push(e)})),finished}function animateLoop(){1==status?(startTime=performance.now(),finished=[],lerp_registry.activelist.length>0&&animate().then((e=>{render(),e.length>0&&(lerp_registry.activelist=lerp_registry.activelist.filter((r=>!e.includes(r))),0==lerp_registry.activelist.length&&(loop_resolver=null)),sleep(Math.max(0,fps-(performance.now()-startTime))).then((()=>{1==status?animateLoop():(loop_resolver("stopping"),loop_resolver=null,lerp_registry.activelist=[])}))}))):null!=loop_resolver&&(loop_resolver("stopping"),loop_resolver=null)}function start_loop(){status=!0,null==loop_resolver&&new Promise(((e,r)=>{loop_resolver=r,animateLoop(),e()})).catch((e=>{loop_resolver=null}))}async function stop_loop(){status=!1,null!=loop_resolver&&loop_resolver("stopping")}function start_animations(e){e.map((e=>{lerpChain_registry.soft_reset(e)})),start_loop()}function stop_animations(e){"all"===e?(lerp_registry.activelist=[],stop_loop()):e.map((e=>{lerp_registry.activelist.includes(e)&&(lerp_registry.activelist=lerp_registry.activelist.filter((r=>r!=e)))})),0==lerp_registry.activelist.length&&stop_loop()}async function reset_animations(e){"all"==e&&(stop_loop(),e=lerp_registry.activelist);const r=[];e.map((e=>{if(lerpChain_registry.reset(e),lerp_registry.activate(e),0==lerp_registry.activelist.includes(e)||null==loop_resolver)switch(r.push(e),lerp_registry.type[e]){case 2:lerp_registry.results.set(e,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[e]]);break;case 3:lerp_registry.results.set(e,lerpChain_registry.matrixChains.get(e).get(0))}})),r.length>0&&postMessage({message:"render",results:lerp_registry.results,result_indices:e})}function change_framerate(e){fps=e}const integers=["loop","delay","type","progress","duration","render_interval","lerp_chain_start","activelist"];function init(lerps,lerpChains,matrixChains,triggers,constants,condi_new,lambdas,springs){triggers.forEach(((e,r)=>trigger_registry.set(r,e))),condi_new.forEach(((val,key)=>{callback_registry.callback.set(key,eval(val.callback)),callback_registry.condition.set(key,eval(val.condition))})),lambdas.forEach(((val,key)=>{lambda_registry.callback.set(key,eval(val.callback)),lambda_registry.condition.set(key,eval(val.condition))})),lerpChains.forEach(((e,r)=>{lerpChain_registry[r]=new Float32Array(e)})),lerpChain_registry.matrixChains=matrixChains,lerps.forEach(((e,r)=>{0==integers.includes(r)?lerp_registry[r]=new Float32Array(e):lerp_registry[r]=new Uint8Array(e)})),void 0!=constants.get("matrix")&&constants.get("matrix").forEach(((e,r)=>{constant_registry.matrix.set(r,new Map),e.map(((e,t)=>{constant_registry.matrix.get(r).set(t,new Float32Array(e))}))})),void 0!=constants.get("number")&&(constant_registry.number=constants.get("number")),lerp_registry.type.map(((e,r)=>{2==e?lerp_registry.results.set(r,lerpChain_registry.buffer[lerp_registry.lerp_chain_start[r]]):lerp_registry.results.set(r,new Float32Array(lerpChain_registry.matrixChains.get(r).get(0)))})),lerp_registry.delta_t=new Float32Array(lerp_registry.duration.length),lerp_registry.delay_delta=new Float32Array(lerp_registry.duration.length)}function addTrigger(e,r,t,s){var i=[];if(void 0==trigger_registry.get(e)&&trigger_registry.set(e,new Map),void 0==trigger_registry.get(e).get(t))trigger_registry.get(e).set(t,new Map),trigger_registry.get(e).get(t).set(s,new Uint8Array([r]));else if(void 0==trigger_registry.get(e).get(t).get(s))trigger_registry.get(e).get(t).set(s,new Uint8Array([r]));else if(0==(i=trigger_registry.get(e).get(t).get(s)).includes(r)){var a=new Array(i);a.push(r),a=new Uint8Array(a),trigger_registry.get(e).get(t).set(s,a)}else console.warn("trigger already exists: target ".concat(r," in timeframe ").concat(s," in step ").concat(t," on animation with id ").concat(e))}function removeTrigger(e,r,t,s){var i=trigger_registry.get(e).get(t);if(void 0==i)return console.warn("the trigger registr has does not include the step");if(void 0==i.get(s))return console.warn("the slected timeframe in the  step does not include the target");const a=(i=i.get(s)).indexOf(r);if(void 0!=a&&i.length>1){const n=new Uint8Array(new Array(i).splice(a,1));console.log("removed trigger target ".concat(r," in timeframe ").concat(s," in step ").concat(t," from from id ").concat(e)),trigger_registry.get(e).get(t).set(s,n)}else trigger_registry.get(e).get(t).set(s,void 0)}function update(e,r){r.map((r=>{lerpChain_registry.lengths[r.id]!=r.values.length-1&&(console.log(trigger_registry.get(r.id)),1==lerp_registry.loop[r.id]&&(removeTrigger(r.id,r.id,lerpChain_registry.lengths[r.id]-1,lerp_registry.duration[r.id]),addTrigger(r.id,r.id,r.values.length-2,lerp_registry.duration[r.id])),lerpChain_registry.lengths[r.id]=r.values.length-1),2==e?r.values.map(((e,t)=>{lerpChain_registry.buffer[lerp_registry.lerp_chain_start[r.id]+t]=e})):3==e&&r.values.map(((e,t)=>{lerpChain_registry.matrixChains.get(r.id).set(t,e)})),lerpChain_registry.reset(r.id)}))}var lambda;function lambda_call(e,r){(void 0==lambda_registry.condition.get(e)||lambda_registry.condition.get(e))&&(lambda=lambda_registry.callback.get(e))(r)}async function render(){1==status&&postMessage({message:"render",results:lerp_registry.results,result_indices:lerp_registry.activelist})}async function render_constant(e,r){postMessage({message:"render_constant",id:e,type:r,value:get_constant(e,r)})}function returnPromise(e){postMessage({message:"stopping",promise:e})}function setLerp(e,r,t){lerpChain_registry.buffer[lerp_registry.lerp_chain_start[e]+r]=t}function setMatrix(e,r,t){t.map(((t,s)=>{lerpChain_registry.matrixChains.get(e).get(r)[s]=t}))}function update_constant(e,r,t){constant_registry.update(r,e,t)}function get_constant(e,r){return constant_registry.get(r,e)}function get_time(e){return lerp_registry.progress[e]}function is_active(e){return lerp_registry.activelist.includes(e)}function current_step(e){return lerpChain_registry.progress(e)}function get_lerp_value(e){return lerp_registry.results.get(e)}function soft_reset(e){lerpChain_registry.soft_reset(e)}function hard_reset(e){lerpChain_registry.reset(e)}function set_delta_t(e,r){lerp_registry.progress=r,lerp_registry.delta_t[e]=lerp_registry.duration[e]/lerp_registry.progress[e]}function set_step(e,r){lerpChain_registry.progress[e]=r>lerpChain_registry.lengths[e]?lerpChain_registry.lengths[e]:r}function get_duration(e){return lerp_registry.duration[e]}function set_duration(e,r){lerp_registry.duration[e]=r}function get_delay(e){return lerp_registry.delay[e]}function set_delay(e,r){lerp_registry.delay[e]=r}function get_delay_delta(e){return lerp_registry.delay_delta[e]}function set_delay_delta(e,r){lerp_registry.delay_delta[e]=r}function set_sequence_length(e,r){lerpChain_registry.lengths[e]=r}function get_constant_row(e,r){return constant_registry.get_row(e,r)}function get_constant_number(e){return constant_registry.get_number(e)}function get_active(e){return lerp_registry.activelist}function get_status(){return status}onmessage=e=>{switch(e.data.method){case"init":init(e.data.data,e.data.chain_map,e.data.matrix_chain_map,e.data.trigger_map,e.data.constants,e.data.callback_map,e.data.lambda_map,e.data.spring_map);break;case"update":update(e.data.type,e.data.data);break;case"update_constant":constant_registry.update(e.data.type,e.data.id,e.data.value);break;case"start":start_loop();break;case"stop":stop_loop();break;case"change_framerate":change_framerate(e.data.fps_new);break;case"lambda_call":lambda_call(e.data.id,e.data.args);break;case"start_animations":start_animations(e.data.indices);break;case"stop_animations":1==status&&(status=!1,stop_animations(e.data.indices));break;case"reset_animations":reset_animations(e.data.indices);break;case"addTrigger":addTrigger(e.data.id,e.data.target,e.data.step,e.data.time);break;case"removeTrigger":removeTrigger(e.data.id,e.data.target,e.data.step,e.data.time);break;default:console.warn("no method selected during worker call")}};class Spring{constructor(e,r,t,s){this.elements=e,this.duration=r,this.spring_tension=t}}function shortest_path(){}function knn(){}function convex_hull(){}function spring(){}})();
//# sourceMappingURL=921.4bcef180.chunk.js.map