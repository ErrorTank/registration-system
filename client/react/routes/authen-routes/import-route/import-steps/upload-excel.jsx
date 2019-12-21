import React from "react";
import {InputFileExcel} from "../../../../common/input-file-excel/input-file-excel";
import {ScheduleForm} from "./step-upload-forms/schedule-form";
import {EduProgramForm} from "./step-upload-forms/edu-program-from";

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
                            <ScheduleForm
                                form={this.props.scheduleForm}
                            />
                        )
                    }
                }, {
                    label: "Chương trình học",
                    render: () => {
                        return (
                            <EduProgramForm
                                form={this.props.eduProgramForm}
                            />
                        )
                    }
                }
            ],
            requiredField: 2,
        }
    ];

    render(){
        let {type} = this.props;
        let field = this.comps[type];
        return(
            <div className="upload-excel">
                {field.fields.map((f, i) => (
                    <div className="upload-panel"
                         key={i}
                    >
                        {f.render()}
                    </div>
                ))}
            </div>
        );
    }
}