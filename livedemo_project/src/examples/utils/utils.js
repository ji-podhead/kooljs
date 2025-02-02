export default function ExampleDescription({header,description}){
    return (
    <div class="z-10 w-1/2 h-1/4 absolute flex pointer-events-none  flex flex-col items-center justify-items-center" style={{ width:window.innerWidth*0.67}}>
        <div class=" rounded-b-md   max-w-[45%]  text-black bg-[#5C8F8D]  items-center justify-items-center bg-opacity-45 border-b-2 border-l-2 border-r-2 border-black">
        <div class=" text-xl ">
          {header}
        </div>
        <div class=" text-sm text-left text-wrap w-[90%]">
          {description}
        </div>
        </div>
        </div>)
}