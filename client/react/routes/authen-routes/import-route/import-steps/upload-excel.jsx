import React from "react";
import {InputFileExcel} from "../../../../common/input-file-excel/input-file-excel";

export class UploadExcel extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };

    comps = [
        {
            fields: [
                {
                    label: "Thời khóa biểu toàn trường",
                    render: () => {
                        return (
                            <div className="upload-panel">
                                <div className="form-row">
                                    <InputFileExcel
                                        onUploaded={this.handleUpload}
                                        render={({onClick}) => (
                                            <button className="btn btn-info"
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
                            </div>
                        )
                    }
                }, {
                    label: "Chương trình học",
                    render: () => {
                        return (
                            <div className="upload-panel">

                            </div>
                        )
                    }
                }
            ],
            requiredField: 2,
        }
    ];

    render(){
        let {type} = this.props;
        return(
            <div className="upload-excel">

            </div>
        );
    }
}