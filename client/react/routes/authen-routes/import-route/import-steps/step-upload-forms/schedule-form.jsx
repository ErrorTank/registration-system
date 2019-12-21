import React from "react";
import {InputFileExcel} from "../../../../../common/input-file-excel/input-file-excel";
import {KComponent} from "../../../../../common/k-component";
import {uploadCommonFile} from "../../../../../../common/utils/excel";
import * as yup from "yup";
import {createSimpleForm} from "../../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../../common/common-input/common-input";
import {Select} from "../../../../../common/select/select";
import {years} from "../../../../../../const/years";
import {semester} from "../../../../../../const/semester";
import {studentGroups} from "../../../../../../const/student-group";



export class ScheduleForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false

        };
        const loginSchema = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Thời khóa biểu không được để trống"),
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object()
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                ...props.form
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    };

    handleUpload = async (file) => {
        this.setState({loading: true});
        let result = await uploadCommonFile(file);
        this.setState({loading: false});
        this.form.updateData(result);
    };

    render() {
        let data = this.form.getData();
        console.log(data)
        return (
            <div className="schedule-form">
                <p className="form-title">Thời khóa biểu toàn trường</p>
                <div className="upload-form-row">
                    <p className="upload-label">Chọn file</p>
                    <InputFileExcel
                        onUploaded={this.handleUpload}
                        render={({onClick}) => (
                            <button className="btn btn-upload"
                                    onClick={(file) => onClick(file)}
                            >
                                Tải lên
                            </button>
                        )}
                    />
                    <span className="file-name">{name}</span>
                </div>
                {!!data.list.length && (
                    <>
                        <div className="upload-form-row">
                            <p className="upload-label">Năm học</p>
                            {this.form.enhanceComponent("year", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={years}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(e.target.value)
                                    }}
                                />

                            ), true)}
                        </div>
                        <div className="upload-form-row">
                            <p className="upload-label">Học kì</p>
                            {this.form.enhanceComponent("semester", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={semester}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(e.target.value)
                                    }}
                                />

                            ), true)}
                        </div>
                        <div className="upload-form-row">
                            <p className="upload-label">Nhóm</p>
                            {this.form.enhanceComponent("studentGroup", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={studentGroups}
                                    value={others.value}
                                    displayAs={(each) => each.label}
                                    getValue={each => each.value}
                                    onChange={e => {
                                        onChange(e.target.value)
                                    }}
                                />

                            ), true)}
                        </div>
                    </>
                )

                }
            </div>
        );
    }
}