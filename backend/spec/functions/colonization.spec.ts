import { ColonisationType, IColonizationSettings } from "../../src/functions/colonisation/base";
import { BaseColonizationFunction } from "../../src/functions/colonisation/base";
import { HanskiA1994 } from "../../src/functions/colonisation/hanskiA1994";
import { HanskiB1994 } from "../../src/functions/colonisation/hanskiB1994";
import { Network } from "../../src/models/network";

describe("Colonization function", ()=>{

    
    const defaultInterface: IColonizationSettings = {"y":5.22,"type":ColonisationType.HanskiA1994};


    'given the colonization function'
    let colonizationFunction: BaseColonizationFunction

    afterEach(()=>{
        colonizationFunction = new HanskiA1994();
    })


    'when the default options for the colonization function have been provided:'
    colonizationFunction = new HanskiA1994();

    it("should have the default function data", () => {
        expect(colonizationFunction).toBeInstanceOf(HanskiA1994);
        expect(colonizationFunction).toBeInstanceOf(BaseColonizationFunction);
        expect(colonizationFunction.type).toEqual(ColonisationType.HanskiA1994);
        expect(colonizationFunction.meta).toEqual(HanskiA1994.DEFAULT_META);
        expect(colonizationFunction.returnInterfaces()).toEqual(defaultInterface);
    });


    'when the function is provided new parameters through an interface'
    const functionParams: IColonizationSettings = {"y":0.8,"type":ColonisationType.HanskiA1994};

    it("should return the interface containing the parameters for the function for Default setup",() =>{
        expect(colonizationFunction.returnInterfaces()).toEqual(defaultInterface);
    })

    it("should have the updated fields during construction", () => {
        colonizationFunction = new HanskiA1994(functionParams);
        expect(colonizationFunction.returnInterfaces()).toEqual({"y":0.8,"type":ColonisationType.HanskiA1994});
    });

    it("should have the updated fields outside of the constructor", () => {
        colonizationFunction.setY(0.8);
        expect(colonizationFunction.returnInterfaces()).toEqual({"y":0.8,"type":ColonisationType.HanskiA1994});
    });

    it("should correctly retrieve the conenctivity values of a patch", () =>{
        const testNetwork: Network = new Network();
        testNetwork.connectivity = [2];
        expect(colonizationFunction.getConnectivity(testNetwork,0)).toEqual(2);
    });

    'when the HanskiA1994 function is executing'

    it("should calculate the connectivity of a single value provided a connectivity", () => {
        colonizationFunction = new HanskiA1994();

        const connectivityValue = 2;
        const result: number = 4 /31.2484;
        
        expect(colonizationFunction.colonizationFunction(connectivityValue)).toEqual(result);
    });

    'when the HanskiB1994 function is executing'

    it("should calculate the connectivity of a single value provided a connectivity", () => {
        colonizationFunction = new HanskiB1994();

        const connectivityValue = 2;
        const result: number = 1-Math.pow(Math.E, -10.44);
        
        expect(colonizationFunction.colonizationFunction(connectivityValue)).toEqual(result);
    });
    

});
