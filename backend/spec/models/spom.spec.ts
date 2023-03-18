import fs from 'fs';
import path from 'path';
import { SPOM } from '../../src/spom';
import { FileHandler } from '../../src/models/fileHandler';
import { IBackendSPOMOptions, createSPOM } from '../../src/backend';

let spom: SPOM;
let config: IBackendSPOMOptions;

// Before running tests - read test_spom.json and create config from it. 
beforeAll(() => {
    const file_path = path.join(path.dirname(__dirname), "/", "test_spom.json");
    const text = fs.readFileSync(file_path, {encoding:"utf8"});
    config = FileHandler.textToConfig(text,"json");
  });

beforeEach(() => {
    spom = createSPOM(config);
});

describe('Create SPOM', () => {
    it('should create a new SPOM', () => {
        expect(spom).toBeTruthy();
    });
});

describe('SPOM simulation', () => {
    it('should run 1 simulation for 10 iters', () => {
        spom.simulate(1, 10);
        expect(spom.replicates.length).toBe(1);
        expect(spom.replicates[0].simulationSnapshots.length).toBe(10);
    });

    it('should run 2 simulations for 10 iterations', () => {
        spom.simulate(2, 10);
        expect(spom.replicates.length).toBe(2);
        expect(spom.replicates[0].simulationSnapshots.length).toBe(10);
        expect(spom.replicates[1].simulationSnapshots.length).toBe(10);
    });

    it('should clear replicates between simulations', () => {
        spom.simulate(2, 10);
        expect(spom.replicates.length).toBe(2);
        expect(spom.replicates[0].simulationSnapshots.length).toBe(10);
        expect(spom.replicates[1].simulationSnapshots.length).toBe(10);

        spom.simulate(2, 10);
        expect(spom.replicates.length).toBe(2);
        expect(spom.replicates[0].simulationSnapshots.length).toBe(10);
        expect(spom.replicates[1].simulationSnapshots.length).toBe(10);
    });
});