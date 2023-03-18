import { ColonisationType, IColonizationSettings } from "./base";
import { BaseColonizationFunction } from "./base";

/**
 * concrete implementation for the Default Colonization Function
 */

export class HanskiB1994 extends BaseColonizationFunction{
    
    static DEFAULT_META = {"name":"Hanski 1994 B","description":"Variant of Hanski 1994 colonization function"};

    constructor(opt?:IColonizationSettings){
        super(opt);
        this.meta = HanskiB1994.DEFAULT_META;
        this.type = ColonisationType.HanskiB1994;
    }

    /**
     * 
     * @param s_i - the connectivity of the current patch
     * @returns - the probability of the current patch being reached
     * 
     */
    public colonizationFunction(s_i: number):number {
        const product = (-this.y) * s_i;
        const exp = Math.pow(Math.E, product);
        return (1 - exp);
    }
}