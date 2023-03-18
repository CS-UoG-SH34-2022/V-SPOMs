import { Patch } from "../../src/@types/patch";
import { IExtinctionSettings, BaseIntrinsicExtinctionFunction, ExtinctionType} from "../../src/functions/intrinsic-extinction/base"
import { Hanski2002 } from "../../src/functions/intrinsic-extinction/hanski2002";
import { Network } from "../../src/models/network";

describe("Extinction function", ()=>{

    
    const defaultInterface: IExtinctionSettings = {"e":90,"x":1,"type":ExtinctionType.Hanski2002};
    
    'given the extinction function'
    let intrinsicExtinctionFunction: BaseIntrinsicExtinctionFunction

    afterEach(()=>{
        intrinsicExtinctionFunction = new Hanski2002();
    })

    'when the default options for the extinction function have been provided:'
    intrinsicExtinctionFunction = new Hanski2002();

    it("should have the default function data", () => {
        expect(intrinsicExtinctionFunction).toBeInstanceOf(BaseIntrinsicExtinctionFunction);
        expect(intrinsicExtinctionFunction).toBeInstanceOf(Hanski2002);
        expect(intrinsicExtinctionFunction.meta).toEqual(Hanski2002.DEFAULT_META);
        expect(intrinsicExtinctionFunction.returnInterfaces()).toEqual(defaultInterface);
    });


    'when the function is provided new parameters through an interface'
    const functionParams: IExtinctionSettings = {"e":0.8,"x":0.5,"type":ExtinctionType.Hanski2002};

    it("should return the interface containing the parameters for the function for Default setup",() =>{
        expect(intrinsicExtinctionFunction.returnInterfaces()).toEqual(defaultInterface);
    });

    it("should have the updated fields during construction", () => {
        intrinsicExtinctionFunction = new Hanski2002(functionParams);
        expect(intrinsicExtinctionFunction.returnInterfaces()).toEqual(functionParams);
    });

    it("should have the updated fields outside of the constructor", () => {
        intrinsicExtinctionFunction.setE(0.8);
        intrinsicExtinctionFunction.setX(0.5);
        expect(intrinsicExtinctionFunction.returnInterfaces()).toEqual(functionParams);
    });

    'When calculating the intrinsic extinction of a patch'

    it("should correctly determine the probability for a patch", () => {
        const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}});
        const testPatch2: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":3,"y":4}});
        const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});
        const result = intrinsicExtinctionFunction.calculateOnce(testNetwork,0);
        const expected = intrinsicExtinctionFunction.extinctionFunction(testNetwork.patches[0].area);
        expect(result).toEqual(expected);
    });

    it("should correctly carry out the calculation", () => {
        const area =10;
        const result = intrinsicExtinctionFunction.extinctionFunction(area);
        const expected = Math.min(1,( intrinsicExtinctionFunction.e / Math.pow(area, intrinsicExtinctionFunction.x)))
        expect(result).toEqual(expected);
    });

});
