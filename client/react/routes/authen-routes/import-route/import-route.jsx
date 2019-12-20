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
            currentStep: 0
        };
        this.state = {
            ...this.initData
        };
    };

    handleImportData = () => {

    };

    steps = [
        {
            title: "Tải lên tệp dữ liệu",
            subtitle: "Tải dữ liệu lên",
            render: () => (
                <UploadExcel

                />
            ),
            canNext: () => true,
            onNext: () => this.setState({currentStep: 1}),
            onClickNav: () => this.setState({...this.initData}),
            hideCancel: () => true
        },{
            title: "Xác nhận thông tin dữ liệu tải lên",
            subtitle: "Xác nhận dữ liệu",
            render: () => (
                <ReviewData/>
            ),
            canNext: () => false,
            onNext: this.handleImportData,
            onPrevious: () => {
                this.setState({...this.initData});
            },
            hideCancel: () => true
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