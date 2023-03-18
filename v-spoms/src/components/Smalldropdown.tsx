import { MathComponent } from "mathjax-react";
import { IoIosArrowDown } from "react-icons/io";
import { Engine } from "sim-spoms/src/engine/engine";
import Parameter from "./Parameter";
import { Setting } from "./setting.constant";


export interface SmallDropDownProps extends Setting {
  engine: Engine;
  isOpen: boolean;
  setActiveDropDown: React.Dispatch<React.SetStateAction<string>>;
  activeDropDown: string;
}

const SmallDropDown: React.FC<SmallDropDownProps> = (props: SmallDropDownProps) => {
  const toggleDropDown = () => {
    props.setActiveDropDown(props.activeDropDown === props.equation ? "" : props.equation)
  }
  return (
    <div className="m-3 mb-6">
      <div
        className="flex cursor-pointer h-10 bg-main-blue items-center justify-between"
        onClick={() => toggleDropDown()}
      >
        <div className="font-semibold text-base text-white pl-4 border-spacing-2">
          {props.equationName}
        </div>
        <p className={props.isOpen ? "rotate-180 pl-4" : "pr-4"}>
          <IoIosArrowDown size="1.75em" />
        </p>
      </div>
      <div className={props.isOpen ? "h-auto mt-2 ml-3" : "h-0 hidden"}>
        {props.equation && (
          <p className="font-semibold mt-3 marker:text-main-blue text-xl">
            <MathComponent tex={props.equation} />
          </p>
        )}
        <div>
          <h2 className="font-semibold text-base text-main-blue mt-3">
            What does this mean?
          </h2>
          {props.description}
        </div>
        <div>
          <h2 className="font-semibold text-base text-main-blue mt-3">
            Parameters
          </h2>
          <div>
            {props.editableParameter?.map((parameter) => (
              <Parameter
                key={parameter.parameter}
                parameter={parameter.parameter}
                info={parameter.info}
                errorMessage={parameter.errorMessage}
                upperBound={parameter.upperBound}
                lowerBound={parameter.lowerBound}
                default={parameter.default}
                functionType={props.type}
                parameterType={parameter.type}
                engine={props.engine}
              />
            ))}
          </div>
          <div className="mt-3 w-full font-normal flex flex-col">
            {props.staticParameter?.map((value) => (
              <div className="font-normal flex items-center gap-1">
                <MathComponent tex={value.parameter} />
                <p> - {value.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallDropDown;
