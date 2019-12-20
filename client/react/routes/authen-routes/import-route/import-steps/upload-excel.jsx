import React from "react";
import {InputFileExcel} from "../../../../common/input-file-excel/input-file-excel";

export class UploadExcel extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <div className="upload-excel">
                <InputFileExcel
                    onUploaded={this.handleUpload}
                    render={({onClick}) => (
                        <button className="btn"
                                onClick={(file) => onClick(file)}
                        >
                            Tải lên
                        </button>
                    )}
                />
                <span className="file-name">
                {name}
                </span>
            </div>
        );
    }
}