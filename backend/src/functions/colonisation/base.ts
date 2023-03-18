import { MetaOptions } from "../../@types/metaOptions";
import { Network } from "../../models/network";


export interface IColonizationSettings{
    y:number;
    type:ColonisationType;
}

export enum ColonisationType{
    HanskiA1994 = "HanskiA1994",
    HanskiB1994 = "HanskiB1994"
}


export abstract class BaseColonizationFunction{
    
    static COLONIZATION_PARAMETER_TYPES = {
        'y': 'y'
    }

    static DEFAULT_Y = 5.22;
    static DEFAULT_META = {"name":"Colonization Function","description":"Deefault colonization function"};

    public y:number; //scalar parameter to affect probability of colonization
    public meta:MetaOptions;
    public type:ColonisationType;

    constructor(opt?:IColonizationSettings){
        this.meta = BaseColonizationFunction.DEFAULT_META;
        if(opt)
        {
            this.y = opt.y ?? BaseColonizationFunction.DEFAULT_Y;
        }
        else{
            this.y = BaseColonizationFunction.DEFAULT_Y;
        }
    }

    /**
     * 
     * @param s_i - the connectivity of the current patch
     * @returns - the probability of the current patch being reached
     * 
     */
    public abstract colonizationFunction(s_i: number):number;

    public getConnectivity(network:Network, patchID: number):number{
        return network.connectivity[patchID];
    }

    public calculateOnce(network: Network, patchID: number): number {
        const connectivity = this.getConnectivity(network, patchID);
        return this.colonizationFunction(connectivity);
    }

    public calculateAll(network: Network,patchIDs: number[]): number[] {
        // Simple implementation for calculating the probability by mapping each variable to result array using the function.
        const connectivities = patchIDs.map(function(patchID) { return this.getConnectivity(network, patchID);});
        const result = connectivities.map(this.colonizationFunction);
        return result;
    }

    public returnInterfaces():IColonizationSettings {
        const param: IColonizationSettings = {"y":this.y,"type":this.type};
        return param;
    }

    public setY(y:number){
        this.y = y;
    }

}

