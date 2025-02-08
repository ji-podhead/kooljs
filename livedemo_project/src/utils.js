
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic}  from 'react-syntax-highlighter/dist/esm/styles/prism'
// a11yDark, atomDark, base16AteliersulphurpoolLight, cb, coldarkCold, coldarkDark, coy, coyWithoutShadows, darcula, dark, dracula, duotoneDark, duotoneEarth, duotoneForest, duotoneLight, duotoneSea, duotoneSpace, funky, ghcolors, gruvboxDark, gruvboxLight, holiTheme, hopscotch, lucario, materialDark, materialLight, , nightOwl, nord, okaidia, oneDark, oneLight, pojoaque, prism, shadesOfPurple, solarizedDarkAtom, solarizedlight, synthwave84, tomorrow, twilight, vs, vscDarkPlus, xonokai, zTouch
import { TutorialWidget as TutorialWidget1,Controls as Controls1 } from './examples/e1';
import { TutorialWidget as TutorialWidget2,Controls as Controls2 } from './examples/e2';
import { TutorialWidget as TutorialWidget3,Controls as Controls3 } from './examples/e3';
import { TutorialWidget as TutorialWidget4,Controls as Controls4 } from './examples/e4';
import { TutorialWidget as TutorialWidget5,Controls as Controls5 } from './examples/e5';
import { TutorialWidget as TutorialWidget6,Controls as Controls6 } from './examples/e6';

const tutorials=[
    {
        controls:Controls1,
        widgets:TutorialWidget1
    },
    {
        controls:Controls2,
        widgets:TutorialWidget2
    },
    {
        controls:Controls3,
        widgets:TutorialWidget3
    },
    {
        controls:Controls4,
        widgets:TutorialWidget4
    },
    {
        controls:Controls5,
        widgets:TutorialWidget5
    },
    {
        controls:Controls6,
        widgets:TutorialWidget6
    }


]
async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function next(setsel,animator,index){
    animator.stop()
    requestAnimationFrame(() => {
                    setsel(index)
        })
    
}
function Widgets({setsel,animator}) {
    const Elements = (() => tutorials.map((w,i) => {
        return (
            <div class="w-full  pt-5 pl-2 ">
                <div class="rounded-md border-4 bg-[#bac9d0] border-slate-400 w-[95%] gap-y-5  flex flex-col  items-center justify-center">
                <button id={`w_${i}`}   
                
                    onClick={()=>next(setsel,animator,i)}
                    onMouseOver={(()=>{changeBackground(`w_${i}`,"#C0E58B")})}
                    onMouseOut={(()=>{changeBackground(`w_${i}`,"white")})}
                    class="bg-white border-2 border-black w-[95%] rounded-md h-[30%]"
                >
                    <div class="text-sm">
                       <u> {i}</u> 
                    </div>
                    {/* <div className="h-full w-[90%] text-sm text-left pl-1">
                        {w.info}
                    </div> */}
                    </button>
                </div>
            </div>
        )
    })
    )
    return (
        <div class="bg-[#bac9d0] flex flex-col items-center   w-full h-full ">
            <div class="w-full h-[7%] bg-[#4A5A6A] text-xl justiy-center items-center   flex   rounded-b-lg  " style={{ height: window.innerHeight * 0.03 }}>
                <div class="w-full h-full  text-white">Examples</div>
            </div>
            <Elements></Elements>
        </div>
    )

}
const changeBackground = (element,color) => {
    document.getElementById(element).style.backgroundColor=color
  //  element.style.backgroundColor = 'red';
  };
const changeBorder = (element,color) => {
    document.getElementById(element).style.borderColor=color
  //  element.style.backgroundColor = 'red';
  };
function AnimationControl({ args }) {
    const Elements = (() => {
        if (args != undefined && args.sel >= 0 ) {
            //console.log(TutorialComponents[args.sel])
            return tutorials[args.sel].controls.map((t) => (
                <div class="rounded-md border-4 bg-[#bac9d0] items-center border-slate-400 w-[90%] gap-y-2  flex flex-col">
                    <div class="text-xl">
                        
                    </div>
                    <button id={t.name}   onClick={(() => t.button.onClick())} onMouseOver={(()=>{
                        changeBackground(t.name,"#C0E58B")})} onMouseOut={(()=>{changeBackground(t.name,"white")})} class="bg-white border-4 border-black w-[50%] rounded-md h-[30%]">
                        {t.button.name}
                    </button>
                    <div className="h-full w-[85%] text-sm text-left">
                        {t.info}
                    </div>
                    <div/>
                </div>
            ))
        }
    })
    return (<div class="w-full border-4 border-r-0 border-t-0 border-l-[#BF8DE1] border-b-[#BF8DE1] bg-[#657a85] rounded-bl-md h-full flex flex-col">
        <div class="w-full h-[7%] bg-[#4A5A6A] text-xl flex flex-col justiy-center items-center      rounded-b-lg  " style={{ height: window.innerHeight * 0.03 }}>
            <div class="w-full h-full  text-white">Animation Control</div>
        </div>
        <div class="w-full h-full  flex flex-col gap-y-5 overflow-y-scroll pt-5 items-center  justiy-center border-r-4 border-b-4 border-slate-500">
            <Elements></Elements>
        </div>
    </div>)
}

function Header() {
    return (
        <div class="w-full h-full text-[#C0E58B] bg-[#404d5a] border-t-4 border-l-4 border-r-4 border-[#BF8DE1]  text-white text-xl flex items-center rounded-t-md">
            <div class="w-[30%] justify-self-start self-center text-4xl "><b>kooljs</b></div>
            <div class="w-full justify-self-center align-center text-2xl"><b>Live Demo</b></div>
            <div class="w-[20%] h-full justify-self-end self-center gap-5 flex flex-row items-center justify-center">
                <div id="manual"  
                onMouseOver={()=>{changeBorder("manual","#C0E58B")}}
                onMouseOut={()=>{changeBorder("manual","white")}}
                class="bg-black h-[70%] aspect-square border-white border-2 rounded-md items-center justify-center flex overflow-hidden">
                    <a href="https://github.com/ji-podhead/kooljs" class="w-[50%] h-[50%] items-center flex">
                    <svg viewBox="0 0 128 128">
                            <path fill="#ffffff" d="M57.62 61.68c-1.7.24-2.87 1.78-2.62 3.43a3.07 3.07 0 0 0 2.22 2.54s7.47 2.46 20.18 3.51c10.21.85 21.8-.73 21.8-.73 1.7-.04 3.03-1.45 2.99-3.15a3.065 3.065 0 0 0-3.15-2.99c-.2 0-.4.04-.61.08 0 0-11.34 1.41-20.55.65-12.15-.97-18.77-3.19-18.77-3.19-.48-.16-1.01-.24-1.49-.16Zm0-15.22c-1.7.24-2.87 1.78-2.62 3.43a3.07 3.07 0 0 0 2.22 2.54s7.47 2.46 20.18 3.51c10.21.85 21.8-.73 21.8-.73 1.7-.04 3.03-1.45 2.99-3.15a3.065 3.065 0 0 0-3.15-2.99c-.2 0-.4.04-.61.08 0 0-11.34 1.41-20.55.65-12.15-.97-18.77-3.19-18.77-3.19-.48-.16-1.01-.24-1.49-.16Zm0-15.22c-1.7.24-2.87 1.78-2.62 3.43a3.07 3.07 0 0 0 2.22 2.54s7.47 2.46 20.18 3.51c10.21.85 21.8-.73 21.8-.73 1.7-.04 3.03-1.45 2.99-3.15a3.065 3.065 0 0 0-3.15-2.99c-.2 0-.4.04-.61.08 0 0-11.34 1.41-20.55.65-12.15-.97-18.77-3.19-18.77-3.19-.48-.16-1.01-.2-1.49-.16Zm0-15.18c-1.7.24-2.87 1.78-2.62 3.43a3.07 3.07 0 0 0 2.22 2.54s7.47 2.46 20.18 3.51c10.21.85 21.8-.73 21.8-.73 1.7-.04 3.03-1.45 2.99-3.15a3.065 3.065 0 0 0-3.15-2.99c-.2 0-.4.04-.61.08 0 0-11.34 1.41-20.55.65-12.15-.97-18.77-3.19-18.77-3.19a2.74 2.74 0 0 0-1.49-.16ZM36.31 0C20.32.12 14.39 5.05 14.39 5.05v119.37s5.81-5.01 24.54-4.24 22.57 7.35 45.58 7.79c23.01.44 28.78-3.55 28.78-3.55l.32-121.67S103.28 5.7 83.09 5.86C62.95 6.01 58.11.73 39.62.12 38.49.04 37.4 0 36.31 0Zm13.36 7.79s9.69 3.19 27.57 4.08c15.14.77 30.28-1.49 30.28-1.49v108.15s-7.67 4.04-26.84 2.66c-14.86-1.05-31.2-6.7-31.2-6.7l.2-106.69Zm-9.32 2.83c1.7 0 3.11 1.37 3.11 3.11s-1.37 3.11-3.11 3.11c0 0-5.01.04-8.07.32-5.13.52-8.64 2.38-8.64 2.38-1.49.81-3.39.2-4.16-1.29-.81-1.49-.2-3.39 1.29-4.16s4.56-2.42 10.9-3.03c3.67-.4 8.68-.44 8.68-.44Zm-2.99 15.26c1.7-.04 2.99 0 2.99 0 1.7.2 2.91 1.74 2.7 3.43a3.08 3.08 0 0 1-2.7 2.7s-5.01.04-8.07.32c-5.13.52-8.64 2.38-8.64 2.38-1.49.81-3.39.2-4.16-1.29-.81-1.49-.2-3.39 1.29-4.16 0 0 4.56-2.42 10.9-3.03 1.86-.24 4-.32 5.69-.36Zm2.99 15.18c1.7 0 3.11 1.37 3.11 3.11s-1.37 3.11-3.11 3.11c0 0-5.01-.04-8.07.28-5.13.52-8.64 2.38-8.64 2.38-1.49.81-3.39.2-4.16-1.29-.81-1.49-.2-3.39 1.29-4.16 0 0 4.56-2.42 10.9-3.03 3.67-.44 8.68-.4 8.68-.4Z"></path>
                        </svg> 
                    </a>
                </div>
                <div id="npm" 
                onMouseOver={()=>{changeBorder("npm","#C0E58B")}}
                onMouseOut={()=>{changeBorder("npm","white")}}
                class="bg-black h-[70%] aspect-square border-white border-2 rounded-md items-center justify-center flex overflow-hidden">
                    <a href="https://github.com/ji-podhead/kooljs" class="w-[80%] h-[80%] items-center flex">
                    <svg viewBox="0 0 128 128">
                    <path fill="#ffffff" d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79zm13.78 7.29H64v14.56h-6.89zm20.67-7.29v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79z"></path>
                    </svg> 
                    </a>
                </div>
                <div id="git" 
                onMouseOver={()=>{changeBorder("git","#C0E58B")}}
                onMouseOut={()=>{changeBorder("git","white")}}
                class="bg-black h-[70%] aspect-square border-white border-2 rounded-md items-center justify-center flex overflow-hidden">
                    <a href="https://github.com/ji-podhead/kooljs" class="w-[80%] ">
                        <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" />
                    </a>
                </div>

            </div>

        </div>
    )
}

function CodeBlocks({ sel }) {
    if (sel >= 0) {
        return (
            <div class="w-full h-full flex flex-col b">
                <div class="w-full h-[15%] bg-[#4A5A6A] text-white text-xl flex flex-row justify-center items-center text-center rounded-tl-lg border-t-4 border-l-4 border-r-4 border-[#657a85] " style={{ height: window.innerHeight * 0.045 }}>
                    <div class="w-[92%] ">Code Snippet</div>
                    <div class="w-[8%]  h-full flex flex-row items-center gap-3 justify-center">
                        <div id = {"git2"} class="h-[90%] aspect-square border-2 border-[#ffffff] self-end rounded-md bg-[#28323c] flex items-center justify-center"
                        onMouseOver={()=>{changeBorder("git2","#C0E58B")}}
                        onMouseOut={()=>{changeBorder("git2","white")}}
                        >
                        <a href="https://github.com/ji-podhead/kooljs" class="w-[80%] ">
                        <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" />
                        </a>
                        </div>
                        <button  id={"cop"} class="h-[90%] aspect-square border-2 border-[#ffffff] self-end rounded-md bg-[#28323c] flex items-center justify-center"
                            onMouseOver={()=>{changeBorder("cop","#C0E58B")}}
                            onMouseOut={()=>{changeBorder("cop","white")}}
                            onClick={()=>{navigator.clipboard.writeText(tutorials[sel].widgets.mdfile.split('\n').slice(1, -1).join('\n'))}}
                        >
                             <div class="w-[60%] h-[60%]">
                             <svg fill="#ffffff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z" fill-rule="evenodd"></path> </g>
                             </svg>
                            </div>
                        </button>
                    </div>

                </div>
                <div class="w-full h-full overflow-y-scroll  bg-[#4A5A6A] border-l-4 border-r-4  border-[#657a85] border-b-[#BF8DE1] border-b-4" >
                    <Markdown
                        class=""
                        children={tutorials[sel].widgets.mdfile}
                        components={{
                            code(props) {
                                const { children, className, node, ...rest } = props
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                    <SyntaxHighlighter
                                        {...rest}
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={materialOceanic}
                                    />
                                ) : (
                                    <code {...rest} className={className}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    />
                </div>
            </div>
        )
    }
}

export { Widgets, AnimationControl, Header, CodeBlocks }



