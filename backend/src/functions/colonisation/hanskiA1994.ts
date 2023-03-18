import { ColonisationType, IColonizationSettings } from "./base";
import { BaseColonizationFunction } from "./base";

/**
 * concrete implementation for the Default Colonization Function
 */

export class HanskiA1994 extends BaseColonizationFunction{
    
    static DEFAULT_META = {"name":"Hanski 1994 A","description":"Variant of Hanski 1994 colonization function"};

    constructor(opt?:IColonizationSettings){
        super(opt);
        this.meta = HanskiA1994.DEFAULT_META;
        this.type = ColonisationType.HanskiA1994;
    }

    /**
     * 
     * @param s_i - the connectivity of the current patch
     * @returns - the probability of the current patch being reached
     * 
     */
    public colonizationFunction(s_i: number):number {
        return Math.pow(s_i, 2) / (Math.pow(s_i, 2) + Math.pow(this.y, 2));
    }
}