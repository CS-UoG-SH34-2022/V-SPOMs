
import React, {Component} from 'react';
import { FileHandler } from "sim-spoms/src/models/fileHandler";
import { SPOM } from 'sim-spoms/src/spom';

interface ExportBtnProps {
  spom: SPOM;
}

interface ExportBtnState {
    fileName: string;
    fileDownloadURL: string;
}

class ExportBtn extends Component<ExportBtnProps, ExportBtnState> {
    downloadRef: React.RefObject<HTMLAnchorElement>;

    constructor(props:ExportBtnProps) {
        super(props);
       
        this.downloadRef = React.createRef<HTMLAnchorElement>();
     }

    public readonly state:ExportBtnState = {
        fileName:"spom.json",
        fileDownloadURL:""
    }

    render(): React.ReactNode {
      return (
      <div className="border-2 border-black rounded-lg text-center cursor-pointer mt-1">
            <div onClick={(e:React.MouseEvent<HTMLInputElement>)=>{this.handleExport(e)}}>Export</div>
            <a id="downloadBTN" style={{display: "none"}}
                download={this.state.fileName}
                href={this.state.fileDownloadURL}
                ref={this.downloadRef}
                >
            </a>
      </div>
      );
    }

    handleExport(e:React.MouseEvent<HTMLInputElement>){
      e.preventDefault();
      this.exportNetworkFile();
    }

    exportNetworkFile(){
        // Get config file contents
        const config = this.props.spom.getConfig();   
        const file_contents = FileHandler.configToText(config);   

        // Create URL for downloading the file
        const blob = new Blob([file_contents], { type: 'text/plain;charset=utf-8' })  
        const fileDownloadUrl = URL.createObjectURL(blob);

        // Change the anchor state and download from it automatically
        this.setState ({fileDownloadURL:fileDownloadUrl}, 
          () => {
            if(this.downloadRef.current){
                this.downloadRef.current.click(); 
            }       
            URL.revokeObjectURL(fileDownloadUrl);        
            this.setState({fileDownloadURL: ""})
        })    
    };
}
  
export default ExportBtn;
  