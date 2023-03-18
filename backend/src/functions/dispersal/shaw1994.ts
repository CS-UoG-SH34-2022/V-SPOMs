import { BaseDispersalFunction, DispersalType, IDispersalSettings } from "./base";

/**
 * concrete implementation for the Default Dispersal Function
 */

export class Shaw1994 extends BaseDispersalFunction{
    
    static DEFAULT_META = { "name": "Shaw 1994", "description": "Shaw 1994 dispersal function" };

    constructor(opt?:IDispersalSettings){
        super(opt);
        this.meta = Shaw1994.DEFAULT_META;
        this.type = DispersalType.Shaw1994;
    }

    /**
     * 
     * @param d_ij - the distance between patch i and j
     * @returns - the dispersal between patch i and j
     * 
     */
    public dispersalFunction(d_ij:number): number{
        const product = (this.alpha) * Math.pow(d_ij,this.beta);
        return 1/product;
    }
}


