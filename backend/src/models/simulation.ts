import { MetaOptions } from "../@types/metaOptions";
import { Engine } from "../engine/engine";
import { Network } from "./network";

export enum SimulationType{
    Iterator = "Iterator",
    Gillespie = "Gillespie",
    Null = "Iterator",
}

export abstract class Simulation{

    meta: MetaOptions;
    simulationType: SimulationType;
    startTime: number;
    endTime: number;
    timeIncrement: number;

    public abstract step(netowrk: Network): Network
    public abstract runSimulation(engine: Engine, network:Network): Network[]

    public abstract getSimulation(): Simulation;
    public abstract setSimulation(simulation: ISimulationParameters): void
}

export interface ISimulationParameters{
    meta: MetaOptions;
    startTime: number;
    endTime: number;
    timeIncrement: number;
}