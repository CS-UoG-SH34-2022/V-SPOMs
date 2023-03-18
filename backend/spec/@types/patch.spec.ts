import { Patch } from '../../src/@types/patch';
import { Network } from '../../src/models/network'

describe("Patches", ()=>{
    
    // Initialize mocked networks
    let blankNetwork:Network;
    //let populatedNetwork:Network;

    beforeEach(()=>{
        blankNetwork = new Network();
    })
    
    it ('should contain the correct distance between patches', ()=>{
        const patch_id1 = blankNetwork.createPatch({'x':0, 'y':0});
        const patch_id2 = blankNetwork.createPatch({'x':6, 'y':8});
        const patch1 = blankNetwork.getPatch(patch_id1);
        const patch2 = blankNetwork.getPatch(patch_id2);

        const area = 1*Math.PI;
        blankNetwork.updatePatchArea(patch_id1, area);
        blankNetwork.updatePatchArea(patch_id2, area);

        const distance = Patch.getDistance(patch1,patch2);
        expect(distance).toStrictEqual(8);
    });

    it('should return the correct radius of a patch', ()=>{
        const radius = 10;
        const patch:Patch = new Patch({"area":Math.PI*(radius*radius),"id":0,"is_occupied":true,"pos":{"x":0,"y":0},"localPatches":[]});
        expect(Patch.getRadius(patch)).toEqual(radius);
    })

});