import { Patch } from "../../src/@types/patch";
import { CorrelatedExtinctionFunction, ICorrelatedExtinctionSettings } from "../../src/functions/correlatedExtinction/correlatedExtinction";
import { Network } from "../../src/models/network";


describe("Colonization function", ()=>{

    
    const defaultInterface: ICorrelatedExtinctionSettings = {"c":CorrelatedExtinctionFunction.DEFAULT_C};

    'given the correlation Extinction function'
    let correlatedExtinctionFunction: CorrelatedExtinctionFunction

    afterEach(()=>{
        correlatedExtinctionFunction = new CorrelatedExtinctionFunction();
    })


    'when the default options for the correlated Extinction function have been provided:'
    correlatedExtinctionFunction = new CorrelatedExtinctionFunction();

    it("should have the default function data", () => {
        expect(correlatedExtinctionFunction).toBeInstanceOf(CorrelatedExtinctionFunction);
        expect(correlatedExtinctionFunction.meta).toEqual(CorrelatedExtinctionFunction.DEFAULT_META);
        expect(correlatedExtinctionFunction.returnInterfaces()).toEqual(defaultInterface);
    });


    'when the function is provided new parameters through an interface'
    const functionParams: ICorrelatedExtinctionSettings = {"c":0.8};

    it("should return the interface containing the parameters for the function for Default setup",() =>{
        expect(correlatedExtinctionFunction.returnInterfaces()).toEqual(defaultInterface);
    })

    it("should have the updated fields during construction", () => {
        correlatedExtinctionFunction = new CorrelatedExtinctionFunction(functionParams);
        expect(correlatedExtinctionFunction.returnInterfaces()).toEqual(functionParams);
    });

    it("should have the updated fields outside of the constructor", () => {
        correlatedExtinctionFunction.setC(0.9);
        expect(correlatedExtinctionFunction.returnInterfaces()).toEqual({"c":0.9});
    });

    'when the calculating the local patches of a patch'

    it("should have no local patches if c = 0 ", () => {
        const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}})
        const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":3,"y":4}})
        const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});
        correlatedExtinctionFunction.setC(0);
        const noLocalPatches:Patch[] = []
        const resultNetwork:Network = correlatedExtinctionFunction.findlocalPatches(testNetwork)
        expect(resultNetwork.patches[0].localPatches).toEqual(noLocalPatches);
    });

    it("should have all local patches if c = 10 ", () => {
        const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}})
        const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":3,"y":4}})
        const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});
        correlatedExtinctionFunction.setC(10);
        const LocalPatches:Patch[] = [testPatch2]
        const resultNetwork:Network = correlatedExtinctionFunction.findlocalPatches(testNetwork)
        expect(resultNetwork.patches[0].localPatches).toEqual(LocalPatches);
    });


});
