import { BaseIntrinsicExtinctionFunction, ExtinctionType, IExtinctionSettings } from "./base";

/**
 * concrete implementation for the Default Extinction Function
 */
export class Hanski2002 extends BaseIntrinsicExtinctionFunction{

    static DEFAULT_META = { "name": "Hanski 2002", "description": "Hanski 2002 extinction function" };

    constructor(opt?:IExtinctionSettings){
        super(opt);
        this.meta = Hanski2002.DEFAULT_META;
        this.type = ExtinctionType.Hanski2002;
    }

    /**
     * 
     * @param area - area of the patch
     * @returns - the probability a patch will go extinct
     * 
     */
    public extinctionFunction(area:number):number {
        const fraction = this.e / Math.pow(area, this.x);
        return Math.min(1, fraction);
    }

}