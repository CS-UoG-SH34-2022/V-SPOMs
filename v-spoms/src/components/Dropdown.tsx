import { useState } from "react"
import { FAQ } from "./faq.constant"
import {IoTriangle} from "react-icons/io5"

const Dropdown = ({question,answer} : FAQ) =>{
    const [isOpen, setOpen] = useState<boolean>(false)
    return(
        <div className="mb-8 cursor-pointer" onClick={() => setOpen(!isOpen)}>
            <div className="flex h-16 bg-light-blue rounded-lg items-center justify-between">
                <div className="pl-5 font-bold text-2xl">{question}</div>
                <i className= {isOpen ? "rotate-180 curson-pointer pl-3" : "-rotate-90 cursor-pointer pb-6"} onClick={() => setOpen(!isOpen)}><IoTriangle /></i>
            </div>
            <div className={isOpen ? "h-auto mt-2 ml-4" : "h-0 hidden"}>
                {answer}
            </div>
        </div>
    )
}

export default Dropdown