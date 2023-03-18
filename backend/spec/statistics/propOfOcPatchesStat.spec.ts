import { Patch } from "../../src/@types/patch";
import { Network } from "../../src/models/network";
import { NetworkStat,NetworkStatType} from "../../src/Statistics/networkStat";
import { PropOfOccPatches } from "../../src/Statistics/propOfOcPatchesStat";


describe("The proportion of occupied patches Stat", ()=>{

    'given a network to test the stats on'
    const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}});
    const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":false,"localPatches":[],"pos":{"x":3,"y":4}});
    const testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});

    'given the proportion of occupied patch statistic class'
    let propOfOccPatchStat:PropOfOccPatches = new PropOfOccPatches();

    afterEach(()=>{
        propOfOccPatchStat = new PropOfOccPatches();
    })

    it("should have the default class data when no patches are provided", () => {
        propOfOccPatchStat = new PropOfOccPatches();
        expect(propOfOccPatchStat).toBeInstanceOf(PropOfOccPatches);
        expect(propOfOccPatchStat).toBeInstanceOf(NetworkStat);
        expect(propOfOccPatchStat.results).toEqual([]);
        expect(propOfOccPatchStat.type).toEqual(NetworkStatType.PropOccupied);
    });

    it("should correctly calculate the number of occupied patches", () => {
        expect(propOfOccPatchStat.calculateCurrentOccupied(testNetwork)).toEqual(testNetwork.numberColonised);
        expect(testNetwork.numberColonised).toEqual(1);
    });

    'When calculating the proporiton of occupied patch '

    it("should return the correct proportion of patches by area that are occupied", () => {
        propOfOccPatchStat.calculateCurrentStats(testNetwork)
        const result =  propOfOccPatchStat.results[0] / 100 //formatting for front 
        expect(result).toEqual(testNetwork.numberColonised/testNetwork.patches.length);
    });
    
});
