import fs from 'fs';
import path from 'path';
import { FileHandler } from '../../src/models/fileHandler'
import { IPatch } from '../../src/@types/patch';

describe("FileHandler", ()=>{
    const file_path = path.join(path.dirname(__dirname), "/", "test_spom.json");
    const text = fs.readFileSync(file_path, {encoding:"utf8"});
    
    const default_patch:IPatch = {
        "id": 0,
        "area": 0.005,
        "pos": {"x":3334.04,"y":6838.97},
        "is_occupied": false,
        "localPatches": []
    }

    test('Parse JSON text', ()=>{
        const config = FileHandler.textToConfig(text,"json");
        
        expect(config).toHaveProperty('meta.name', 'Diamina');
        expect(config).toHaveProperty('engine.dispersalFunction', {"alpha": 0.5,
        "beta": 1,
        "type": "Hanski1999"});
        expect(config).toHaveProperty('network.patches[0]');

        expect(config.network?.patches?.[0]).toStrictEqual(default_patch); // Courtesy of ChatGPT for fixing this line
        expect(FileHandler.textToConfig(text,"json"));
    });
});