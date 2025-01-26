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


## LiveDemo v0.1.4
- check out the [LiveDemo](https://ji-podhead.github.io/kooljs/)
- I will add adding additional Examples over time
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
- matrix lerp and complex magrix calculcations via callback function
~~- use special keywords in the callback to use the registry of the worker thread~~
~~- triggering animations on the worker thread~~

---

### info
a cool animation tool for js. name provided by thebusinessman0920_55597 and bomi from the programers hangout helped with the name!