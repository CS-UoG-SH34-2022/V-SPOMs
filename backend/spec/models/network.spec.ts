import fs from 'fs';
import path from 'path';
import { Vector2D } from '../../src/@types/vector2d';
import { FileHandler } from '../../src/models/fileHandler';
import { Network } from '../../src/models/network'

describe("Network", ()=>{
    const file_path = path.join(path.dirname(__dirname), "/", "test_spom.json");
    const text = fs.readFileSync(file_path, {encoding:"utf8"});
    const config = FileHandler.textToConfig(text,"json");
    const networkOptions = config.network;
    
    it ('should initialize network from options', ()=>{
        expect(()=>{new Network(networkOptions)}).not.toThrowError();
        const network = new Network(networkOptions);
        expect(network.patches.length).toEqual(networkOptions?.patches?.length);
        expect(network.meta).toEqual(networkOptions?.meta);
    });

    it ('should initialize a blank network', ()=>{
        expect(()=>{new Network()}).not.toThrowError();
        const network = new Network();
        expect(network.patches.length).toEqual(0);
        expect(network.meta).toEqual({"name":"Default Network", "description":""});
    });

    // Initialize mocked networks
    let blankNetwork:Network;
    let populatedNetwork:Network;
    beforeEach(()=>{
        blankNetwork = new Network();
        populatedNetwork = new Network(networkOptions);
    })
    
    it ('should create a patches from options', ()=>{
        const pos:Vector2D = {'x':5, 'y':6};
        let patch_id = blankNetwork.createPatch(pos);
        expect(blankNetwork.patches).toHaveLength(1);
        expect(blankNetwork.patches[patch_id].pos).toStrictEqual(pos);

        const area = 5;
        patch_id = blankNetwork.createPatch(pos, area);
        expect(blankNetwork.patches).toHaveLength(2);
        expect(blankNetwork.patches[patch_id].pos).toStrictEqual(pos);
        expect(blankNetwork.patches[patch_id].area).toStrictEqual(area);
    });

    it ('should create a patch with next available id', ()=>{
        const pos:Vector2D = {'x':5, 'y':6};
        const area = 5;
        const patchSize = populatedNetwork.patches.length;
        const new_patch_id = populatedNetwork.createPatch(pos, area);
        expect(populatedNetwork.patches).toHaveLength(patchSize+1);
        expect(new_patch_id).toEqual(patchSize);
        expect(populatedNetwork.patches[new_patch_id].id).toEqual(patchSize);
    });

    it ('should update area of patch with id', ()=>{
        const patch_id = 1;
        const new_area = 3;
        populatedNetwork.updatePatchArea(patch_id, new_area);
        expect(populatedNetwork.patches[patch_id].area).toEqual(new_area);
    });

    it ('should update position of patch with id', ()=>{
        const patch_id = 1;
        const new_pos:Vector2D = {'x':2, 'y':3};
        populatedNetwork.updatePatchPosition(patch_id, new_pos);
        expect(populatedNetwork.patches[patch_id].pos).toEqual(new_pos);
    });

    it ('should return a patch when provided the id', ()=>{
        const patch_id = 0;
        const patch = populatedNetwork.getPatch(patch_id);
        expect(patch).toEqual(networkOptions?.patches?.[0]);
        expect(patch_id).toEqual(populatedNetwork.patches[0].id);
        expect(populatedNetwork.getPatch(-1)).toEqual(undefined);
    });

    it ('should delete a patch and update ids', ()=>{
        const patch_id = 3;
        const previous_length = populatedNetwork.patches.length;
        const patch_to_delete = populatedNetwork.patches[patch_id];
        populatedNetwork.deletePatch(patch_id);
        expect(populatedNetwork.patches.length).toEqual(previous_length-1);
        expect(Object.keys(populatedNetwork.patches)).not.toContain(patch_to_delete);
        populatedNetwork.patches.forEach((patch, index)=>{
            expect(patch.id).toEqual(index);
        })
    });

    it ('should allow for the description to be set and retrieved ', ()=>{
        const description = "An example network of Tanzania ";
        populatedNetwork.setDescription(description);
        expect(populatedNetwork.meta.description).toEqual(description);
        
        const returnedDescritpion: string = populatedNetwork.getDescription();
        expect(returnedDescritpion).toEqual(populatedNetwork.meta.description);

    });

    it (' should allow for the average position of a patch to be calculated', ()=>{
        const averageLocation: Vector2D = {"x":3271.6163829787233,"y": 6690.081170212764};
        expect(populatedNetwork.getAveragePatchCoordinate()).toEqual(averageLocation);
    });

    it (' should allow for the average position of a patch to be offsetted around 0,0', ()=>{
        const initalExpectedAverageLocation: Vector2D = {"x":3271.6163829787233,"y": 6690.081170212764};
        const finalExpectedAverageLocation: Vector2D = {"x":0,"y":0};

        expect(populatedNetwork.getAveragePatchCoordinate()).toEqual(initalExpectedAverageLocation);
        populatedNetwork.offsetPatchesToSpawnPoint();
        const finalReceivedAverageLocation: Vector2D = populatedNetwork.getAveragePatchCoordinate()
        finalReceivedAverageLocation.x = Math.floor(finalReceivedAverageLocation.x)
        finalReceivedAverageLocation.y = Math.floor(finalReceivedAverageLocation.y)
        expect(finalReceivedAverageLocation).toEqual(finalExpectedAverageLocation);

    });

    'when setting a patch as unoccupied'
    it (' should correctly update the state of the patch, and values of the network', ()=>{
        const occupiedPatchIndex = blankNetwork.createPatch({"x":0,"y":0},1,true)
        blankNetwork.setPatchAsUnoccupied(occupiedPatchIndex);
        blankNetwork.numberColonised = blankNetwork.calculatedNumberColonised(blankNetwork)
        expect(blankNetwork.patches[0].is_occupied).toEqual(false);
        expect(blankNetwork.extinctionEvents).toEqual(1);
        expect(blankNetwork.numberColonised).toEqual(0);

    });

    'when setting a patch as occupied'
    it (' should correctly update the state of the patch, and values of the network', ()=>{
        const unoccupiedPatchIndex = blankNetwork.createPatch({"x":0,"y":0},1,false)
        blankNetwork.setPatchAsOccupied(unoccupiedPatchIndex);
        blankNetwork.numberColonised = blankNetwork.calculatedNumberColonised(blankNetwork)
        expect(blankNetwork.patches[0].is_occupied).toEqual(true);
        expect(blankNetwork.colonisationEvents).toEqual(1);
        expect(blankNetwork.numberColonised).toEqual(1);

    });
});