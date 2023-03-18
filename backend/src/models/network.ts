import { MetaOptions } from "../@types/metaOptions";
import { IPatch, Patch } from "../@types/patch";
import { Vector2D } from "../@types/vector2d";
import { INetworkOptions } from "../backend";

export interface IRandomNetworkOptions{
    numPatches: number;
    maxArea: number;
    maxAbsoluteXPos: number;
    maxAbsoluteYPos: number;
    percentageOccupied: number;
}
export class Network{
    meta: MetaOptions;
    patches: Patch[];

    // Simulation data caching.
    dispersals: number[][];
    connectivity: number[];
    intrinsicExtinction: number[];
    colonisationEvents: number;
    extinctionEvents: number;
    numberColonised: number;

    constructor(networkOptions?:INetworkOptions){
        const defaultMeta:MetaOptions = {"name":"Default Network", "description":""};
        if(networkOptions){
            this.meta = networkOptions.meta || defaultMeta;
            this.patches = networkOptions.patches || [];
        }else{
            this.meta = defaultMeta;
            this.patches = [];
        }
        this.colonisationEvents = 0;
        this.extinctionEvents= 0;
        this.numberColonised = this.calculatedNumberColonised(this);

    }
    public calculatedNumberColonised(network:Network):number{
        let counter = 0;
        for(const patch of network.patches)
        {
            if(patch.is_occupied ==true)
            {
                counter++;
            }
        }
        return counter;
    }

    public cloneNetwork():Network{

        const networkOptions: INetworkOptions ={
            meta: this.meta
        };

        const clone = new Network(networkOptions);
        for(const patch of this.patches){
            clone.createPatch(patch.pos, patch.area, patch.is_occupied);
        }
        // Shallow copy beware!
        clone.connectivity = this.connectivity;
        clone.dispersals = this.dispersals;

        clone.intrinsicExtinction = this.intrinsicExtinction;
        clone.colonisationEvents = this.colonisationEvents;
        clone.extinctionEvents = this.extinctionEvents;

        clone.numberColonised = this.numberColonised;
        return clone;
    }

    
    public createRandomNetwork(ops:IRandomNetworkOptions):Network{
        //default network values
        const newNetwork = new Network();
        for(let i = 0;i<ops.numPatches;i++)
        {
            const area:number = Math.random() * ops.maxArea;
            const pos:Vector2D = {
                x: Math.random() * (ops.maxAbsoluteXPos + ops.maxAbsoluteXPos + 1) - ops.maxAbsoluteXPos,
                y: Math.random() * (ops.maxAbsoluteYPos + ops.maxAbsoluteYPos + 1) - ops.maxAbsoluteYPos
            };
            const is_occupied: boolean = Math.random() < ops.percentageOccupied;
            newNetwork.createPatch(pos,area,is_occupied);
        }
        return newNetwork;
    }
    
    public createPatch(pos?:Vector2D, area?:number, is_occupied?:boolean):number{
        const patch_id = this.patches.length;
        const patch_template:IPatch = {
            id: patch_id,
            area: area ?? 1,
            pos: pos ?? {x:0, y:0},
            is_occupied: is_occupied ?? false,
            localPatches: []
        } 
        const patch = new Patch(patch_template);
        this.patches.push(patch);
        return patch_id;
    }

    public updatePatchArea(patch_id:number, area:number){
        this.patches[patch_id].area = area;
    }

    public updatePatchPosition(patch_id: number, new_pos:Vector2D){
        this.patches[patch_id].pos = new_pos;
    }

    public updatePatchOccupancy(patch_id: number, is_occupied:boolean){
        this.patches[patch_id].is_occupied = is_occupied;
    }

    public getPatch(patch_id:number):Patch{
        return this.patches[patch_id];
    }

    public deletePatch(patch_id:number){
        this.patches.splice(patch_id,1);

        // Update indexes
        this.patches.forEach((patch, index)=>{
            patch.id = index;
        });
    }

    public getMeanPatchSize(): number{
        if(this.patches.length == 0) return 1;
        let areaSum = 0;
        this.patches.forEach((patch)=>{
            areaSum += patch.area;
        });

        return areaSum/this.patches.length;
    }

    public getMaxPatchSize(): number{
        if(this.patches.length == 0) return 1;
        let maxArea = 0;
        this.patches.forEach((patch)=>{
            maxArea = Math.max(maxArea, patch.area);
        });

        return maxArea;
    }

    public getDistanceBetweenPatch(patch1:Patch, patch2:Patch):number{
        return Math.sqrt(Math.pow(patch1.pos.x - patch2.pos.x,2) + Math.pow(patch1.pos.y - patch2.pos.y,2));
    }

    public getMeanDistanceBetweenPatches(): number{
        if(this.patches.length < 2) return 50;
        let distanceSum = 0;
        let numDistances = 0;
        for(let i = 0;i<this.patches.length;i++){
            for(let j = i+1;j<this.patches.length;j++){
                const distance = this.getDistanceBetweenPatch(this.patches[i], this.patches[j]);
                distanceSum += distance;
                numDistances++;
            }
        }
        return distanceSum/numDistances;
    }

    public getMaxDistanceBetweenPatches(): number{
        if(this.patches.length < 2) return 50;
        let maxDistance = 0;
        for(let i = 0;i<this.patches.length;i++){
            for(let j = i+1;j<this.patches.length;j++){
                const distance = this.getDistanceBetweenPatch(this.patches[i], this.patches[j]);
                maxDistance = Math.max(maxDistance, distance);
            }
        }
        return maxDistance;
    }
    
    public getAveragePatchCoordinate(): Vector2D
    {
        let averageX = 0;
        let averageY = 0;
        
        for(const patch of this.patches)
        {
            averageX += patch.pos.x;
            averageY += patch.pos.y;
        }
        averageX /= this.patches.length; 
        averageY /= this.patches.length;
        return {"x":averageX,"y":averageY};
    }

    public offsetPatchesToSpawnPoint(): void
    {
        const offset:Vector2D = this.getAveragePatchCoordinate();
        for(const patch of this.patches)
        {
            patch.pos = {"x":patch.pos.x-offset.x,"y":patch.pos.y-offset.y}
        }
    }

    public setDescription(text?: string): void{
        this.meta.description = text?? "";
    }

    public getDescription(): string{
        return this.meta.description?? "";
    }

    public setNetworkName(new_name?: string){
        this.meta.name = new_name?? "";
    }

    public getNetworkName(): string{
        return this.meta.name?? "";
    }

    public setPatchAsOccupied(patchIndex:number):void{
        this.patches[patchIndex].is_occupied = true;
        this.colonisationEvents += 1; 
        this.numberColonised +=  1;
    }
    public setPatchAsUnoccupied(patchIndex:number):void{
        this.patches[patchIndex].is_occupied = false;
        this.extinctionEvents += 1; 
        this.numberColonised -= 1;
    }
}
