import { MetaOptions } from "../@types/metaOptions";
import { Network } from "../models/network";

export enum NetworkStatType{
    PropOfOccupiedArea = "Proportion Of Occupied Area",
    PropOccupied = "Proportion Of Occupied Patches",
    TurnoverEvents = "Number of extinction and colonisation events",
    PropOfSurvivingReplicates = "Proportion of surviving replicates",
}

export abstract class NetworkStat{
    meta: MetaOptions;
    type: NetworkStatType;
    results: number[];
    max: number;

    public abstract calculateCurrentStats(network: Network): void

}