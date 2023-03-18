import { Network } from "../models/network";
import { NetworkStat } from "./networkStat";
import { NetworkStatType } from "./networkStat"

export class PropOfOccPatches extends NetworkStat{

    constructor(){
        super();

        this.meta = {name:"Proportion of occupied Patches Stats", description: ""};
        this.type = NetworkStatType.PropOccupied;
        this.results = []; 
    }

    public calculateCurrentStats(network: Network): void {
        const totalOccupied: number = this.calculateCurrentOccupied(network);
        let proportionOccupied = totalOccupied/network.patches.length;
        proportionOccupied = proportionOccupied*100;
        this.results.push(proportionOccupied);
    }

    public calculateCurrentOccupied(network: Network): number {
        let totalOccupied = 0;
        for(let i = 0;i<network.patches.length;i++)
        {
            if(network.patches[i].is_occupied)
                totalOccupied = totalOccupied + 1;
        }
        return totalOccupied;
    }
}

