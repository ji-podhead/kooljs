import Taskbar from "./sidebar"


function Main(mainProps){

return(
<div>
{/* <Taskbar mainProps={mainProps} /> */}
<div class="flex flex-col w-full h-full bg-red-400 ">
{[1, 2, 3, 4, 5].map((i) => (
<div key={i} class="h-[50%] w-15 border-1 bg-slate-500 border-blue-500 ">Div {i}</div>
))}
</div>
</div>
)
}
export default Main