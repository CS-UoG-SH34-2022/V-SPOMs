
import { Engine } from "./engine";
import { SimulationType } from "../models/simulation";
import { IEngineOptions, IEngineParams } from "./base";
import { IteratorSimulation } from "../models/iteratorSimulation";

import { ColonisationType, IColonizationSettings } from "../functions/colonisation/base";
import { HanskiA1994 } from "../functions/colonisation/hanskiA1994";
import { HanskiB1994 } from "../functions/colonisation/hanskiB1994";

import { ConnectivityType, IConnectivitySettings } from "../functions/connectivity/base";
import { MolianenA2004 } from "../functions/connectivity/molianenA2004";
import { MolianenB2004 } from "../functions/connectivity/molianenB2004";

import { ExtinctionType, IExtinctionSettings } from "../functions/intrinsic-extinction/base";
import { Hanski2002 } from "../functions/intrinsic-extinction/hanski2002";

import { DispersalType, IDispersalSettings } from "../functions/dispersal/base"; 
import { Hanski1999} from "../functions/dispersal/hanski1999"
import { Shaw1994} from "../functions/dispersal/shaw1994"

import { CorrelatedExtinctionFunction } from "../functions/correlatedExtinction/correlatedExtinction"; 

export const DiserpersalFunctionTypeLookUpTable = {
    [DispersalType.Hanski1999]: Hanski1999,
    [DispersalType.Shaw1994]: Shaw1994,
}

export const ConnectivityFunctionTypeLookUpTable = {
    [ConnectivityType.MolianenA2004]: MolianenA2004,
    [ConnectivityType.MolianenB2004]: MolianenB2004,
}

export const ColonisationFunctionTypeLookUpTable = {
    [ColonisationType.HanskiA1994]: HanskiA1994,
    [ColonisationType.HanskiB1994]: HanskiB1994,
}

export const ExtinctionFunctionTypeLookUpTable = {
    [ExtinctionType.Hanski2002]: Hanski2002,
}

export const SimulationLookupTable = {
    [SimulationType.Iterator]: IteratorSimulation,
    [SimulationType.Gillespie]: IteratorSimulation,
    [SimulationType.Null]: IteratorSimulation,
}

//Singleton factory creation, only want one possible engine so we can only generate them here
export class EngineFactory{

    private static uniqueEngineFactory: EngineFactory;

    private constructor(){
        //do nothing.
    }

    public static getEngineFactory(): EngineFactory
    {
        if(EngineFactory.uniqueEngineFactory == null)
        {
            EngineFactory.uniqueEngineFactory = new EngineFactory();
        }
        return EngineFactory.uniqueEngineFactory;
    }

    /**
     * 
     * @param opts - interface for all the options on how we wannt to define the engine
     * 
     * During the function we implement a concrete engine not just what options we want (these may be not full)
     * 
     * @returns - Singleton factory, class will only have one active engine, we return the engine class
     */
    public setEngine(opts: IEngineOptions): Engine
    {
        const colonisationTypeParam: ColonisationType = this.setColonisationType(opts.colonizationFunction);
        const connectivityTypeParam: ConnectivityType = this.setConnectivityType(opts.connectivityFunction);
        const ExtinctionTypeParam: ExtinctionType = this.setExtinctionType(opts.intrinsicExtinctionFunction);
        const DispersalTypeParam: DispersalType = this.setDispersalType(opts.dispersalFunction);

        const engineParams:IEngineParams = {
            meta: opts.meta ?? {name: "Default Engine",description: "The Default Engine"},
            dispersalFunction: new DiserpersalFunctionTypeLookUpTable[DispersalTypeParam](opts.dispersalFunction),
            connectivityFunction: new ConnectivityFunctionTypeLookUpTable[connectivityTypeParam](opts.connectivityFunction),
            colonizationFunction: new ColonisationFunctionTypeLookUpTable[colonisationTypeParam](opts.colonizationFunction),
            intrinsicExtinctionFunction: new ExtinctionFunctionTypeLookUpTable[ExtinctionTypeParam](opts.intrinsicExtinctionFunction),
            correlatedExtinctionFunction: new CorrelatedExtinctionFunction(opts.correlatedExtinctionFunction),
            simulation: new SimulationLookupTable[opts.simulationType ?? SimulationType.Null],
        };

        const returnEngine: Engine = new Engine(engineParams);

        return returnEngine;
    }

    public setColonisationType(colonizationFunction:IColonizationSettings): ColonisationType
    {
        if(colonizationFunction && colonizationFunction.type)
        {
            return colonizationFunction.type
        }
        return ColonisationType.HanskiA1994
    }
    public setConnectivityType(connectivityFunction:IConnectivitySettings): ConnectivityType
    {
        if(connectivityFunction && connectivityFunction.type)
        {
            return connectivityFunction.type
        }
        return ConnectivityType.MolianenA2004 
    }
    public setExtinctionType(extinctionFunction:IExtinctionSettings): ExtinctionType
    {
        if(extinctionFunction && extinctionFunction.type)
        {
            return extinctionFunction.type
        }
        return ExtinctionType.Hanski2002 
    }
    public setDispersalType(dispersalFunction:IDispersalSettings): DispersalType
    {
        if(dispersalFunction && dispersalFunction.type)
        {
            return dispersalFunction.type
        }
        return DispersalType.Hanski1999
    }
}