import { Network } from "../models/network";
import { Vector2D } from "./vector2d";


export interface IPatch{
    id: number;
    area: number;
    pos: Vector2D;
    is_occupied: boolean;
    localPatches: Patch[]
}

export class Patch implements IPatch{
    id: number;
    area: number;
    pos: Vector2D;
    is_occupied: boolean;
    localPatches: Patch[]

    constructor(patch_template:IPatch){
        this.id = patch_template.id;
        this.area = patch_template.area;
        this.pos = patch_template.pos;
        this.is_occupied = patch_template.is_occupied;
        this.localPatches = [];
    }

    public static getDistance(patch1: Patch, patch2: Patch): number{
        const y = patch1.pos.x - patch2.pos.x;
        const x = patch1.pos.y - patch2.pos.y;
        
        const distanceWithRadii = Math.sqrt((x**2) + (y**2));
        const patch1Rad = Patch.getRadius(patch1);
        const patch2Rad = Patch.getRadius(patch2);
        let actualDistance = distanceWithRadii - patch1Rad - patch2Rad;
        if(actualDistance<0)
        {
            actualDistance = 0;
        }
        return actualDistance;
    }

    public static getRadius(patch: Patch):number{
        const radius = Math.sqrt(patch.area/Math.PI);  
        return radius;
    }

    public static getDistancesToPatches(network: Network): number[][]{
        const distances:number[][] = [];
        for(let i = 0; i < network.patches.length; i++) {
            const currentPatchDistances: number[] = [];
            distances[i] = currentPatchDistances;
            for(let j = 0; j< network.patches.length; j++) {
                distances[i][j] = this.getDistance(network.patches[i],network.patches[j]);
            }
            
        }
        return distances;
    }
}