import { Network } from "../models/network";
import { NetworkStat } from "./networkStat";
import { NetworkStatType } from "./networkStat"

export class TurnoverEvents extends NetworkStat{

    constructor(){
        super();

        this.meta = {name:"Number of extinction and colonisation events", description: ""};
        this.type = NetworkStatType.TurnoverEvents;
        this.results = []; 
        this.max = 0;
    }

    public calculateCurrentStats(network: Network): void {
        this.results.push(network.colonisationEvents+network.extinctionEvents);
        if(network.colonisationEvents+network.extinctionEvents>this.max)
        {
            this.max = network.colonisationEvents+network.extinctionEvents
        }
    }

    
}

