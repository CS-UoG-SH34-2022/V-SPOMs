import { IPatch, Patch } from "../@types/patch";
import { IBackendSPOMOptions } from "../backend";
import { IEngineOptions } from "../engine/base";
import { EngineFactory } from "../engine/engineFactory";
import { ColonisationType, IColonizationSettings } from "../functions/colonisation/base";
import { ConnectivityType, IConnectivitySettings } from "../functions/connectivity/base";
import { ICorrelatedExtinctionSettings } from "../functions/correlatedExtinction/correlatedExtinction";
import { DispersalType, IDispersalSettings } from "../functions/dispersal/base";
import { ExtinctionType, IExtinctionSettings } from "../functions/intrinsic-extinction/base";
import { Network } from "./network";
import { SimulationType } from "./simulation";


export class FileHandler{ 

    public static textToConfig(text: string,extension: string): IBackendSPOMOptions{
        let validConfig: IBackendSPOMOptions
        if(extension =="json")
        {
            const parsedJSON = JSON.parse(text);
            validConfig = parsedJSON;
        }
        //csv files only contain patches so we create a new network for them, then will default the engine 
        else if(extension == "csv")
        {
            validConfig = this.handleCSVFile(text)
            
        }
        return validConfig;
    }

    public static configToText(options: IBackendSPOMOptions): string{
        const text = JSON.stringify(options, undefined, 4);
        return text;
    }

    public static handleCSVFile(text: string): IBackendSPOMOptions{
        const os = navigator.userAgent;
        let wordList: string[]; 
        if (os.search('Windows')!==-1){
            wordList = text.split('\r\n');
        }
        else if (os.search('Mac')!==-1){
            wordList = text.split('\r\n');
        }
        else if (os.search('X11')!==-1 && !(os.search('Linux')!==-1)){
            wordList = text.split('\n');
        }
        else if (os.search('Linux')!==-1 && os.search('X11')!==-1){
            wordList = text.split('\n');
        }
        //assign meta value from options, if empty provide default
        const meta = {name: "Imported CSV Spom",description: ""};
            
        //create the engine from the engine options
        //load the parameters into the functions
        const params = wordList[1].split(",");
        const dispersalOpts: IDispersalSettings = {"type":DispersalType.Hanski1999,"alpha":+params[0],"beta":0};
        const colonisationOpts: IColonizationSettings = {"type":ColonisationType.HanskiA1994,"y":+params[2]};
        const connectivityOpts: IConnectivitySettings = {"type":ConnectivityType.MolianenA2004,"b":+params[1]};
        const intrinsicExtinctionOpts: IExtinctionSettings = {"type":ExtinctionType.Hanski2002,"e":+params[3],"x":+params[4]};
        const correlatedExtinctionOpts: ICorrelatedExtinctionSettings = {"c":0};
        const engineOpts: IEngineOptions = {"dispersalFunction":dispersalOpts,
                                        "colonizationFunction":colonisationOpts,
                                        "connectivityFunction":connectivityOpts,
                                        "intrinsicExtinctionFunction":intrinsicExtinctionOpts,
                                        "correlatedExtinctionFunction":correlatedExtinctionOpts,
                                        "simulationType":SimulationType.Iterator};

        const engineFactory: EngineFactory = EngineFactory.getEngineFactory();
        const engine = engineFactory.setEngine(engineOpts);      
        //load network
        let newPatch: string[] = [];
        const network: Network = new Network();
        for(let lineIndex =3;lineIndex<wordList.length;lineIndex++)
        {   
            newPatch = wordList[lineIndex].split(",");
            const ipatch: IPatch ={
                id: lineIndex-3,
                area: +newPatch[2],
                pos: {"x":+newPatch[0],"y":+newPatch[1]},
                is_occupied: Boolean(+newPatch[3]).valueOf(),
                localPatches: []
            }
            const patch:Patch = new Patch(ipatch);
            //console.log(patch);
            network.patches.push(patch);
        }
        const config:IBackendSPOMOptions = {"meta":meta,"network":network,"engine":engine}
        return config;
    }
}