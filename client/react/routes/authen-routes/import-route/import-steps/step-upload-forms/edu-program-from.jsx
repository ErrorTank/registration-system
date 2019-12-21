import React from "react";
import * as yup from "yup";
import {createSimpleForm} from "../../../../../common/form-validator/form-validator";
import {
    uploadCommonFile
} from "../../../../../../common/utils/excel";
import {InputFileExcel} from "../../../../../common/input-file-excel/input-file-excel";
import {Select} from "../../../../../common/select/select";
import {years} from "../../../../../../const/years";
import {semester} from "../../../../../../const/semester";
import {studentGroups} from "../../../../../../const/student-group";
import {KComponent} from "../../../../../common/k-component";
import {specialitesCache} from "../../../../../../common/cache/api-cache/common-cache";

export class EduProgramForm extends KComponent{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            specialities: []
        };
        const loginSchema = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Chương trình học không được để trống"),
            speciality: yup.object(),
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
        specialitesCache.get().then(specialities => this.setState({specialities}))
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
                <p className="form-title">Chương trình học</p>
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
                            {this.form.enhanceComponent("speciality", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    error={error}
                                    options={this.state.specialities}
                                    value={others.value}
                                    displayAs={(each) => each.name}
                                    getValue={each => each._id}
                                    onChange={e => {
                                        onChange(this.state.specialities.find(sp => sp._id === e.target.value))
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