import { Patch } from "../../src/@types/patch";
import { BaseDispersalFunction, DispersalType, IDispersalSettings } from "../../src/functions/dispersal/base";
import { Hanski1999 } from "../../src/functions/dispersal/hanski1999";
import { Network } from "../../src/models/network";

describe("Dispersal function", ()=>{

    
    const defaultInterface: IDispersalSettings = {"alpha":0.0011, "beta":1, "type":DispersalType.Hanski1999};
   
    'given the dispersal function'
    let dispersalFunction: BaseDispersalFunction

    afterEach(()=>{
        dispersalFunction = new Hanski1999();
    })

    'when the default options for the dispersal function have been provided:'
    dispersalFunction = new Hanski1999();

    it("should have the default function data", () => {
        expect(dispersalFunction).toBeInstanceOf(BaseDispersalFunction);
        expect(dispersalFunction.meta).toEqual(Hanski1999.DEFAULT_META);
        expect(dispersalFunction.returnInterfaces()).toEqual(defaultInterface);
    });


    'when the function is provided new parameters through an interface'
    const functionParams: IDispersalSettings = {"alpha":0.8, "beta":2, "type":DispersalType.Hanski1999};

    it("should return the interface containing the parameters for the function for Default setup",() =>{
        expect(dispersalFunction.returnInterfaces()).toEqual(defaultInterface);
    })

    it("should have the updated fields during construction", () => {
        dispersalFunction = new Hanski1999(functionParams);
        expect(dispersalFunction.returnInterfaces()).toEqual(functionParams);
    });

    it("should have the updated fields outside of the constructor", () => {
        dispersalFunction.setAlpha(0.8);
        dispersalFunction.setBeta(2)
        expect(dispersalFunction.returnInterfaces()).toEqual(functionParams);
    });

    'when calculating the dispersal of a patch'

    it("should correctly include every patch in the calculation", () => {
        const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}})
        const testPatch2: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":3,"y":4}})
        const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});
        const distances = Patch.getDistancesToPatches(testNetwork);
        const expetedDis = dispersalFunction.dispersalFunction(distances[0][1])
        const expectedDispersals = [[1, expetedDis],[expetedDis,1]]
        const resultDispersals = new Hanski1999().calculateDispersal(testNetwork);
        expect(resultDispersals).toEqual(expectedDispersals);
    });

    it("should correctly calculate the dispersal", () => {
        const distance = 2;
        const expetedDispersal = Math.pow(Math.E,(-dispersalFunction.alpha) * distance);
        const result =dispersalFunction.dispersalFunction(distance)
        expect(result).toEqual(expetedDispersal);
    });


});
