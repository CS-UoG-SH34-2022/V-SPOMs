//functions to include
//gen patches to remove
//determine number to remove
import { MetaOptions } from "../../@types/metaOptions";
import { Network } from "../../models/network";

export interface ICorrelatedExtinctionSettings{
    c: number;
}

export class CorrelatedExtinctionFunction{

    static CORRELATED_EXTINCTION_PARAMETER_TYPES = {
        'c': 'c'
    }

    static DEFAULT_C = 50;
    static DEFAULT_META = { "name": "Correlated Extinction Function", "description": "" };

    public c:number;//scaling value of emigration as a function of area
    public meta:MetaOptions;
    
    constructor(opt?:ICorrelatedExtinctionSettings){
        this.meta = CorrelatedExtinctionFunction.DEFAULT_META;
        if(opt)
        {
            this.c = opt.c?? CorrelatedExtinctionFunction.DEFAULT_C;
        }
        else{
            this.c = CorrelatedExtinctionFunction.DEFAULT_C;
        }
    }

    public findlocalPatches(network:Network): Network{
        
        for(const currentPatch of network.patches)
        {
            currentPatch.localPatches = []
            const radius = (Math.sqrt(currentPatch.area/Math.PI))*this.c;
            for(const innerPatch of network.patches)
            {
                if(innerPatch!=currentPatch)
                {
                    if(network.getDistanceBetweenPatch(currentPatch,innerPatch)<radius)
                    {
                        currentPatch.localPatches.push(innerPatch)
                    }
                }
            }
        }
        return network;
    }

    public returnInterfaces():ICorrelatedExtinctionSettings {
        const param:ICorrelatedExtinctionSettings = {"c": this.c};
        return param;
    }
    
    public setC(c:number){
        this.c = c;
    }
}