import { EngineFactory } from "../../src/engine/engineFactory";
import { IBackendSPOMOptions } from "../../src/backend";
import { Engine } from "../../src/engine/engine";
import { SimulationType } from "../../src/models/simulation";
import { IteratorSimulation } from "../../src/models/iteratorSimulation";
import fs from 'fs';
import path from 'path';
import { FileHandler } from '../../src/models/fileHandler';
import { Network } from '../../src/models/network'
import { ISimulationParameters} from '../../src/models/simulation';

describe("Iterative Simuation", ()=>{

  'given the generation of a default iterator simulation'
  const file_path = path.join(path.dirname(__dirname), "/", "test_spom.json");
  const text = fs.readFileSync(file_path, {encoding:"utf8"});
  const config = FileHandler.textToConfig(text,"json");

  'given the generation of a default iterator simulation'
  const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
  const engine = engineFactory.setEngine(config.engine ?? {}); 
  
  it("should contain the correct default simulation options", () => {
    expect(engine.simulation).toHaveProperty('meta.name', 'Iterative Simulator');
    expect(engine.simulation).toHaveProperty('meta.description', '');
    expect(engine.simulation).toBeInstanceOf(IteratorSimulation);
    expect(engine.simulation).toHaveProperty('simulationType',SimulationType.Iterator);
    expect(engine.simulation).toHaveProperty('startTime', 0);
    expect(engine.simulation).toHaveProperty('endTime', 100);
    expect(engine.simulation).toHaveProperty('timeIncrement', 1);
  });
});

describe("Updating The Simuation", ()=>{

  'given the generation of a default iterator simulation'
  const opts: IBackendSPOMOptions = {"engine":{"simulationType":SimulationType.Iterator}};
  const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
  const engine: Engine = engineFactory.setEngine(opts.engine ?? {}); 

  'when the values of the simulation are updated'
  const simulationParams: ISimulationParameters = {
    meta: { name: "Updated Simulation", description: "Values of Simulation have been updated" },
    startTime: 10,
    endTime: 100,
    timeIncrement: 10
  }
  engine.simulation.setSimulation(simulationParams);

  it("should contain the correct new simulation options", () => {
    expect(engine.simulation).toHaveProperty('meta.name', 'Updated Simulation');
    expect(engine.simulation).toHaveProperty('meta.description', 'Values of Simulation have been updated');
    expect(engine.simulation).toHaveProperty('startTime', 10);
    expect(engine.simulation).toHaveProperty('endTime', 100);
    expect(engine.simulation).toHaveProperty('timeIncrement', 10);
  });
  
  it("should have reasonable values for the time attributes", () =>{
    expect(engine.simulation.startTime).toBeGreaterThanOrEqual(0);
    expect(engine.simulation.endTime).toBeGreaterThan(engine.simulation.startTime);
    const runningTime: number = engine.simulation.endTime - engine.simulation.startTime;
    expect(engine.simulation.timeIncrement).toBeLessThan(runningTime);

  });
});

describe("Running The Iterative Simulation", () =>{

  const file_path = path.join(path.dirname(__dirname), "/", "test_spom.json");
  const text = fs.readFileSync(file_path, {encoding:"utf8"});
  const config = FileHandler.textToConfig(text,"json");

  'given the generation of a default iterator simulation'
  const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
  const engine = engineFactory.setEngine(config.engine ?? {}); 

  'and provided a test network'
  const networkOptions = config.network;
  const network = new Network(networkOptions);

  'when the iterative simulation is ran'
  const generatedNetworks: Network[] = engine.simulation.runSimulation(engine,network);

  it("should contain the correct number of network snapshots", () => {
    expect(generatedNetworks).toHaveLength(100);
  });

  it("should contain the same patches as the original network", () =>{
   // generatedNetworks[0].
  });
});


  // //move to custom simulation test
