/**
 * Abstaction for probability functions used by Engine
 * 
 * @interface ProbabilityFunction
 */

import { MetaOptions } from "../@types/metaOptions";
import { Network } from "../models/network";
import { IColonizationSettings } from "./colonisation/base";
import { IConnectivitySettings } from "./connectivity/base";
import { IDispersalSettings } from "./dispersal/base";
import { IExtinctionSettings } from "./intrinsic-extinction/base";

export enum MathematicalFunctionType{
    DefaultColonizationFunction = "DefaultColonizationFunction",
    DefaultConnectivityFunction = "DefaultConnectivityFunction",
    DefaultDispersalFunction = "DefaultDispersalFunction",
    DefaultIntrinsicExtinctionFunction = "DefaultIntrinsicExtinctionFunction",
}

export interface IAllFunctionParams{
    "IConnectivitySettings":IConnectivitySettings;
    "IColonizationSettings":IColonizationSettings;
    "IDispersalSettings":IDispersalSettings;
    "IExtinctionSettings":IExtinctionSettings;
}

export abstract class MathematicalFunction{
    
    protected meta:MetaOptions;
    protected constants: number[];
    protected network: Network;
    protected artifacts: number[][]; // Used to extract data generated during evaluation.

    constructor(opts?: MetaOptions)
    {
        this.meta = opts || {"name":"default Function","description":""};
    }

    // Update constants before evaluating function
    public updateLocalNetwork(network?: Network){
        this.network = network ?? this.network;
    }

    // Validate required constants from the constants array.

    public getArtifacts(): number[][]{ // Getter for fetching artifact data
        return this.artifacts;
    }
    

    // Evaluate the mathematical function once
    public abstract calculateOnce(patchID: number): number

    // Evaluate the mathematical function for an array of values (multithreaded?)
    public abstract calculateAll(patchIDs: number[]): number[]

    public abstract returnInterfaces(): unknown;
    public abstract setConstanstantsByInterface(opt:unknown);

}
