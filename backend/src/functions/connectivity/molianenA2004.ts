import { BaseConnectivityFunction, ConnectivityType, IConnectivitySettings } from "./base";

/**
 * concrete implementation for the Default Connectivity Function
 */

export class MolianenA2004 extends BaseConnectivityFunction{

    static DEFAULT_META = {"name":"Molianen 2004 A","description":"Variant of Molianen 2004 connectivity function"};
    constructor(opt?:IConnectivitySettings){
        super(opt);
        this.meta = MolianenA2004.DEFAULT_META;
        this.type = ConnectivityType.MolianenA2004;
    }

    /**
     * 
     * @param area - the area of the patch
     * @param occupied - boolean value determining if the patch is populated
     * @param k_ij - the dispersal of patch i to patch j, see Disperal function 
     * @returns - the connectivity of patch i to patch j
     * 
     */
    public connectivityFunction(area:number, occupied:boolean, k_ij:number):number {
        if(occupied)
        {
            return k_ij * (Math.pow(area, this.b));
        }
        return 0;
    }
}