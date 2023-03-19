import { useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { MathComponent } from "mathjax-react";
import { Engine } from "sim-spoms/src/engine/engine";
import { InputInfo } from "./setting.constant";

export interface ParameterProps extends InputInfo {
  functionType: string;
  engine: Engine;
  parameterType: string;
}

const Parameter: React.FC<ParameterProps> = (props: ParameterProps) => {
  const PARAMETER_SETTER_LOOKUP_TABLE = {
    dispersalFunction: {
      a: (val: number) => {
        props.engine.dispersalFunction.setAlpha(val);
      },
    },
    connectivityFunction: {
      b: (val: number) => {
        props.engine.connectivityFunction.setBeta(val);
      },
    },
    colonizationFunction: {
      y: (val: number) => {
        props.engine.colonizationFunction.setY(val);
      },
    },
    intrinsicExtinctionFunction: {
      e: (val: number) => {
        props.engine.intrinsicExtinctionFunction.setE(val);
      },
      x: (val: number) => {
        props.engine.intrinsicExtinctionFunction.setX(val);
      },
    },
    correlatedExtinctionFunction: {
      c: (val: number) => {
        props.engine.correlatedExtinctionFunction.setC(val);
      },
    },
  };

  const PARAMETER_LOOKUP_TABLE = {
    dispersalFunction: { a: props.engine.dispersalFunction.alpha },
    connectivityFunction: { b: props.engine.connectivityFunction.b },
    colonizationFunction: { y: props.engine.colonizationFunction.y },
    intrinsicExtinctionFunction: {
      e: props.engine.intrinsicExtinctionFunction.e,
      x: props.engine.intrinsicExtinctionFunction.x,
    },
    correlatedExtinctionFunction: {
      c: props.engine.correlatedExtinctionFunction.c,
    },
  };

  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [stateValue, setStateValue] = useState<number>(
    PARAMETER_LOOKUP_TABLE[props.functionType][props.parameterType]
  );
  const [currentValue, setCurrentValue] = useState<number>(
    PARAMETER_LOOKUP_TABLE[props.functionType][props.parameterType]
  );
  const [ParameterIsValid, setParameterIsValid] = useState<boolean>(true);

  const handleParameterChange = (value: number) => {
    setStateValue(value);
    checkParameterIsValid(value);
    setAllowEdit(value !== currentValue);
  };

  const checkParameterIsValid = (value: number) => {
    let parameterValid = true;
    if (props.lowerBound !== undefined && value < props.lowerBound) {
      parameterValid = false;
      setAllowEdit(true);
    }
    if (props.upperBound !== undefined && value > props.upperBound) {
      parameterValid = false;
      setAllowEdit(true);
    }
    setParameterIsValid(parameterValid);
  };

  const handleUpdateParameter = (value: number) => {
    checkParameterIsValid(value);
    if (ParameterIsValid && allowEdit) {
      setCurrentValue(value);
      PARAMETER_SETTER_LOOKUP_TABLE[props.functionType][props.parameterType](
        value
      );
      setAllowEdit(false);
    }
  };
  return (
    <div>
      <div className="mt-3 flex gap-3 font-bold">
        <div className="flex items-center align-middle h-7">
          <MathComponent tex={props.parameter} />
        </div>
        <div>
          <input
            className={`border-2 w-32 text-center bg-white h-7 parameter_input ${
              ParameterIsValid ? "border-black" : "border-red"
            }`}
            onChange={(event) =>
              handleParameterChange(Number(event.target.value))
            }
            type="number"
            defaultValue={currentValue}
          />
          <p className="text-sm font-thin text-red-600 mt-1">
            {ParameterIsValid ? "" : props.errorMessage}
          </p>
        </div>

        {/* The button to open modal */}
        <label htmlFor={props.parameter}>
          <div className="tooltip cursor-pointer" data-tip="More info">
            <AiFillQuestionCircle size={"1.8em"} />
          </div>
        </label>

        {/* Put this part before </body> tag */}
        <input
          type="checkbox"
          id={props.parameter}
          className="modal-toggle h-full relative"
        />
        <div className="modal h-full">
          <div className="modal-box font-normal p-11 relative bg-white">
            <label
              htmlFor={props.parameter}
              className="absolute right-5 top-3 cursor-pointer text-2xl text-dark-blue hover:bg-gray-200 px-2 rounded-full"
            >
              ✕
            </label>
            {props.info}
          </div>
        </div>
        <button
          className={`w-16 h-7 text-white text-sm rounded-md ${
            ParameterIsValid && allowEdit
              ? "bg-main-blue"
              : "bg-gray-200 cursor-not-allowed"
          }`}
          disabled={!ParameterIsValid && !allowEdit}
          onClick={() => {
            handleUpdateParameter(stateValue);
            setAllowEdit(false);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};
export default Parameter;
