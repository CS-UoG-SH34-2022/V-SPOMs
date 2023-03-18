import { MetaOptions } from "../../@types/metaOptions";
import { Patch } from "../../@types/patch";
import { Network } from "../../models/network";

export interface IDispersalSettings{
    alpha: number;
    beta: number;
    type: DispersalType;

}

export enum DispersalType{
    Hanski1999 = "Hanski1999",
    Shaw1994 = "Shaw1994"
}

export abstract class BaseDispersalFunction{
    
    static DISPERSAL_PARAMETER_TYPES = {
        'a': 'a',
        'b': 'b',
    }

    static DEFAULT_META = { "name": "Dispersal Function", "description": "" };
    static DEFAULT_ALPHA = 0.0011;
    static DEFAULT_BETA = 1;

    public alpha:number;//The distribution of dispersal distances
    public beta:number;//The distribution of dispersal distances
    public meta:MetaOptions;
    public type:DispersalType;

    constructor(opt?:IDispersalSettings){
        this.meta = BaseDispersalFunction.DEFAULT_META;
        if(opt)
        {
            this.alpha = opt.alpha ?? BaseDispersalFunction.DEFAULT_ALPHA;
            this.beta = opt.beta ?? BaseDispersalFunction.DEFAULT_BETA;
        }
        else{
            this.alpha = BaseDispersalFunction.DEFAULT_ALPHA;
            this.beta  = BaseDispersalFunction.DEFAULT_BETA;
        }
    }

    /**
     * 
     * @param d_ij - the distance between patch i and j
     * @returns - the dispersal between patch i and j
     * 
     */
    public abstract dispersalFunction(d_ij:number): number;

    public calculateDispersal(network: Network):number[][]
    {
        const dispersals:number[][] = [];
        const distances = Patch.getDistancesToPatches(network);
        //iterate through 
        for(let i = 0; i < network.patches.length; i++) {
            dispersals[i] = [];
            for(let j = 0; j< network.patches.length; j++) {
                dispersals[i][j] = this.dispersalFunction(distances[i][j]);
            }
        }
        return dispersals;
    }


    public returnInterfaces():IDispersalSettings {
        const param:IDispersalSettings = {"alpha": this.alpha,"beta":this.beta,"type":this.type};
        return param;
    }

    public setAlpha(alpha:number){
        this.alpha = alpha;
    }

    public setBeta(beta:number){
        this.beta = beta;
    }

}


