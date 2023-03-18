import { Engine } from "../engine/engine";
import { Network } from "./network";
import { ISimulationParameters,Simulation, SimulationType } from "./simulation";

export class IteratorSimulation extends Simulation{

    constructor(){
        super();

        // Default Simulation hypervalues
        this.meta = {name:"Iterative Simulator", description: ""};
        this.simulationType = SimulationType.Iterator;
        this.startTime = 0;
        this.endTime = 100;
        this.timeIncrement = 1;
    }

    public setSimulation(simulation: ISimulationParameters): void {
        this.meta = simulation.meta;
        this.simulationType = SimulationType.Iterator;
        this.startTime = simulation.startTime;
        this.endTime = simulation.endTime;
        this.timeIncrement = simulation.timeIncrement;
    }

    public getSimulation(): Simulation {
        return this;
    }


    public step(network: Network): Network {
        throw new Error("Method not implemented."+network);
    }


    public runSimulation(engine: Engine, starting_network:Network): Network[] {
        
        const networks: Network[] = [];
        
        let network = starting_network.cloneNetwork();
        network = engine.correlatedExtinctionFunction.findlocalPatches(network);

        // If network does not contain any patches - return empty simulation.
        if(network.patches.length == 0){
            for(let currentTime=0; currentTime<this.endTime; currentTime+=this.timeIncrement){
                if(currentTime>=this.startTime)
                {
                    //copy current state of Network into networks
                    const snapshot = network.cloneNetwork();
                    networks.push(snapshot);
                }
            }
            return networks;
        }

        network.dispersals = engine.dispersalFunction.calculateDispersal(network);
        network.intrinsicExtinction= engine.intrinsicExtinctionFunction.calculateAll(network);
        network.numberColonised = network.calculatedNumberColonised(network);
        
        for(let currentTime=0; currentTime<this.endTime; currentTime+=this.timeIncrement)
        {
            if (engine.correlatedExtinctionFunction.c==0){
                network.connectivity = engine.connectivityFunction.calculateAll(network);
            }else{
                network.connectivity = new Array(network.patches.length).fill(0);
            }

            if(currentTime>=this.startTime)
            {
                //copy current state of Network into networks
                const snapshot = network.cloneNetwork();
                networks.push(snapshot);
            }
            network.colonisationEvents = 0;
            network.extinctionEvents= 0;

            for(let i = 0;i<network.patches.length;i++)
            {

                const randomOutcome = Math.random();

                if(network.patches[i].is_occupied==true)
                {
                    //calculate extinction probability
                    const extinctionProb: number = network.intrinsicExtinction[i]/(network.patches[i].localPatches.length+1);

                    if(randomOutcome<extinctionProb)
                    {
                        //remove current patch
                        network.setPatchAsUnoccupied(i);

                        //iterate through local patches                        
                        for(const currentPatch of network.patches[i].localPatches)
                        {
                            if(currentPatch.is_occupied==true)
                            {
                                network.setPatchAsUnoccupied(currentPatch.id);
                            }
                        }
                    }
                }
                else
                {
                    if(engine.correlatedExtinctionFunction.c>0){
                        network.connectivity[i] = engine.connectivityFunction.calculateOnce(network, i);
                    }
                    //calculate colonisation Probability
                    const colonisationProb: number = engine.colonizationFunction.calculateOnce(network,i);
                    if(randomOutcome<colonisationProb)
                    {
                        network.setPatchAsOccupied(i);
                    }
                }
            }
        }
        return networks;
    }
}