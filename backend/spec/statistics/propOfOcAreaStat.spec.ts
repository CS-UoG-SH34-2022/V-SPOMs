import { Patch } from "../../src/@types/patch";
import { Network } from "../../src/models/network";
import { NetworkStat,NetworkStatType} from "../../src/Statistics/networkStat";
import { PropOfOccAreaStat } from "../../src/Statistics/propOfOcAreaStat";


describe("The proportion of Occupied Area Stat", ()=>{

    'given a network to test the stats on'
    const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}});
    const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":false,"localPatches":[],"pos":{"x":3,"y":4}});
    const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});

    'given the proportion of Occupied Area statistic class'
    let propOfOccAreaStat:PropOfOccAreaStat = new PropOfOccAreaStat(testNetwork);

    afterEach(()=>{
        propOfOccAreaStat = new PropOfOccAreaStat(testNetwork);
    })

    it("should have the default class data when no patches are provided", () => {
        propOfOccAreaStat = new PropOfOccAreaStat(new Network());
        expect(propOfOccAreaStat).toBeInstanceOf(PropOfOccAreaStat);
        expect(propOfOccAreaStat).toBeInstanceOf(NetworkStat);
        expect(propOfOccAreaStat.results).toEqual([]);
        expect(propOfOccAreaStat.totalArea).toEqual(0);
        expect(propOfOccAreaStat.type).toEqual(NetworkStatType.PropOfOccupiedArea);
    });

    it("should correctly calculate the total area of all the patches", () => {
        propOfOccAreaStat = new PropOfOccAreaStat(testNetwork);
        expect(propOfOccAreaStat.totalArea).toEqual(testPatch1.area+testPatch2.area);
        expect(propOfOccAreaStat.calculateTotalArea(testNetwork)).toEqual(propOfOccAreaStat.totalArea);
    });

    'When calculating the current occupied area'

    it("should return the correct area of patches that are occupied", () => {
        expect(propOfOccAreaStat.calculateCurrentOccupiedArea(testNetwork)).toEqual(testPatch1.area);
    });

    'When calculating the proporiton of occupied patch Area'

    it("should return the correct proportion of patches by area that are occupied", () => {
        propOfOccAreaStat.calculateCurrentStats(testNetwork)
        const result =  propOfOccAreaStat.results[0] / 100 //formatting for front 
        expect(result).toEqual(propOfOccAreaStat.calculateCurrentOccupiedArea(testNetwork)/propOfOccAreaStat.totalArea);
    });
    
});
