# kooljs 
- kooljs is a multithreaded animation tool.
- its one task per animator instance
- this project is still in development 

## what can it do?
- compute animations on a worker thread
- add addtional logic like lambda functions that run on the worker
- trigger animations and chaining
- use arrays for animated sequences
  - you can update those values and even  use different sizes if you set the max_length parameter
  -  you can disable/enable the sequence to use min/max lerp by any time


## LiveDemo
- check out the [LiveDemo](https://ji-podhead.github.io/kooljs/)
- I will add adding additional Examples over time
### contrbuting examples
Feel free to contribute your own examples or open a feature request.
- I deployed to gh-pages branch `using bun deploy`

## how to run the example project
- git clone `git@github.com:ji-podhead/kooljs.git`
- cd example_project
- copy the kooljs folder to the project folder and initialize the bun project
- you can also run the start.sh to start and install

- I left the vscode folder in the branch so you can directly debug it with chrome
  - firefox is apprently having some issues with triggering breakpoints on rhel



## how to use
- import the animator in 
- create a function to initialize your animation object (examples->e1_init)
  - create the props, animation-objects, callbacks, or triggers here
    - await the initialization those functions in the main component
- initialize the worker by calling Animator.init
  - its important that you do this after you initialized the other stuff because the Animator.init method will pass the typed arrays over to the worker
- call the component you wanna animate and overwrite the targets of the animation objects with your useStates if your using react 

## roadmap
- linear animation
- rendering canvas 
- additional lerping techniques
- matrix lerp and complex magrix calculcations via callback function
- use special keywords in the callback to use the registry of the worker thread 
- clear codebase and use inheritance
~~- triggering animations on the worker thread~~

---

### info
a cool animation tool for js. name provided by thebusinessman0920_55597 and bomi from the programers hangout helped with the name!