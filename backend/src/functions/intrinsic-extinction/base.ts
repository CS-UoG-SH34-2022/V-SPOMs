import { MetaOptions } from "../../@types/metaOptions";
import { Network } from "../../models/network";

export interface IExtinctionSettings{
    e: number;
    x: number;
    type:ExtinctionType;

}

export enum ExtinctionType{
    Hanski2002 = "Hanski2002"
}

export abstract class BaseIntrinsicExtinctionFunction{

    static INTRINSIC_EXTINCTION_PARAMETER_TYPES = {
        'x': 'x',
        'e': 'e',
    }

    static DEFAULT_X = 1;
    static DEFAULT_E = 90;
    static DEFAULT_META = { "name": "Intrinsic Extinction Function", "description": "" };

    public e:number; //the extinction probability in a patch of a unit area
    public x:number; //the scaling extinction risk with patch area value
    public meta: MetaOptions;
    public type:ExtinctionType

    constructor(opt?:IExtinctionSettings){

        this.meta = BaseIntrinsicExtinctionFunction.DEFAULT_META;
        if(opt)
        {
            this.x = opt.x ?? BaseIntrinsicExtinctionFunction.DEFAULT_X;
            this.e = opt.e ?? BaseIntrinsicExtinctionFunction.DEFAULT_E;
        }
        else{
            this.x = BaseIntrinsicExtinctionFunction.DEFAULT_X;
            this.e = BaseIntrinsicExtinctionFunction.DEFAULT_E;        
        }
    }

    /**
     * 
     * @param area - area of the patch
     * @returns - the probability a patch will go extinct
     * 
     */
    public abstract extinctionFunction(area:number):number;


    public calculateOnce(network:Network, patchID: number): number {
        return this.extinctionFunction(network.patches[patchID].area);
    }

    public calculateAll(network:Network): number[] { // eslint-disable-line @typescript-eslint/no-unused-vars
        const intrinsicExtinctions: number[] =[];
        for(let i =0;i<network.patches.length;i++)
        {
            intrinsicExtinctions.push(this.extinctionFunction(network.patches[i].area))
        }
        return intrinsicExtinctions;
    }

    public returnInterfaces(): IExtinctionSettings
    {
        const param: IExtinctionSettings = {"e":this.e,"x":this.x,"type":this.type};
        return param;
    }
    
    public setE(e: number){
        this.e = e;
    }

    public setX(x:number){
        this.x = x;
    }

}