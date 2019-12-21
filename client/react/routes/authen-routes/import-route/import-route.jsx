import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayout} from "../../../layout/authen-layout/authen-layout";
import {DataTypePicker} from "./import-steps/data-type-picker";
import {UploadExcel} from "./import-steps/upload-excel";
import {ReviewData} from "./import-steps/review-data";
import {MultipleSteps} from "../../../common/multiple-steps/multiple-steps";
import * as yup from "yup";
import {years} from "../../../../const/years";
import {semester} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {specialitesCache} from "../../../../common/cache/api-cache/common-cache";
import {createSimpleForm} from "../../../common/form-validator/form-validator";

export default class ImportRoute extends React.Component {
    constructor(props) {
        super(props);
        this.scheduleItems = {
            fileName: "",
            list: [],
            year: years[0],
            semester: semester[0],
            studentGroup: studentGroups[0],
        };
        this.educateProgram = {
            fileName: "",
            list: [],
            speciality: specialitesCache.syncGet()[0],
        };
        this.initData = {
            dataType: 0,
            currentStep: 0,
            results: [],

        };
        this.state = {
            ...this.initData
        };
        const eduProgramForm = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Chương trình học không được để trống"),
            speciality: yup.object(),
        });
        this.eduProgramForm = createSimpleForm(eduProgramForm, {
            initData: {
                ...this.educateProgram
            }
        });
        const scheduleForm = yup.object().shape({
            fileName: yup.string(),
            list: yup.array().min(1, "Thời khóa biểu không được để trống"),
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object()
        });
        this.scheduleForm = createSimpleForm(scheduleForm, {
            initData: {
                ...this.scheduleItems
            }
        });

    };

    handleImportData = () => {

    };

    steps = [
        {
            title: "Chọn loại dữ liệu tải lên",
            subtitle: "Chọn loại dữ liệu",
            render: () => (
                <DataTypePicker
                    onChange={dataType => this.setState({dataType, currentStep: 1})}
                />
            ),
            onNext: () => this.setState({currentStep: 1}),
            onClickNav: () => {
                this.scheduleForm.resetData();
                this.eduProgramForm.resetData();
                this.setState({...this.initData})
            },
            hideCancel: () => true,
            hideNext: () => true,
        },
        {
            title: "Tải lên tệp dữ liệu",
            subtitle: "Tải dữ liệu lên",
            render: () => (
                <UploadExcel
                    type={this.state.dataType}
                    scheduleForm={this.scheduleForm}
                    eduProgramForm={this.eduProgramForm}
                />
            ),
            canNext: () => this.scheduleForm.isValid() && this.eduProgramForm.isValid(),
            onNext: () => this.setState({currentStep: 2}),
            onClickNav: () => this.setState({currentStep: 1}),
            hideCancel: () => true,
            onPrevious: () => {
                this.scheduleForm.resetData();
                this.eduProgramForm.resetData();
                this.setState({...this.initData});
            },
        },{
            title: "Xác nhận thông tin dữ liệu tải lên",
            subtitle: "Xác nhận dữ liệu",
            render: () => (
                <ReviewData/>
            ),
            canNext: () => false,
            onNext: this.handleImportData,
            onPrevious: () => {
                this.setState({currentStep: 1});
            },
        },
    ];

    render() {
        let {currentStep, loadSpec} = this.state;
        return (
            <PageTitle
                title={"Import"}
            >
                <AuthenLayout
                    title={"Import dữ liệu"}
                >
                    <div className="import-route">
                        <div className="multiple-steps-wrapper">
                            <MultipleSteps
                                btnConfig={{
                                    nextText: "Tiếp theo",
                                    cancelText: "Hủy bỏ",
                                    finishText: "Import dữ liệu",
                                    previousText: "Trở về"
                                }}
                                curStepIndex={currentStep}
                                steps={this.steps}
                                onCancel={() => {
                                    this.setState({...this.initData})
                                }}
                            />

                        </div>

                    </div>

                </AuthenLayout>
            </PageTitle>
        );
    }
}