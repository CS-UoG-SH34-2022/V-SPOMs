import { Patch } from "../../src/@types/patch";
import { ConnectivityType, IConnectivitySettings } from "../../src/functions/connectivity/base";
import { BaseConnectivityFunction } from "../../src/functions/connectivity/base";
import { MolianenA2004 } from "../../src/functions/connectivity/molianenA2004";
import { MolianenB2004 } from "../../src/functions/connectivity/molianenB2004";
import { Hanski1999 } from "../../src/functions/dispersal/hanski1999";
import { Network } from "../../src/models/network";

describe("Connectivity function", ()=>{

    
    const defaultInterface: IConnectivitySettings = {"b": 1,"type": ConnectivityType.MolianenA2004};

    
    'given the connectivity function'
    let connectivityFunction: BaseConnectivityFunction

    afterEach(()=>{
        connectivityFunction = new MolianenA2004();
    })

    'when the default options for the connectivity function have been provided:'
    connectivityFunction = new MolianenA2004();

    it("should have the default function data", () => {
        expect(connectivityFunction).toBeInstanceOf(BaseConnectivityFunction);
        expect(connectivityFunction).toBeInstanceOf(MolianenA2004);
        expect(connectivityFunction.meta).toEqual(MolianenA2004.DEFAULT_META);
        expect(connectivityFunction.returnInterfaces()).toEqual(defaultInterface);
    });


    'when the function is provided new parameters through an interface'
    const functionParams: IConnectivitySettings = {"b": 0.9,"type": ConnectivityType.MolianenA2004};

    it("should return the interface containing the parameters for the function for Default setup",() =>{
        expect(connectivityFunction.returnInterfaces()).toEqual(defaultInterface);
    });

    it("should have the updated fields during construction", () => {
        connectivityFunction = new MolianenA2004(functionParams);
        expect(connectivityFunction.returnInterfaces()).toEqual(functionParams);
    });

    it("should have the updated fields outside of the constructor", () => {
        connectivityFunction.setBeta(0.9);
        expect(connectivityFunction.returnInterfaces()).toEqual(functionParams);
    });
    
    'when calculating connectivity'

    it("should produce the correct connectiy value for a patch", () => {
        const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}})
        const testPatch2: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":3,"y":4}})
        const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});
        testNetwork.dispersals = new Hanski1999().calculateDispersal(testNetwork);
        const result = testNetwork.dispersals[0][1]*((Math.pow(testPatch1.area, connectivityFunction.b)));
        expect(connectivityFunction.calculateOnce(testNetwork,0)).toEqual(result);
    });

    it("should produce the correct connectiy value when direclty called using MolianenA2004", () => {
        connectivityFunction = new MolianenA2004();
        const dispersal = 0.5
        const result = dispersal * ((Math.pow(2, connectivityFunction.b)))
        expect(connectivityFunction.connectivityFunction(2,true,dispersal)).toEqual(result);
    });

    it("should produce the correct connectiy value when direclty called using MolianenB2004", () => {
        connectivityFunction = new MolianenB2004();
        const dispersal = 0.5
        const result = dispersal * ((Math.pow(2, -connectivityFunction.b)))
        expect(connectivityFunction.connectivityFunction(2,true,dispersal)).toEqual(result);
    });

});
