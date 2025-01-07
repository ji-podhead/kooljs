# kooljs 
- kooljs is a multithreaded animation tool.
- its one task per animator instance
- this project is still in developed 

# how to run the example project
- git clone `git@github.com:ji-podhead/kooljs.git`
- cd example_project
- copy the kooljs folder to the project folder and initialize the bun project
- you can also run the start.sh to start and install

- i left the vscode folder in the branch so you can directly debug it with chrome
  - firefox is apprently having some issues with triggering breakpoints on rhel

## codebase

- the app.js contains the only components
- the only current animation is the size of the main div -> based on the window size
- the Animation class instances are in the Animator Component within App.js (including the event callbacks)

## roadmap
- rendering canvas 
- additional lerping techniques
- triggering animations on the worker thread

---

### info
a cool animation tool for js. name provided by thebusinessman0920_55597 and bomi from the programers hangout helped with the name!