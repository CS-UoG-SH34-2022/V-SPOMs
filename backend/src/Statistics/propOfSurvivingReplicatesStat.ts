import { IReplicate } from "../spom";
import { Network } from "../models/network";
import { ReplicateStat, ReplicateStatType } from "./replicateStat";

export class PropOfSurvivingReplicates extends ReplicateStat{

    constructor(){
        super();

        this.meta = {name:"Proportion of surviving replicates", description: ""};
        this.type = ReplicateStatType.PropOfSurvivingReplicates;
        this.results = []; 
    }

    public calculateCurrentStats(replicates: IReplicate[]): void {

        //iterate through each time frame
        for(let i=0;i<replicates[0].simulationSnapshots.length;i++)
        {
            let numberOfReplicatesSurvived = 0;
            //go through each replicate
            for(const replicate of replicates)
            {
                //check that the replicate's snapshot is globally extinct or not
                const snapshot: Network = replicate.simulationSnapshots[i];
                if(snapshot.numberColonised>0)
                {
                    numberOfReplicatesSurvived += 1;
                }

            }
            this.results.push(numberOfReplicatesSurvived / replicates.length);
        }
    }

}

