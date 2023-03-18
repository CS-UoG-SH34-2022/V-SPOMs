import { Network } from "../models/network";
import { NetworkStat } from "./networkStat";
import { NetworkStatType } from "./networkStat"

export class PropOfOccAreaStat extends NetworkStat{

    totalArea: number;

    constructor(network: Network){
        super();

        this.meta = {name:"Proportion of occupied Area Stats", description: ""};
        this.type = NetworkStatType.PropOfOccupiedArea;
        this.totalArea = this.calculateTotalArea(network);
        this.results = []; 
    }

    public calculateTotalArea(network: Network):number {
        let totalArea = 0;
        for(let i = 0;i<network.patches.length;i++) 
        {
            totalArea = totalArea + network.patches[i].area;
        }
        return totalArea;
    }

    public calculateCurrentStats(network: Network): void {
        this.totalArea = this.calculateTotalArea(network);
        const totalOccupiedArea: number = this.calculateCurrentOccupiedArea(network);
        let proportionOccupiedArea = totalOccupiedArea/this.totalArea;
        proportionOccupiedArea = proportionOccupiedArea*100;
        this.results.push(proportionOccupiedArea);
    }

    public calculateCurrentOccupiedArea(network: Network): number {
        let totalOccupied = 0;
        for(let i = 0;i<network.patches.length;i++)
        {
            if(network.patches[i].is_occupied)
                totalOccupied = totalOccupied + network.patches[i].area;
        }
        return totalOccupied;
    }
}

