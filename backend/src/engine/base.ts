/**
 * Base type for Engine implementations
 * 
 * @abstract_class Engine
 */

import { MetaOptions } from "../@types/metaOptions";
import { Simulation, SimulationType } from "../models/simulation";
import { BaseColonizationFunction } from "../functions/colonisation/base";
import { BaseConnectivityFunction } from "../functions/connectivity/base";
import { BaseDispersalFunction } from "../functions/dispersal/base"; 
import { BaseIntrinsicExtinctionFunction, IExtinctionSettings } from "../functions/intrinsic-extinction/base";
import { IColonizationSettings } from "../functions/colonisation/base";
import { IConnectivitySettings } from "../functions/connectivity/base";
import { IDispersalSettings } from "../functions/dispersal/base";
import { CorrelatedExtinctionFunction, ICorrelatedExtinctionSettings } from "../functions/correlatedExtinction/correlatedExtinction";

export interface IEngineParams{
    meta: MetaOptions;
    simulation: Simulation;
    dispersalFunction: BaseDispersalFunction;
    connectivityFunction: BaseConnectivityFunction;
    colonizationFunction: BaseColonizationFunction;
    intrinsicExtinctionFunction: BaseIntrinsicExtinctionFunction;
    correlatedExtinctionFunction:CorrelatedExtinctionFunction;
}

// TODO: Use Partial<IEngineParams> here
export interface IEngineOptions{
    meta?: MetaOptions;
    simulationType?: SimulationType;
    dispersalFunction?: IDispersalSettings;
    connectivityFunction?: IConnectivitySettings;
    colonizationFunction?: IColonizationSettings;
    intrinsicExtinctionFunction?: IExtinctionSettings;
    correlatedExtinctionFunction?: ICorrelatedExtinctionSettings;
}

export const AVAILABLE_SETTINGS = {
    'dispersalFunction': 'dispersalFunction',
    'connectivityFunction': 'connectivityFunction',
    'colonizationFunction': 'colonizationFunction',
    'intrinsicExtinctionFunction': 'intrinsicExtinctionFunction',
    'correlatedExtinctionFunction': 'correlatedExtinctionFunction',
}

export const AVAILABLE_SETTING_CLASSES = {
    'dispersalFunction': BaseDispersalFunction,
    'connectivityFunction': BaseConnectivityFunction,
    'colonizationFunction': BaseColonizationFunction,
    'intrinsicExtinctionFunction': BaseIntrinsicExtinctionFunction,
    'correlatedExtinctionFunction': CorrelatedExtinctionFunction,
}

export abstract class AbstractEngine{
    public meta: MetaOptions;
    public synchronous:boolean;
    public simulation: Simulation;

    public dispersalFunction: BaseDispersalFunction;
    public connectivityFunction: BaseConnectivityFunction;
    public colonizationFunction: BaseColonizationFunction;
    public intrinsicExtinctionFunction: BaseIntrinsicExtinctionFunction;
    public correlatedExtinctionFunction: CorrelatedExtinctionFunction;

    constructor(opts: IEngineParams){
        this.meta = opts.meta;
        this.simulation = opts.simulation;
        
        this.setProbabilityFunctions(opts);
    }

    public getConfig():IEngineOptions{
        // Default function type options - awaiting refactor
        const options: IEngineOptions = {
            meta: this.meta,
            simulationType: this.simulation.simulationType,
            dispersalFunction: this.dispersalFunction.returnInterfaces(),
            connectivityFunction: this.connectivityFunction.returnInterfaces(),
            colonizationFunction: this.colonizationFunction.returnInterfaces(),
            intrinsicExtinctionFunction: this.intrinsicExtinctionFunction.returnInterfaces(),
            correlatedExtinctionFunction: this.correlatedExtinctionFunction.returnInterfaces()
        }
        return options;
    }
    // Loses type data, since returns the parent type.
    public abstract setProbabilityFunctions(opts: IEngineParams): void;
    
}