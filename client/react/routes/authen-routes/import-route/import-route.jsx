import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayout} from "../../../layout/authen-layout/authen-layout";
import {DataTypePicker} from "./import-steps/data-type-picker";
import {UploadExcel} from "./import-steps/upload-excel";
import {ReviewData} from "./import-steps/review-data";
import {MultipleSteps} from "../../../common/multiple-steps/multiple-steps";

export default class ImportRoute extends React.Component {
    constructor(props) {
        super(props);
        this.initData = {
            dataType: 0,
            currentStep: 0,
            scheduleItems: {
                value: [],
                year: new Date().getFullYear(),
                semester: null,
                studentGroup: null
            },
            educateProgram: [],
            results: []
        };
        this.state = {
            ...this.initData
        };
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
            onClickNav: () => this.setState({...this.initData}),
            hideCancel: () => true,
            hideNext: () => true,
        },
        {
            title: "Tải lên tệp dữ liệu",
            subtitle: "Tải dữ liệu lên",
            render: () => (
                <UploadExcel
                    type={this.state.dataType}
                />
            ),
            canNext: () => true,
            onNext: () => this.setState({currentStep: 2}),
            onClickNav: () => this.setState({currentStep: 1}),
            hideCancel: () => true,
            onPrevious: () => {
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
        let {currentStep} = this.state;
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