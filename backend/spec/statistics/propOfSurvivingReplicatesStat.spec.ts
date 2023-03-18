import { Patch } from "../../src/@types/patch";
import { Network } from "../../src/models/network";
import { IReplicate } from "../../src/spom";
import { ReplicateStat, ReplicateStatType } from "../../src/Statistics/replicateStat";
import { PropOfSurvivingReplicates } from "../../src/Statistics/propOfSurvivingReplicatesStat";

describe("The number of turnover events Stat", ()=>{

    'given an array of populated replicates'
    //generate example networks
    const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}});
    const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":false,"localPatches":[],"pos":{"x":3,"y":4}});
    const testNetwork1: Network = new Network({"patches":[testPatch1,testPatch2]});
    const testNetwork2: Network = new Network({"patches":[testPatch1,testPatch2]});
    const testNetwork3: Network = new Network({"patches":[testPatch1,testPatch2]});
    
    //generate the replicate
    const replicate: IReplicate = {"simulationSnapshots":[],"stats":[[]]}
    testNetwork1.numberColonised = 1;
    replicate.simulationSnapshots.push(testNetwork1);
    console.log(replicate)
    testNetwork2.numberColonised = 0;
    replicate.simulationSnapshots.push(testNetwork2);
    console.log(replicate)
    testNetwork3.numberColonised = 2;
    replicate.simulationSnapshots.push(testNetwork3);
    console.log(replicate)

    //add to replicates
    let replicates: IReplicate[] = [];
    replicates.push(replicate);
    replicates.push(replicate);
    replicates.push(replicate);

    'given the proportion of surviving repleicates statistic class'
    let propOfSurvivingReplicates:PropOfSurvivingReplicates = new PropOfSurvivingReplicates();

    afterEach(()=>{
        propOfSurvivingReplicates = new PropOfSurvivingReplicates();
        replicates = [];
        replicates.push(replicate);
        replicates.push(replicate);
        replicates.push(replicate);
        console.log(replicates)
    })

    it("should have the default class data when no data is generated", () => {
        propOfSurvivingReplicates = new PropOfSurvivingReplicates();
        expect(propOfSurvivingReplicates).toBeInstanceOf(PropOfSurvivingReplicates);
        expect(propOfSurvivingReplicates).toBeInstanceOf(ReplicateStat);
        expect(propOfSurvivingReplicates.results).toEqual([]);
        expect(propOfSurvivingReplicates.type).toEqual(ReplicateStatType.PropOfSurvivingReplicates);
    });

    it("should correctly calculate proportion of survivng replicates", () => {
        propOfSurvivingReplicates.calculateCurrentStats(replicates)
        console.log(propOfSurvivingReplicates.results)
        expect(propOfSurvivingReplicates.results[0]).toEqual(1);
        expect(propOfSurvivingReplicates.results[1]).toEqual(0);
        expect(propOfSurvivingReplicates.results[2]).toEqual(1);
    });
    
});
