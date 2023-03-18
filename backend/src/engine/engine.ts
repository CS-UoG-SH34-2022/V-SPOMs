import { AbstractEngine, IEngineParams } from "./base";


export class Engine extends AbstractEngine{

    //Get and Sets
    public setProbabilityFunctions(opts: IEngineParams) {
        this.dispersalFunction = opts.dispersalFunction;
        this.connectivityFunction = opts.connectivityFunction;
        this.colonizationFunction = opts.colonizationFunction;
        this.intrinsicExtinctionFunction = opts.intrinsicExtinctionFunction;
        this.correlatedExtinctionFunction = opts.correlatedExtinctionFunction;
    }

}