import { MetaOptions } from "../@types/metaOptions";
import { IReplicate } from "../spom";

export enum ReplicateStatType{
    PropOfSurvivingReplicates = "Proportion of surviving replicates",
}

export abstract class ReplicateStat{
    meta: MetaOptions;
    type: ReplicateStatType;
    results: number[];

    public abstract calculateCurrentStats(replciates: IReplicate[]): void

}