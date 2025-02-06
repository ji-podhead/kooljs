# kooljs 
- kooljs is a multithreaded animation tool.
- its one task per animator instance
- this project is still in development 

## what can it do?
- compute animations on a worker thread
- add addtional logic like lambda functions that run on the worker
- trigger animations at a certain frame of another animation, or via custom renderevents on the worker
- use arrays for animated sequences
  - you can update those values and even  use different sizes if you set the max_length parameter


## LiveDemo v0.1.5
- check out the [LiveDemo](https://ji-podhead.github.io/kooljs/)
- I will add adding additional Examples over time

## Components
### Animator
The animator serves as our Middleware to communicate with the worker:
- creates the animated objects
- creates the registry on the worker
- update values
- start/stop animations
  
### Lerp & Matrix lerp
This are the animation objects that get animated in a render loop on the worker

#### Arguments
| arg | description | default |
| --- | --- | --- |
| render_callback | a function that gets called on the mainthread after the render loop | none |
| duration | the max amount of computations pro step |10 |
| render_interval | computations pro step =  render_interval // duration | 1 |
| smoothstep |  the amount of smooth step/easing that is applied| 1 |
| delay | the amount of steps to wait before starting the animation| 0 |
| animationTriggers | a list of animationtrigger objects | undefined |
| callback | a callback object that gets called on the worker | undefined |
| steps | a list of values to lerp through |undefined |
| loop| if this animation will get reseted after a lifecycle | false |
| steps_max_length | the max length of steps for this animation. Matrix Animations don't use this property | steps.length |

### Constants
Constants are either matrices or numbers that get stored on the worker.
They are called Constants since they are not getting animated in the render loop.
However you can update them from both the mainthread (Animator.update_constant) and the worker (using lambdas or Lerp callbacks).
Constants serve as a way to update multiple animation values on the worker instead of calling animator.update() for every related animation from the mainthread, which requires to serialize the values. But they can also get used as Middleware to update values on the mainthread. 

- when updating Constants, they can also trigger animations by using render triggers (v0.1.7)

        
### contrbuting examples
Feel free to contribute your own examples or open a feature request.
- I deployed to gh-pages branch `using bun deploy`

## how to run the example project
- git clone `git@github.com:ji-podhead/kooljs.git`
- cd example_project
- bun start


- I left the vscode folder in the branch so you can directly debug it with chrome
  - firefox is apprently having some issues with triggering breakpoints on rhel



## how to use
- since kooljs is using workers and typed  arrays, the procedure is as follows:
  - 1. create an animator instance 
    ```js
    import { Animator } from "./kooljs/animations"

    const animator = new Animator(30)
    ```
  - 2. create a Lerp instance
    ```js
      const new_lerp=animator.Lerp({ 
        accessor: [undefined, ((val,id) => {document.getElementById(`e3_${id}`).style.transform = `translate(0%,${val}%)`;})],
        duration: 10,
        steps: [10,100],
    })
    ```
  - 3. initialize the worker
    ```js
    animator.init()
    ```
> each time you call animator.init() it will recreate the entire registry in the worker, so do that only if you really have to and pass down the animator where ever you can
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

### info
a cool animation tool for js. name provided by thebusinessman0920_55597 and bomi from the programers hangout helped with the name!
