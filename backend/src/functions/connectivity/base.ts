import { MetaOptions } from "../../@types/metaOptions";
import { Network } from "../../models/network";

export interface IConnectivitySettings{
    b: number;
    type:ConnectivityType;

}

export enum ConnectivityType{
    MolianenA2004 = "MolianenA2004",
    MolianenB2004 = "MolianenB2004"
}

export abstract class BaseConnectivityFunction{

    static CONNECTIVITY_PARAMETER_TYPES = {
        'b': 'b'
    }

    static DEFAULT_B = 1;
    static DEFAULT_META = { "name": "Connectivity Function", "description": "" };

    public b:number;//scaling value of emigration as a function of area
    public meta:MetaOptions;
    public type:ConnectivityType;
    
    constructor(opt?:IConnectivitySettings){
        this.meta = BaseConnectivityFunction.DEFAULT_META;
        if(opt)
        {
            this.b = opt.b ?? BaseConnectivityFunction.DEFAULT_B;
        }
        else{
            this.b = BaseConnectivityFunction.DEFAULT_B;
        }
    }

    /**
     * 
     * @param area - the area of the patch
     * @param occupied - boolean value determining if the patch is populated
     * @param k_ij - the dispersal of patch i to patch j, see Disperal function 
     * @returns - the connectivity of patch i to patch j
     * 
     */
    public abstract connectivityFunction(area:number, occupied:boolean, k_ij:number):number 

    public calculateAll(network: Network):number[]
    {
        const dispersals: number[][] = network.dispersals;
        const connectivityValues: number[] = [];
        //iterate through 
        for(let i = 0; i < network.patches.length; i++) {
            let sum = 0;
            for(let j = 0; j < network.patches.length;j++)
            {
                const currentPatch = network.patches[j];
                if (i != j) {
                    sum = sum + this.connectivityFunction(currentPatch.area,currentPatch.is_occupied,dispersals[i][j]);
                }
            }
            connectivityValues[i] = sum;
        }
        return connectivityValues;
    }


    public calculateOnce(network: Network, patchID: number): number {
        const dispersal: number[] = network.dispersals[patchID];
        let sum = 0;
        for(let i = 0; i < network.patches.length;i++)
            {
                const currentPatch = network.patches[i];
                if (patchID != i) {
                    sum = sum + this.connectivityFunction(currentPatch.area, currentPatch.is_occupied, dispersal[i]);
                }
            }
        return sum;
    }
    
    public returnInterfaces():IConnectivitySettings {
        const param:IConnectivitySettings = {"b": this.b,"type": this.type};
        return param;
    }

    public setBeta(b:number){
        this.b = b;
    }
}