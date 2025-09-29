import {
  start_animations,
  setMatrix,
  get_lerp_value,
  get_constant_row,
  hard_reset,
  reorient_duration_by_distance
} from "../../kooljs/worker_functions.js";

// The worker will pass the 'animProps' object to this function
export default (animProps) => {
    setMatrix(`${animProps.color_animation.id}`,1, [Math.random()*50, Math.random()*50, Math.random()*255]);
    const current= get_lerp_value(`${animProps.size_animation.id}`);
    const target_matrix=get_constant_row(`${animProps.size_constant_id}`,0);
    if(target_matrix==current){
      target_matrix[0]+=1;
      target_matrix[1]+=1;
    }
    hard_reset(`${animProps.size_animation.id}`);
    setMatrix(`${animProps.size_animation.id}`,1, target_matrix);
    const duration = reorient_duration_by_distance({
        index:`${animProps.size_animation.id}`,
        target:target_matrix,
        max_distance:100,
        min_duration:2,
        max_duration:`${animProps.size_duration_max}`,
        mode: "max_distance"
    });
    start_animations([`${animProps.size_animation.id}`]);
};