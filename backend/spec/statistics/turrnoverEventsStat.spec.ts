import { Patch } from "../../src/@types/patch";
import { Network } from "../../src/models/network";
import { NetworkStat,NetworkStatType} from "../../src/Statistics/networkStat";
import { TurnoverEvents } from "../../src/Statistics/turrnoverEventsStat";


describe("The number of turnover events Stat", ()=>{

    'given a network to test the stats on'
    const testPatch1: Patch = new Patch({"id":0,"area":1,"is_occupied":true,"localPatches":[],"pos":{"x":0,"y":0}});
    const testPatch2: Patch = new Patch({"id":1,"area":1,"is_occupied":false,"localPatches":[],"pos":{"x":3,"y":4}});
    let testNetwork: Network = new Network({"patches":[testPatch1,testPatch2]});

    'given the proportion of Occupied Patch statistic class'
    let turnoverEventsStat:TurnoverEvents = new TurnoverEvents();

    afterEach(()=>{
        turnoverEventsStat = new TurnoverEvents();
        testNetwork = new Network({"patches":[testPatch1,testPatch2]});
        testNetwork.extinctionEvents = 0;
        testNetwork.colonisationEvents = 0;
    })

    it("should have the default class data when no patches are provided", () => {
        turnoverEventsStat = new TurnoverEvents();
        expect(turnoverEventsStat).toBeInstanceOf(TurnoverEvents);
        expect(turnoverEventsStat).toBeInstanceOf(NetworkStat);
        expect(turnoverEventsStat.results).toEqual([]);
        expect(turnoverEventsStat.type).toEqual(NetworkStatType.TurnoverEvents);
    });

    it("should correctly calculate the number of events that occur", () => {
        testNetwork.colonisationEvents = 1;
        testNetwork.extinctionEvents = 10;
        turnoverEventsStat.calculateCurrentStats(testNetwork)
        expect(turnoverEventsStat.results[0]).toEqual(11);
    });
    
});
