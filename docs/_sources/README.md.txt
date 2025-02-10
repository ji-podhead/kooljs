

 ![NPM Version](https://img.shields.io/npm/v/kooljs)  ![Static Badge](https://img.shields.io/badge/LiveDemo-0.2.0-brightgreen) 

kooljs is a multithreaded animation tool for the web.

## what can it do?
- compute lerp animations on a worker thread
- build your own animation statemachines that are running on the worker
  - custom logic (lambdas, or callbacks) that run on the worker
  - timelines to orchestrate animations
  - trigger other animations
- MatrixLerps to animate multiple values at once
- stores and accesses the values on the worker using TypedArray and Map Datatypes
- avoid prop drilling for values that are only used for animations by storing and updating them on the worker

## install 
```js
npm i kooljs
```
## LiveDemo v0.2.0
- check out the [LiveDemo](https://ji-podhead.github.io/kooljs/)
- I will add adding additional Examples over time

## Components
### Animator
The animator serves as our Middleware to communicate with the worker:
- its one task/worker thread per animator instance
- creates the animated objects
- creates the registry on the worker
- update values
- start/stop animations
#### how to use
- since kooljs is using workers and typed  arrays, the procedure is as follows:
  - 1. create an animator instance 
    ```js
    import { Animator } from "kooljs/animator"

    const animator = new Animator(30)
    ```
  - 2. create a Lerp instance
    ```js
      const new_lerp=animator.Lerp({ 
        render_callback: ((val) => {document.getElementById("e1_a").style.transform = `translate(0,${val}%)`;
        }), 
        duration: 50, 
        steps: [0, 400],
     })
    ```
  - 3. initialize the worker
    ```js
    animator.init()
    ```
> each time you call animator.init() it will recreate the entire registry in the worker, so do that only if you really have to and pass down the animator where ever you can
  


### Components that are updated in the render loop
Those are Components we iterate over for a certain amount of time in the render loop on the worker.
- ***Lerp***
  - uses a series of numbers to lerp through as the input of `steps`
  - use the `render_callback` to pass the computed values to a callback on the main thread 
  - you can either call document.get in the callback directly to apply the styling using the animated value, or you can store the values (eg usecallback) to store and process them
- ***MatrixLerp***
  - The same as `Lerp`, but it requires a list of subarrays (Matrices) instead a list of numbers as the input of `steps`
  - MatrixLerp lets you animate multipe values, but they only require a single `render_callback` call to pass them to the mainthread at once
    - this can be handy if you dont want to create multiple animations for a single div and therefore `prevents overhead` 
- ***Timeline***
  -  Timeline acts like a Lerp-Animation that does not fire a callback after a each animation-frame.
  -  They can be used to trigger and control other timelines, lerps, matrixLerps, lambdas or constants on the worker, or to create a statemachine
    
#### Arguments
|***L***-Lerp|***M***-MatrixLerp|***T***-Timeline|

| arg | description | default | Components |
| --- | --- | --- |  --- |
| render_callback | a function that gets called on the mainthread after the render loop | none | L,M |
| duration | the max amount of computations pro step |10 | All |
| steps | a list of values to lerp through |undefined | All |
| steps_max_length | the max length of steps for this animation. | steps.length |  L |
| loop | if this animation will get reseted after a lifecycle | false |  All |
| render_interval | computations pro step =  render_interval // duration | 1 |  All |
| smoothstep |  the amount of smooth step/easing that is applied| 1 |  L,M |
| delay | the amount of steps to wait before starting the animation| 0 |  All |
| animationTriggers | a list of animationtrigger objects | undefined |  All |
| callback | a callback object that gets called on the worker | undefined |  All |



### Constants
Constants are either matrices or numbers that get stored on the worker.
They are called Constants since they are not getting animated in the render loop.

However you can update them from both the mainthread (Animator.update_constant) and the worker (using lambdas or Lerp callbacks).

Constants serve as a way to update multiple animation values on the worker instead of calling animator.update() for every related animation from the mainthread, which requires to serialize the values. 

But they can also get used as Middleware to update values on the mainthread. 

- when updating Constants, they can also trigger animations by using `render_triggers`, or call lambdas by using `render_lamba_calls`

### Lambdas & Callbacks (Lerp, MatrixLerp, Timeline)

Lambdas and Callbacks lets you use youre custom logic on the worker.
You can basically create your own statemachine that is running on the worker.
- ***The Arrow function needs to be either a string, or a function***

#### using the function syntax and the animProps dict 
- ***Passing function instead of a string, requires to add an additional `animProps` dict if you use variables inside your arrow function that are located in your scripts***
  ```js
  props:{
    some_value:"printing on the worker"
  }
  //... later when creating the animation, or lambda
  callback:{
    callback: (()=>{
    console.log(`${animProps.some_value}`)
   }),
   animProps:props
  ```
#### using the string syntax
- so the syntax is the same as when using variables in a string.
  - so if you wanto to pass your callbacks as a string, the syntax is like this:
  ```js
    props:{
    some_value:"printing on the worker"
  }
  //... later when creating the animation, or lambda
  callback:{
    callback:`(()=>{
    console.log(${props.some_value})
  })`
  }
  ```
- you can fire callbacks eventbased (eg onMouseOver) without having to start a animation and its `callback` function
- you can also call them using the `callback` argument of the animated components on the worker directly
- just like with the `callback` of the animated components, they require a string as input that gets evaluated on the worker


#### worker utility functions
There are a bunch of mehtods you can use in your custom  logic to manipulate, start, or stop animations.
Some of them will just set, or return a value from the registry.
import them via:
```js
import {get_time,stop_animations,setMatrix,get_lerp_value,soft_reset,hard_reset,set_duration,get_constant_number,get_constant_row,update_constant,lambda_call} from "kooljs/worker"
```
| Method | Description | Arguments | 
| --- | --- | --- | 
| addTrigger | triggers another animation at a certain step and delta_t value | id, target, step, time | 
| removeTrigger | removes a trigger | id, target, step, time | 
| get_time | gets the delta_t value of an animation | id | 
| set_delta_t | sets the delta_t value of an animation | id, val | 
| get_step | returns the current step of an animation | id | 
| set_step | sets the current step of an animation | id, val | 
| is_active | returns true if an animations is currently running | id | 
| get_active | get all avtive animation indices | . | 
| start_animations | a list of animation indices to start | indices | 
| stop_animations | a list of animation indices to stop | indices | 
| setLerp | set a Lerp target value for a certain step of an animation | index, step, value | 
| setMatrix | set the matrix lerp target value for a certain step of an animation | index, step, value | 
| get_lerp_value | returnt the lerp result vlaue of an animation | id | 
| soft_reset | starts and resets an animation if its finished, or not playing | id | 
| hard_reset | starts and resets the animation without checking if its finished | id | 
| get_duration | get the duration of an animation | id | 
| set_duration | set the duraiton of an animation | id, val | 
| set_sequence_length | set the lengths of steps that get lerped through | id, val | 
| change_framerate | set the fps | fps_new | 
| get_constant | returns a constant (matrix, or number) | id, type | 
| get_constant_number | returns a constant (number) | id | 
| get_constant_row | returns a row of a matrix constant | id, row | 
| render_constant | messages the mainthread and sends the updated constant value | id, type| 
| update_constant | set a constant value | id, type, value | 
| set_delay | set the delay of an animaiton | id, val | 
| get_delay | get the delay of an animation | id | 
| get_delay_delta | get the delay_delta (delay progress) of an animation | id | 
| set_delay_delta | set the delay_delta (delay progress) of an animation | id, val | 
| lambda_call | perform a lambda call | id, args |

### Examples
> the full examples can be found [here](https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e4.js) and [here](https://github.com/ji-podhead/kooljs/blob/main/livedemo_project/src/examples/e5.js) 
#### Constant
```js
animProps.reference_matrix=animator.constant({
  type:"matrix",
  value:reference_matrix // eg [[x,y,z],[x,y,z]]
})
```
#### Lerp
```js
animationProps.target_b=animator.Lerp({ 
  render_callback: ((val)=>transform('e3_b',val)),
    duration: 10, 
    steps: [0, 400, 0],
    animationTriggers:[{
        step:0,
        start:10,
        target:animationProps.target_c.id
    }]
})
```

#### MatrixLerp
```js
for (let i=0;i<length;i++){
  animProps.boxes[i]={
    anim: animator.Matrix_Lerp({ 
      render_callback:((val)=>setStyle(i,val)), 
      duration: 10, 
      steps: reference_matrix, // eg [[x,y,z],[x,y,z]]
      loop:false,
      }),
    }
  animProps.indices[i]=animProps.boxes[i].anim.id
}
```
#### Lambda
```js
animProps.stop_active = animator.Lambda({
  callback: (()=>{
    get_constant_row(`${animProps.indices.id}`,0).map((i)=>{
      if(get_constant_number(`${animProps.selected.id}`)!=i ){
        if( get_constant_row(`${animProps.reference_matrix.id}`,0)!=get_lerp_value(i))
        {
          lambda_call(`${animProps.replace_indices.id}`,{index:i,ref_step:0})
          set_duration(i, get_time(i)<3?3:get_time(i))
          soft_reset(i)
        }
      }
    })
  }),
  animProps:animProps
})
```

#### Timeline
- in this example we are using lambdas to edit edit the registry on the worker to alter the animations during certain events.<br/>

```js
animProps.idle_animation= animator.Timeline({ 
  duration: 100,
  render_interval:20, 
  length:1,
  loop:true,
  callback:{
    callback:(({time})=>{
      console.log("----------timeline animation----------")
      console.log("time " + time)
      if(time==0){
        update_constant(`${animProps.selected.id}`,"number",-1)        
        lambda_call(`${animProps.stop_active.id}`)
        lambda_call(`${animProps.start_random.id}`)
      }
      else if(time==80){
        const random_index = get_constant_number(`${animProps.selected.id}`)
        console.log("random selection is " + random_index)
        lambda_call(`${animProps.replace_indices.id}`,{index:random_index,ref_step:0})
        console.log("updated values")
        console.log("started animation with index " + random_index)
        soft_reset(random_index)
      }
      console.log("--------------------------------")
    }),
    animProps:animProps
  }
})
```
 


        
### contrbuting examples
Feel free to contribute your own examples or open a feature request.
- I deployed to gh-pages branch `using bun deploy`

## how to run the example project
- git clone `git@github.com:ji-podhead/kooljs.git`
- cd livedemo_project
- bun start

> - I left the vscode folder in the branch so you can directly debug it with chrome
  - firefox is apprently having some issues with triggering breakpoints on rhel


### changing the kooljs code and use it in the demo
  i used bun link to install kooljs locally in the dmeo project
  - after making changes to the source code you need to run this from the demo folder:
  ```js
    bun install ../kooljs
  ```

### how to create the autodocs
```bash
cd kooljs 
sudo npm install -g jsdoc
pip3 install sphinx-js
pip3 install myst-parser
pip3 install sphinx-argparse
pip3 install sphinxcontrib.autoprogram
pip3 install sphinx-rtd-theme
cd ../.docs
make html
```
### how to publish the react site
```bash
cd livedemo_project
bun run build
bun run deploy
```


## roadmap
- rendering canvas 
- spline
- spring
- constant renderevents, when changing constants via worker_callback
- lerp_divs
- GPU acceleration
- matrix lerp and complex magrix calculcations via callback function


### Enhancements
- removeing accessor and exchange with *render_callback* (using setter only)
- use fixed size for results<br>
~~- use special keywords in the callback to use the registry of the worker thread~~<br>
~~- triggering animations on the worker thread~~

---

### notes
a cool animation tool for js. name provided by thebusinessman0920_55597 and bomi from the programers hangout helped with the name!
