/**
 * This is an internal module. See {@link createSPOM} for the public class.
 * @module spom
 */

import { MetaOptions } from "./@types/metaOptions";
import { IBackendSPOMOptions } from "./backend";
import { Engine } from "./engine/engine";
import { IRandomNetworkOptions, Network } from "./models/network";
import { NetworkStat } from "./Statistics/networkStat";
import { PropOfOccAreaStat } from "./Statistics/propOfOcAreaStat";
import { PropOfOccPatches } from "./Statistics/propOfOcPatchesStat";
import { TurnoverEvents} from "./Statistics/turrnoverEventsStat";
import { ReplicateStat } from "./Statistics/replicateStat";
import { PropOfSurvivingReplicates } from "./Statistics/propOfSurvivingReplicatesStat";

export interface ICreateSPOMParameters {
    meta: MetaOptions;
    engine: Engine;
    network: Network;
}

export interface IReplicate{
    simulationSnapshots: Network[];
    stats: number[][];
}

export class SPOM{
    public meta: MetaOptions;
    public startingNetwork: Network;
    public engine: Engine;

    public replicates: IReplicate[] = [];
    public simulationSnapshots: Network[];
    public networkStats: NetworkStat[];
    public replicateStats: ReplicateStat[];

    public meanStats: number[][];

    constructor(opts: ICreateSPOMParameters){
        this.meta = opts.meta;
        this.engine = opts.engine;
        this.startingNetwork = opts.network;
        this.networkStats = this.setNetworkStats();
        this.replicateStats = this.setReplicateStats();
    }

    public setNetworkStats(): NetworkStat[] {
        const returnStats: NetworkStat[] = [];
        const newStat1:PropOfOccAreaStat = new PropOfOccAreaStat(this.startingNetwork);
        returnStats.push(newStat1);
        const newStat2:PropOfOccPatches = new PropOfOccPatches();
        returnStats.push(newStat2);
        const newStat3:TurnoverEvents = new TurnoverEvents();
        returnStats.push(newStat3);
        return returnStats;
    }
    public setReplicateStats(): ReplicateStat[] {
        const returnStats: ReplicateStat[] = [];
        const newStat1:PropOfSurvivingReplicates = new PropOfSurvivingReplicates();
        returnStats.push(newStat1);
        return returnStats;
    }

    public getConfig():IBackendSPOMOptions{
        const config:IBackendSPOMOptions = {
            meta: this.meta,
            engine: this.engine.getConfig(),
            network: this.startingNetwork
        }
        return config;
    }

    public async simulate(replicates: number, max_iterations: number){

        // Clear the replicates
        this.replicates = [];

        // Update the engine with the new max iterations
        this.engine.simulation.endTime = max_iterations;
        // Run the simulation synchronously for the number of replicates
        for (let i = 0; i < replicates; i++) {
            const replicate:IReplicate = {
                simulationSnapshots: [],
                stats: []
            }

            // Calculate the snapshots for each replicate
            const replicateSnapshots = this.engine.simulation.runSimulation(this.engine, this.startingNetwork);
            replicate.simulationSnapshots = replicateSnapshots;

            // Calculate the stats for each replicate
            //stats about network
            for (const stat of this.networkStats) {
                stat.results = [];
                for (const snapshot of replicateSnapshots) {
                    stat.calculateCurrentStats(snapshot);
                }
                replicate.stats.push([...stat.results]);
              }

            this.replicates.push(replicate);
        }
        //iterate through stat
        const meanStatArray: number[][] = []
        for(let statIndex = 0; statIndex<this.networkStats.length;statIndex++)
        {
            const meanStat: number[] = [];
            //iterate through time frame, assume the same for all stats
            for(let timeFrameIndex =0;timeFrameIndex<this.networkStats[statIndex].results.length;timeFrameIndex++)
            {
                let averageValue = 0;
                //iterate through replciates
                for(let replicateIndex=0;replicateIndex<this.replicates.length;replicateIndex++)
                {
                    averageValue +=this.replicates[replicateIndex].stats[statIndex][timeFrameIndex];
                }
                averageValue =averageValue/this.replicates.length;
                meanStat.push(averageValue);
            }
            meanStatArray.push(meanStat)
        }
        this.meanStats = meanStatArray;
        //stats about replicates
        for (const stat of this.replicateStats) {
            stat.results = [];
            stat.calculateCurrentStats(this.replicates);
        }
    }

    public generateRandomNetwork(){
        //random network options
        const randNetwork:IRandomNetworkOptions ={
            numPatches: 50,
            maxArea: 9,
            maxAbsoluteXPos: 40,
            maxAbsoluteYPos: 40,
            //needs to be a float between 0 and 1
            percentageOccupied: 0.5
        }

        this.startingNetwork = this.startingNetwork.createRandomNetwork(randNetwork);
        this.networkStats = this.setNetworkStats();
        this.simulationSnapshots = this.engine.simulation.runSimulation(this.engine, this.startingNetwork);
        
        // CODE FOR TEST PURPOSES.
        let i = 0;
        for(const snapshot of this.simulationSnapshots){
            i+=1;
            //await new Promise(resolve => setTimeout(resolve, 1000));
            for(const stat of this.networkStats)
            {
                stat.calculateCurrentStats(snapshot);
                
            }
            console.log("Occupied patches T+"+i+":"+snapshot.patches.reduce((accumulator:number, patch) => accumulator + (patch.is_occupied ? 1:0), 0))
        }
    }
}