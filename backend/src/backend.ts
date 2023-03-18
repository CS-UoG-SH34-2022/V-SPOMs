import { IEngineOptions } from "./engine/base";
import { EngineFactory } from "./engine/engineFactory";
import { SPOM, ICreateSPOMParameters } from "./spom"; 
import { MetaOptions } from "./@types/metaOptions";
import { IPatch } from "./@types/patch";
import { Network } from "./models/network";



export interface INetworkOptions{
    meta?: MetaOptions;
    patches?: IPatch[];
}

export interface IBackendSPOMOptions {
    meta?: MetaOptions;
    engine?: IEngineOptions;
    network?: INetworkOptions;
}

/**
 * Construct a SPOM.
 * @param {(ICreateSPOMOpts)} opts the configuration options for this SPOM.
 * @return {SPOM} a new SPOM.
 */
export function createSPOM(opts?: IBackendSPOMOptions): SPOM{

    opts = opts ?? {};

    //assign meta value from options, if empty provide default
    const meta = opts.meta ?? {name: "Default Spom",description: ""};
    
    //create the engine from the engine options
    const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
    const engine = engineFactory.setEngine(opts.engine ?? {});

    // create the network
    const network = new Network(opts.network);

    //intially set up spom properties from the options passed in
    const initializedSPOMParameters: ICreateSPOMParameters = {
        meta: meta,
        engine: engine,
        network: network,
    }
    network.offsetPatchesToSpawnPoint();
    return new SPOM(initializedSPOMParameters);
}