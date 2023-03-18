import { BaseDispersalFunction, DispersalType, IDispersalSettings } from "./base";

/**
 * concrete implementation for the Default Dispersal Function
 */

export class Hanski1999 extends BaseDispersalFunction{

    static DEFAULT_META = { "name": "Hanski 1999", "description": "Hanski 1999 dispersal function" };

    constructor(opt?:IDispersalSettings){
        super(opt);
        this.meta = Hanski1999.DEFAULT_META; 
        this.type = DispersalType.Hanski1999;
    }

    /**
     * 
     * @param d_ij - the distance between patch i and j
     * @returns - the dispersal between patch i and j
     * 
     */
    public dispersalFunction(d_ij:number): number{
        const product = (-this.alpha) * d_ij;
        return Math.pow(Math.E, product);
    }
}


