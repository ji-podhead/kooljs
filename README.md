# kooljs 
- kooljs is a multithreaded animation tool.
- its one task per animator instance
- it is still in developed and further features are planned
  - rendering canvas 
  - additional lerping techniques
  - triggering animations on the worker thread

# how to run the example project
- git clone git@github.com:ji-podhead/kooljs.git
- cd example_project
- copy the kooljs folder to the project folder and initialize the bun project
  - you can also run the start.sh

- i left the vscode folder in the branch so you can directly debug it with chrome
  - firefox is apprently having some issues with trigger breakpoints

## codebase

- the app.js contains the only components
- the only current animations are the width of the main div based on the window size
- the Animation class es in the Animator Component including the event callbacks
