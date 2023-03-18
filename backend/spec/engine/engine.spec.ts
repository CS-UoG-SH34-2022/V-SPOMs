import { EngineFactory } from "../../src/engine/engineFactory";
import { IBackendSPOMOptions } from "../../src/backend";
import { Engine } from "../../src/engine/engine";
import { SimulationType } from "../../src/models/simulation";
import { BaseColonizationFunction, ColonisationType, IColonizationSettings } from "../../src/functions/colonisation/base";
import { BaseConnectivityFunction, ConnectivityType, IConnectivitySettings } from "../../src/functions/connectivity/base";
import { BaseIntrinsicExtinctionFunction, ExtinctionType, IExtinctionSettings } from "../../src/functions/intrinsic-extinction/base";
import { BaseDispersalFunction, DispersalType, IDispersalSettings } from "../../src/functions/dispersal/base";
import { IEngineOptions, IEngineParams } from "../../src/engine/base";
import { Hanski1999 } from "../../src/functions/dispersal/hanski1999";
import { MolianenA2004 } from "../../src/functions/connectivity/molianenA2004";
import { HanskiA1994 } from "../../src/functions/colonisation/hanskiA1994";
import { Hanski2002 } from "../../src/functions/intrinsic-extinction/hanski2002";
import { CorrelatedExtinctionFunction } from "../../src/functions/correlatedExtinction/correlatedExtinction";
import { IteratorSimulation } from "../../src/models/iteratorSimulation";


describe("Default Engine", ()=>{

  'given no input for the engine options'
  const opts: IBackendSPOMOptions = {};
  'when generating the engine'
  const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
  let engine = engineFactory.setEngine(opts.engine ?? {});

  const defaultConfig: IEngineOptions = {
    meta: {"name":"Default Engine",description:"The Default Engine"},
    dispersalFunction: {"alpha": BaseDispersalFunction.DEFAULT_ALPHA,"beta":BaseDispersalFunction.DEFAULT_BETA,"type":DispersalType.Hanski1999},
    connectivityFunction: {"b": BaseConnectivityFunction.DEFAULT_B,"type": ConnectivityType.MolianenA2004},
    colonizationFunction: {"y":BaseColonizationFunction.DEFAULT_Y,"type":ColonisationType.HanskiA1994},
    intrinsicExtinctionFunction: {"e":BaseIntrinsicExtinctionFunction.DEFAULT_E,"x":BaseIntrinsicExtinctionFunction.DEFAULT_X,"type":ExtinctionType.Hanski2002},
    correlatedExtinctionFunction: {"c":CorrelatedExtinctionFunction.DEFAULT_C},
    simulationType: SimulationType.Iterator,
  }

  afterEach(()=>{
    engine = engineFactory.setEngine(opts.engine ?? {});
  })

  it("should have the default engine meta data", () => {
    expect(engine).toBeInstanceOf(Engine);
    expect(engine).toHaveProperty('meta.name', 'Default Engine');
    expect(engine).toHaveProperty('meta.description', 'The Default Engine');
  });

  it("should contain the defualt mathematical functions", () => {
    expect(engine.colonizationFunction).toBeInstanceOf(BaseColonizationFunction);
    expect(engine.connectivityFunction).toBeInstanceOf(BaseConnectivityFunction);
    expect(engine.dispersalFunction).toBeInstanceOf(BaseDispersalFunction);
    expect(engine.intrinsicExtinctionFunction).toBeInstanceOf(BaseIntrinsicExtinctionFunction);
  });

  it("should contain the default simulation type", () =>{
    expect(engine.simulation).toHaveProperty("simulationType", SimulationType.Iterator);
    expect(engine.simulation).toHaveProperty("startTime",0);
    expect(engine.simulation).toHaveProperty("endTime", 100);
    expect(engine.simulation).toHaveProperty("timeIncrement", 1);
    
  });

  it("should correctly return the configuration of the engine", () =>{
    expect(engine.getConfig()).toEqual(defaultConfig);
  });

  it("should correctly set the probabilitiy functions", () =>{
    const providedConfig: IEngineParams = {
      meta: { "name": "Default Engine", description: "The Default Engine" },
      connectivityFunction: new MolianenA2004(),
      colonizationFunction: new HanskiA1994(),
      intrinsicExtinctionFunction: new Hanski2002(),
      correlatedExtinctionFunction: new CorrelatedExtinctionFunction(),
      dispersalFunction: new Hanski1999(),
      simulation: new IteratorSimulation(),
    }
    engine.setProbabilityFunctions(providedConfig);
    expect(engine.connectivityFunction).toEqual( new MolianenA2004());
    expect(engine.colonizationFunction).toEqual( new HanskiA1994());
    expect(engine.intrinsicExtinctionFunction).toEqual( new Hanski2002());
    expect(engine.correlatedExtinctionFunction).toEqual( new CorrelatedExtinctionFunction());
    expect(engine.dispersalFunction).toEqual( new Hanski1999());
  });

  it("should correctly set the engine", () =>{
    const providedConfig: IEngineOptions = {
      meta: {"name":"Default Engine",description:"The Default Engine"},
      dispersalFunction: {"alpha": 10,"beta":123,"type":DispersalType.Hanski1999},
      connectivityFunction: {"b": 12,"type": ConnectivityType.MolianenA2004},
      colonizationFunction: {"y":13,"type":ColonisationType.HanskiA1994},
      intrinsicExtinctionFunction: {"e":10,"x":12,"type":ExtinctionType.Hanski2002},
      correlatedExtinctionFunction: {"c":100},
      simulationType: SimulationType.Iterator,
    }
    engine = engineFactory.setEngine(providedConfig)
    expect(engine.getConfig()).toEqual(providedConfig);
  });

  it("it should correctly assign the functions from an interface", ()=>{

    const dispersalFunction:IDispersalSettings =  {"alpha": 10,"beta":10,"type":DispersalType.Hanski1999};
    const connectivityFunction:IConnectivitySettings = {"b":10,"type": ConnectivityType.MolianenA2004};
    const colonizationFunction:IColonizationSettings = {"y":10,"type":ColonisationType.HanskiA1994};
    const intrinsicExtinctionFunction:IExtinctionSettings = {"e":10,"x":10,"type":ExtinctionType.Hanski2002};
    expect(engineFactory.setColonisationType(colonizationFunction)).toEqual(ColonisationType.HanskiA1994);
    expect(engineFactory.setDispersalType(dispersalFunction)).toEqual(DispersalType.Hanski1999);
    expect(engineFactory.setConnectivityType(connectivityFunction)).toEqual(ConnectivityType.MolianenA2004);
    expect(engineFactory.setExtinctionType(intrinsicExtinctionFunction)).toEqual(ExtinctionType.Hanski2002);
  })
});

