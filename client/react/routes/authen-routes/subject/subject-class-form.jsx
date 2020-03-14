import React, {Component} from 'react';
import {SimpleDataTable} from "../../../common/common-data-table/simple-data-table";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {classModal} from "../../../common/modal/class-modal/class-modal";
import update from "lodash/update"
import {uid} from 'react-uid';
export class SubjectClassForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }



    addNewClass = () => {
        classModal.open({
            classInfo: null,
        }).then(data => {
            if(data){
                console.log(this.props.form.getPathData("classes").concat(data))
                this.props.form.updatePathData("classes", this.props.form.getPathData("classes").concat(data));
            }
        })
    };


    handleClickRow = (e, cl, i) => {
        classModal.open({
            classInfo: cl,
        }).then(data => {
            if(data){
                let newClasses = this.props.form.getPathData("classes").map(each => {
                   if(each._id === cl._id){
                       return {...cl, ...data};
                   }
                   return each;
                });

                this.props.form.updatePathData("classes", newClasses);
            }
        })
    };

    handleDeleteClass = (cl, index) => {
        let newClasses = this.props.form.getPathData("classes").filter((each, i) => i !== index);
        this.props.form.updatePathData("classes", newClasses);
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Tên lớp",
            cellDisplay: (s) => s.name,

        }, {
            label: "Số SV Min",
            cellDisplay: (s) => s.capacity.min,

        }, {
            label: "Số SV Max",
            cellDisplay: (s) => s.capacity.max,

        },{
            label: "",
            cellDisplay: (s, index) => (
                <button className="btn delete-btn" onClick={(e) => {
                    e.stopPropagation();
                    this.handleDeleteClass(s, index)
                }}><i className="fal fa-trash-alt"></i></button>
            ),

        },
    ];

    render() {
        let classes = this.props.form.getPathData("classes");

        return (
            <div className="subject-class-form common-form">
                <div className="form-title">
                    Thông tin lớp học phần
                </div>

                <div className="classes-container">
                    {classes.length ? (
                        <div className="classes-table">
                            <div className="table-actions">
                                <button className="btn add-btn" onClick={this.addNewClass}>
                                    <i className="fal fa-plus"></i> Tạo lớp học phần
                                </button>
                            </div>
                            <SimpleDataTable
                                className={"class-table"}
                                list={classes}
                                ref={table => this.table = table}
                                columns={this.columns}
                                rowTrackBy={(row, i) => row._id || uid(row)}
                                onClickRow={this.handleClickRow}
                            />
                        </div>
                    ) : (
                        <div className="empty-alert">
                            <p>Một học phần bắt buộc có ít nhất một lớp học phần</p>
                            <button className="btn" onClick={this.addNewClass}><i className="fal fa-plus"></i> Tạo lớp học phần đầu tiên</button>
                        </div>
                    )

                    }
                </div>
            </div>
        );
    }
}

