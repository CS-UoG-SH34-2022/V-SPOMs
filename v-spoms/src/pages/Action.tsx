import { useEffect, useState } from "react";
import {
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlineMinusSquare,
  AiOutlinePause,
  AiOutlinePlusSquare,
  AiOutlineSetting,
} from "react-icons/ai";
import { BsFillCaretRightFill, BsFillSkipForwardFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Patch } from "sim-spoms/src/@types/patch";
import { Vector2D } from "sim-spoms/src/@types/vector2d";
import { createSPOM, IBackendSPOMOptions } from "sim-spoms/src/backend";
import { SPOM } from "sim-spoms/src/spom";
import ExportBtn from "../components/ExportBtn";
import MainNetwork from "../components/MainNetwork";
import { SETTING_DATA } from "../components/setting.constant";
import SmallDropDown from "../components/Smalldropdown";
import StatsGraph from "../components/StatsGraph";
import "../styles/Action.css";

const Action = () => {
  const location = useLocation();
  const spomOptions: IBackendSPOMOptions = location.state.spomOptions;

  // Here is just a demo of Graph Data
  const [OccupiedAreaGraphData, setOccupiedAreaGraphData] = useState<
    number[][]
  >([[]]);
  const [OccupiedPatchesGraphData, setOccupiedPatchesGraphData] = useState<
    number[][]
  >([[]]);
  const [TurnoverEventsGraphData, setTurnoverEventsGraphData] = useState<
    number[][]
  >([[]]);
  const [ReplicateSurvivalGraphData, setReplicateSurvivalGraphData] = useState<
    number[][]
  >([[]]);

  const [MeanOccupiedAreaGraphData, setMeanOccupiedAreaGraphData] = useState<
    number[]
  >([]);
  const [MeanOccupiedPatchesGraphData, setMeanOccupiedPatchesGraphData] =
    useState<number[]>([]);
  const [MeanTurnoverEventsGraphData, setMeanTurnoverEventsGraphData] =
    useState<number[]>([]);
  const [activeDropDown, setActiveDropDown] = useState<string>("");
  const [spom, setSpom] = useState<SPOM>(() => {
    return createSPOM(spomOptions);
  }); // This must be an arrow function, otherwise spom is recreated on each update. why?.
  const [patchesData, updatePatchesData] = useState<Patch[]>(
    spom.startingNetwork.patches
  );
  const [patchId, setPatchID] = useState<number | undefined>(undefined); // record current patch ref, can use current to get the state without the page refresh
  // record the current patch

  // Get zoom based on maximum distance between patches - so all patches fit into the screen
  const getDefaultZoom = (): number => {
    const mean_distance = spom.startingNetwork.getMaxDistanceBetweenPatches();

    const new_zoom = 681.4041 * Math.pow(mean_distance, -1.018664);
    return new_zoom;
  };

  const defaultSize = spom.startingNetwork.getMeanPatchSize();
  const [scale, setScale] = useState<number>(getDefaultZoom());

  // update the data
  const [iterationValue, setIterationValue] = useState<number | undefined>(
    undefined
  );
  const [inputValueX, setInputValueX] = useState<number | undefined>(undefined);
  const [inputValueY, setInputValueY] = useState<number | undefined>(undefined);
  const [inputValueA, setInputValueA] = useState<number>(defaultSize);
  const [inputValueO, setInputValueO] = useState<boolean | undefined>(
    undefined
  );

  // Simulation Data
  const [inputValueSimulationEnd, setInputValueSimulationEnd] =
    useState<number>(100);
  const [inputValueReplicas, setInputValueReplicas] = useState<number>(1);
  // flags
  const [animationIsRunning, setAnimationIsRunning] = useState<boolean>(false);

  // Button flags
  const [saveActive, setSaveActive] = useState<boolean>(false);

  // Add callback on  state change
  useEffect(() => {
    spom.engine.simulation.endTime = inputValueSimulationEnd;
  }, [inputValueSimulationEnd]);

  const handleUpdate = () => {
    setIterationValue(0);
    if (patchId === undefined) {
      alert("Please choose a Patch");
    } else {
      if (inputValueX != undefined) {
        const current_pos = spom.startingNetwork.getPatch(patchId).pos;
        spom.startingNetwork.updatePatchPosition(patchId, {
          x: inputValueX,
          y: current_pos.y,
        });
      }
      if (inputValueY != undefined) {
        const current_pos = spom.startingNetwork.getPatch(patchId).pos;
        spom.startingNetwork.updatePatchPosition(patchId, {
          x: current_pos.x,
          y: inputValueY,
        });
      }
      if (inputValueA != undefined) {
        spom.startingNetwork.updatePatchArea(patchId, inputValueA);
      }
      if (inputValueO != undefined) {
        spom.startingNetwork.updatePatchOccupancy(patchId, inputValueO);
      }
    }
    updatePatchesData([...spom.startingNetwork.patches]); // Create a shallow copy, since editing Patch data does not change the patches array hash -> does not trigger rerender.
    handleUpdateReverse();
  };

  const handleUpdateReverse = () => {
    if (patchId != undefined) {
      const patch = spom.startingNetwork.getPatch(patchId);
      setInputValueX(patch.pos.x);
      setInputValueY(patch.pos.y);
      setInputValueA(patch.area);
      setInputValueO(patch.is_occupied);
    }
  };

  const handleDelete = () => {
    if (patchId === undefined) {
      alert("Please choose the Patch you want to delete!");
    } else {
      spom.startingNetwork.deletePatch(patchId);
      setPatchID(undefined);
      updatePatchesData([...spom.startingNetwork.patches]);
    }
  };

  const handleCreate = () => {
    const length = patchesData.length;
    if (inputValueX && inputValueY && inputValueA) {
      spom.startingNetwork.createPatch(
        { x: inputValueX, y: inputValueY },
        inputValueA,
        inputValueO
      );
      updatePatchesData([...spom.startingNetwork.patches]);
    } else {
      alert(
        "Some properties missed. You must provide x, y, area and occupancy!"
      );
    }
  };

  const handleSimulate = () => {
    handleAnimateStop();
    spom.simulate(inputValueReplicas, inputValueSimulationEnd + 1);
    spom.simulationSnapshots = spom.replicates[0].simulationSnapshots;
    setIterationValue(0);
  };

  // Add callback on iterationValue state change
  useEffect(() => {
    handle_iteration_update();
  }, [iterationValue, inputValueSimulationEnd, inputValueReplicas]);

  const handleGraphUpdate = () => {
    if (iterationValue != undefined) {
      let stats_results = [];
      for (let i = 0; i < spom.networkStats.length; i++) {
        let stat_results = [];
        for (const replica of spom.replicates) {
          const sliced_stat_data = replica.stats[i].slice(
            0,
            iterationValue + 1
          );
          stat_results.push(sliced_stat_data);
        }
        stats_results.push(stat_results);
      }

      let replicate_results = [];
      for (let i = 0; i < spom.replicateStats.length; i++) {
        let replicate_result = [];
        const stat = spom.replicateStats[i].results.slice(
          0,
          iterationValue + 1
        );

        for (let j = 0; j < stat.length; j++) {
          stat[j] = stat[j] * 100;
        }
        replicate_result.push(stat);
        replicate_results.push(replicate_result);
      }

      setOccupiedAreaGraphData(stats_results[0]);
      setOccupiedPatchesGraphData(stats_results[1]);
      setTurnoverEventsGraphData(stats_results[2]);
      setReplicateSurvivalGraphData(replicate_results[0]);

      let mean_stats_results = [];
      for (let i = 0; i < spom.meanStats.length; i++) {
        const mean_sliced_stat_data = spom.meanStats[i].slice(
          0,
          iterationValue + 1
        );
        mean_stats_results.push(mean_sliced_stat_data);
      }
      setMeanOccupiedAreaGraphData(mean_stats_results[0]);
      setMeanOccupiedPatchesGraphData(mean_stats_results[1]);
      setMeanTurnoverEventsGraphData(mean_stats_results[2]);
    }
  };

  const handle_iteration_update = () => {
    //return
    if (iterationValue != undefined && spom.simulationSnapshots.length != 0) {
      if (iterationValue == 0) {
        updatePatchesData([...spom.startingNetwork.patches]);
      } else {
        if (iterationValue < spom.simulationSnapshots.length) {
          updatePatchesData([
            ...spom.simulationSnapshots[iterationValue].patches,
          ]); // Create a shallow copy, since editing Patch data does not change the patches array hash -> does not trigger rerender.
        }
      }
      handleUpdateReverse();
      handleGraphUpdate();
    } else {
      updatePatchesData([...spom.startingNetwork.patches]);
    }
  };

  const handleSkip = () => {
    setIterationValue(spom.engine.simulation.endTime - 1);
    handleAnimateStop();
  };

  const handleForwards = () => {
    if (
      spom.simulationSnapshots == undefined ||
      spom.simulationSnapshots?.length == 0
    ) {
      return;
    }
    if (iterationValue != undefined) {
      let new_value = Math.min(
        spom.simulationSnapshots.length - 1,
        iterationValue + 1
      );
      setIterationValue(new_value);
    }
  };

  const handleBackwards = () => {
    if (iterationValue != undefined) {
      let new_value = Math.max(0, iterationValue - 1);
      setIterationValue(new_value);
    }
  };

  async function handleAnimatePlay() {
    const pauseBtn = document.getElementById("animateStop");

    if (iterationValue != undefined && !animationIsRunning) {
      pauseBtn?.setAttribute("shouldStop", "false");
      setAnimationIsRunning(true);
      for (
        let iter = iterationValue;
        iter < spom.simulationSnapshots.length;
        iter++
      ) {
        if (pauseBtn?.getAttribute("shouldStop") === "false") {
          setIterationValue(iter);
          await new Promise((r) => setTimeout(r, 10));
        } else {
          pauseBtn?.setAttribute("shouldStop", "false");
          break;
        }
      }
      setAnimationIsRunning(false);
    }
  }

  const handleAnimateStop = () => {
    const pauseBtn = document.getElementById("animateStop");
    pauseBtn?.setAttribute("shouldStop", "true");
  };

  const onCreate = (pos: Vector2D) => {
    const new_id = spom.startingNetwork.createPatch(
      pos,
      inputValueA,
      inputValueO
    );
    updatePatchesData(spom.startingNetwork.patches);
    console.log("Created new patch with ID: " + new_id);
  };

  const onUpdate = (pos: Vector2D) => {
    setIterationValue(0);
    spom.simulationSnapshots = [];
    if (patchId != undefined) {
      spom.startingNetwork.updatePatchPosition(patchId, pos);
      const p = spom.startingNetwork.getPatch(patchId);

      handleUpdateReverse();
    }
  };

  const zoomIn = () => {
    setScale(1.5 * scale);
  };

  const zoomOut = () => {
    setScale(0.66 * scale);
  };

  function occupied_update(occupied: string) {
    if (patchId === undefined) {
      alert("Please choose a Patch");
      return;
    }
    let occupy = false;
    if (occupied == "true") {
      occupy = true;
    }
    setInputValueO(occupy);
    spom.startingNetwork.updatePatchOccupancy(patchId, occupy);
  }

  const handleSave = () => {
    const ta = document.getElementById(
      "descriptionTextArea"
    ) as HTMLTextAreaElement;
    const networkNameInput = document.getElementById(
      "networkNameInput"
    ) as HTMLInputElement;
    spom.startingNetwork.setDescription(ta.value);
    spom.startingNetwork.setNetworkName(networkNameInput.value);
    setSaveActive(false);
  };

  const checkSavable = () => {
    const ta = document.getElementById(
      "descriptionTextArea"
    ) as HTMLTextAreaElement;
    const networkNameInput = document.getElementById(
      "networkNameInput"
    ) as HTMLInputElement;
    setSaveActive(
      ta.value !== ta.defaultValue ||
        networkNameInput.value !== networkNameInput.defaultValue
    );
  };

  const handleIterationValue = (num: number) => {
    setInputValueSimulationEnd(num);
    // spom.simulate(inputValueReplicas, Number(event.target.value));
    spom.simulationSnapshots = spom.replicates[0].simulationSnapshots;
    if (num < iterationValue) {
      setIterationValue(num);
    }
    handle_iteration_update();
  };

  const handleReplicas = (num: number) => {
    setInputValueReplicas(num);
    // spom.simulate(Number(event.target.value), inputValueSimulationEnd);
    spom.simulationSnapshots = spom.replicates[0].simulationSnapshots;
  };

  const w = 300;
  const h = 200;

  return (
    <div className="h-screen bg-white text-black flex flex-col min-h-750 min-w-1300">
      <div className="grid grid-cols-12 w-full h-4/6 shadow-md">
        <div id="Network" className="col-span-5">
          <MainNetwork
            svg_id="patchView"
            network={patchesData}
            activePatch={patchId}
            scale={scale}
            onCreate={onCreate}
            setPatchID={setPatchID}
            onUpdate={onUpdate}
            setScale={setScale}
          />
          <div id="zoomBox" className="relative flex top-[-40px]">
            <div className="cursor-pointer" onClick={zoomOut}>
              <AiOutlineMinusSquare size={"1.5em"} />
            </div>
            <div className="cursor-pointer" onClick={zoomIn}>
              <AiOutlinePlusSquare size={"1.5em"} />
            </div>
          </div>
          <div id="iterDisplay" className="relative top-[-65px]">
            Current Iterate: {iterationValue}
          </div>
        </div>

        <div
          id="graphView"
          className="grid grid-cols-2 grid-rows-2 col-span-7 h-full w-full"
        >
          <StatsGraph
            className="bg-sky-200 subGraph"
            svg_id="occupiedAreaGraphSVG"
            title="Proportion of occupied area"
            width={w}
            height={h}
            x_label="Time (years)"
            y_label="pA"
            x_range={[0, inputValueSimulationEnd]}
            y_range={[0, 100]}
            data={OccupiedAreaGraphData}
            meanData={MeanOccupiedAreaGraphData}
          />
          <StatsGraph
            className="bg-blue-200 subGraph"
            svg_id="occupiedPatchesGraphSVG"
            title="Proportion of occupied patches"
            width={w}
            height={h}
            x_label="Time (years)"
            y_label="p"
            x_range={[0, inputValueSimulationEnd]}
            y_range={[0, 100]}
            data={OccupiedPatchesGraphData}
            meanData={MeanOccupiedPatchesGraphData}
          />
          <StatsGraph
            className="bg-blue-200 subGraph"
            svg_id="occupiedPatchesGraphSVG2"
            title="Proportion of surviving replicates"
            width={w}
            height={h}
            x_label="Time (years)"
            y_label="p"
            x_range={[0, inputValueSimulationEnd]}
            y_range={[0, 100]}
            data={ReplicateSurvivalGraphData}
          />
          <StatsGraph
            className="bg-sky-200 subGraph"
            svg_id="occupiedPatchesGraphSVG3"
            title="Turnover events"
            width={w}
            height={h}
            x_label="Time (years)"
            y_label="p"
            x_range={[0, inputValueSimulationEnd]}
            y_range={[0, spom.networkStats[2].max]}
            data={TurnoverEventsGraphData}
            meanData={MeanTurnoverEventsGraphData}
            m
          />
        </div>
      </div>

      <div id="allControls" className="mt-5 desktop:mt-14">
        {/* the operation section */}
        <div className="grid grid-cols-4">
          {/* the setting section on the left bottom */}
          <label
            htmlFor="my-modal-3"
            className="grid col-span-1 cursor-pointer self-end justify-self-start ml-3"
          >
            <AiOutlineSetting size="2.25em" />
          </label>
          {/* the display section of the setting */}
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal cursor-pointer">
            <div className="modal-box relative bg-white">
              <label
                htmlFor="my-modal-3"
                className="absolute right-10 cursor-pointer text-2xl text-dark-blue hover:bg-gray-200 px-2 rounded-full"
                onClick={() => {
                  const parameter_inputs = document.getElementsByClassName(
                    "parameter_input"
                  ) as HTMLCollectionOf<HTMLInputElement>;
                  for (let i = 0; i < parameter_inputs.length; i++) {
                    parameter_inputs[i].value =
                      parameter_inputs[i].defaultValue;
                  }
                  setActiveDropDown("");
                }}
              >
                ✕
              </label>
              <label>
                <h3 className="text-2xl font-bold text-main-blue mt-3 ml-3">
                  Simulation Settings
                </h3>
                {SETTING_DATA.map((setting, i) => (
                  <SmallDropDown
                    key={setting.equationName}
                    equationName={setting.equationName}
                    equation={setting.equation}
                    type={setting.type}
                    editableParameter={setting.editableParameter}
                    staticParameter={setting.staticParameter}
                    description={setting.description}
                    engine={spom.engine}
                    isOpen={activeDropDown === setting.equation}
                    setActiveDropDown={setActiveDropDown}
                    activeDropDown={activeDropDown}
                  />
                ))}
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 col-span-2 ">
            {/* patch control section */}
            <div className="grid col-span-1 grid-cols-3 gap-4">
              <div
                id="Occupancy"
                className="flex gap-7 justify-end items-center"
              >
                <label>Occupancy</label>
                <select
                  className="border-2 border-black bg-white"
                  value={String(inputValueO)}
                  onChange={(event) => occupied_update(event.target.value)}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div
                id="x"
                className="flex gap-5 items-center justify-center mr-1"
              >
                <label>X</label>
                <input
                  type="text"
                  onChange={(event) =>
                    setInputValueX(Number(event.target.value))
                  }
                  value={inputValueX}
                  className=" border-black border-2 text-center w-20 bg-white"
                />
              </div>
              <div id="y" className="flex gap-5 items-center justify-start">
                <label>Y</label>
                <input
                  type="text"
                  onChange={(event) =>
                    setInputValueY(Number(event.target.value))
                  }
                  value={inputValueY}
                  className="w-20 border-black border-2 text-center bg-white"
                />
              </div>
              <div id="area" className="flex gap-9 items-center justify-end">
                <label>Area</label>
                <input
                  type="text"
                  onChange={(event) =>
                    setInputValueA(Number(event.target.value))
                  }
                  value={inputValueA}
                  className=" border-black border-2 w-16 text-center bg-white"
                />
              </div>
              <div
                id="patch_id"
                className="flex gap-10 items-center justify-center col-start-2 col-end-4 mr-6"
              >
                <label>Patch ID</label>
                <input
                  type="text"
                  value={patchId}
                  className="w-20 border-2 border-black h-7 text-center bg-white"
                ></input>
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleDelete}
                  className="bg-button-delete rounded-full h-8 w-24 font-semibold"
                >
                  Delete
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleUpdate}
                  className="bg-button-edit rounded-full h-8 w-24 font-semibold"
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleCreate}
                  className="bg-button-new rounded-full h-8 w-24 font-semibold"
                >
                  New
                </button>
              </div>
            </div>
            {/* simulation control section*/}
            <div
              id="simulationControls"
              className="grid grid-rows-3 col-span-1 gap-4"
            >
              <div
                id="steps"
                className="flex items-center justify-center gap-9"
              >
                <label>Iterations</label>
                <input
                  type="number"
                  min={0}
                  className={`w-32 border-2 border-black bg-white h-6 ${
                    animationIsRunning ? "bg-gray-100 text-gray-300" : ""
                  }`}
                  value={inputValueSimulationEnd}
                  onChange={(event) =>
                    handleIterationValue(Number(event.target.value))
                  }
                  disabled={animationIsRunning}
                />
              </div>
              <div
                id="replicates"
                className="flex items-center justify-center gap-8"
              >
                <label>Replicates</label>
                <input
                  type="number"
                  min={1}
                  className={`w-32 border-2 border-black h-6 bg-white ${
                    animationIsRunning ? "bg-gray-100 text-gray-300" : ""
                  }`}
                  value={inputValueReplicas}
                  onChange={(event) =>
                    handleReplicas(Number(event.target.value))
                  }
                  disabled={animationIsRunning}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <div
                  className={"cursor-pointer tooltip"}
                  data-tip="Restart"
                  onClick={handleSimulate}
                >
                  <IoMdRefresh size={"2.25em"} />
                </div>
                <div
                  className={animationIsRunning ? "" : "cursor-pointer tooltip"}
                  data-tip="Backward"
                  onClick={animationIsRunning ? undefined : handleBackwards}
                >
                  <AiFillStepBackward
                    size={"2.25em"}
                    color={animationIsRunning ? "gray" : "black"}
                  />
                </div>
                {animationIsRunning ? (
                  <div
                    className="cursor-pointer tooltip"
                    data-tip="Stop"
                    onClick={handleAnimateStop}
                  >
                    <AiOutlinePause size="2.25em" />
                  </div>
                ) : (
                  <div
                    className="cursor-pointer tooltip"
                    data-tip="Start"
                    onClick={handleAnimatePlay}
                  >
                    <BsFillCaretRightFill size={"2.25em"} />
                  </div>
                )}
                <div
                  className={animationIsRunning ? "" : "cursor-pointer tooltip"}
                  data-tip="Forward"
                  onClick={animationIsRunning ? undefined : handleForwards}
                >
                  <AiFillStepForward
                    size={"2.25em"}
                    color={animationIsRunning ? "gray" : "black"}
                  />
                </div>
                <div className={"cursor-pointer tooltip"} data-tip="Skip">
                  <BsFillSkipForwardFill size={"2.25em"} onClick={handleSkip} />
                </div>
              </div>
            </div>
          </div>
          {/* the right bottom section */}
          <div className="grid col-span-1 self-end justify-self-end right-2 desktop:right-4 bottom-2 mr-3 font-bold w-50 desktop:w-64">
            <p className="text-base">
              Scene Name: {spom.startingNetwork.meta.name}
            </p>
            <label htmlFor="my-modal">
              <div className="border-2 border-black rounded-lg text-center cursor-pointer mt-1">
                <p>Description</p>
              </div>
            </label>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal cursor-pointer">
              <div className="modal-box relative bg-white">
                <label
                  htmlFor="my-modal"
                  className="absolute right-5 top-3 cursor-pointer text-2xl text-dark-blue hover:bg-gray-200 px-2 rounded-full"
                  onClick={() => {
                    const ta = document.getElementById(
                      "descriptionTextArea"
                    ) as HTMLTextAreaElement;
                    const networkNameInput = document.getElementById(
                      "networkNameInput"
                    ) as HTMLInputElement;
                    ta.value = ta.defaultValue;
                    networkNameInput.value = networkNameInput.defaultValue;
                    setSaveActive(false);
                  }}
                >
                  ✕
                </label>
                <label className="flex flex-col">
                  <input
                    type="text"
                    id="networkNameInput"
                    className="text-2xl font-bold text-main-blue my-2 text-left w-5/6 mr-5"
                    defaultValue={spom.startingNetwork.meta.name}
                    onChange={checkSavable}
                    placeholder="Network name..."
                  />
                  <textarea
                    id="descriptionTextArea"
                    className="textarea textarea-bordered w-full h-40 font-thin pt-2 bg-white"
                    placeholder="Description..."
                    defaultValue={spom.startingNetwork.meta.description}
                    onChange={checkSavable}
                  ></textarea>
                  <button
                    className={`${
                      saveActive
                        ? "bg-main-blue text-white"
                        : "bg-gray-500 text-gray-400"
                    }  font-medium rounded-lg h-9 w-14 cursor-pointer text-center float-left mt-2`}
                    id="saveDescription"
                    onClick={handleSave}
                    disabled={!saveActive}
                  >
                    Save
                  </button>
                </label>
              </div>
            </div>
            <ExportBtn spom={spom}></ExportBtn>
          </div>
        </div>
      </div>
      <div id="animateStop"></div>
    </div>
  );
};

export default Action;
