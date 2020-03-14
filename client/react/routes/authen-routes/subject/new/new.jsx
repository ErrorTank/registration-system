import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";

import {userApi} from "../../../../../api/common/user-api";
import {MultipleTabWidget} from "../../../../common/multiple-tab-widget/multiple-tab-widget";
import pick from "lodash/pick";
import omit from "lodash/omit";

import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {getAccountFormStructure, subjectSchema} from "../schema";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {KComponent} from "../../../../common/k-component";

import {customHistory} from "../../../routes";
import isEqual from "lodash/isEqual";
import {appModal} from "../../../../common/modal/modals";
import {commonPopup} from "../../../../common/common-popup/common-popup";
import {MultipleSteps} from "../../../../common/multiple-steps/multiple-steps";
import {divisionsCache} from "../../../../../common/cache/api-cache/common-cache";
import {SubjectBasicForm} from "../subject-basic-form";
import {SubjectClassForm} from "../subject-class-form";
import {subjectApi} from "../../../../../api/common/subject-api";

class AccountNewRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            loading: false,
            error: null,
            curStep: 0,
            divisions: []
        };
        divisionsCache.get().then((divisions) => {
            let newDivisions = [
                {
                    label: "Chọn bộ môn",
                    value: ""
                }
            ].concat(divisions.map(each => ({label: each.name, value: each._id})));
            this.form = createSimpleForm(subjectSchema, {
                initData: {
                    subjectID: "",
                    name: "",
                    credits: 0,
                    coefficient: 1,
                    subjectsRequired: [],
                    creditsRequired: 0,
                    classes: [],
                    division:  newDivisions[0].value,
                }
            });
            this.setState({divisions: newDivisions});
            this.onUnmount(this.form.on("change", (state) => {
                this.state.error && this.setState({error: ""});
                this.forceUpdate();
            }));
            this.form.validateData();

        });

    }


    tabs = [
        {
            subtitle: "Thông tin môn học",
            render: () => {
                return <SubjectBasicForm
                    form={this.form}
                    divisions={this.state.divisions}
                />
            },
            onNext: () => {
                this.setState({curStep: 1});
            },
            onClickNav: () => {
                this.setState({curStep: 0})
            },
            canNext: () => this.form && this.form.getInvalidPaths().length <= 1 && this.form.getInvalidPaths()[0] ? this.form.getInvalidPaths()[0] === "classes" : true,
        }, {
            subtitle: "Thông tin lớp học phần",
            render: () => {

                return <SubjectClassForm
                    form={this.form}
                />
            },
            nextLoading: () => {
                return this.state.loading;
            },
            canNext: () => !this.state.loading && !this.form.getInvalidPaths().length,
            onNext: () => {
                this.createNewSubject();
            },
            onPrevious: () => {
                this.setState({curStep: 0});
            },

        },
    ];

    getServerError = (error) => {
        let errMatcher = {
            "duplicate_subjectID": () => `Mã môn ${error.extra.subjectID} (${error.extra.name}) đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(error.message) ? errMatcher[error.message]() : "Đã có lỗi xảy ra."
    };

    createNewSubject = () => {
        this.setState({loading: true});
        subjectApi.createNewSubject(this.form.getData()).then((newInfo) => {
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Tạo mới thành công
                    </div>

                ),

            });
            customHistory.push(`/manage/subject/${newInfo._id}/edit`);

        }).catch(err => {
            this.setState({loading: false});

            appModal.alert({
                title: "Tạo mới thất bại",
                text: this.getServerError(err),
                btnText: "Ok",
                style: "danger"
            })
        })
    };


    render() {
        let {error, loading, curStep} = this.state;
        console.log(this.form?.getInvalidPaths())
        return (
            <PageTitle
                title={"Tạo học phần mới"}
            >
                <AuthenLayoutTitle
                    title={"Tạo học phần mới"}
                >
                    <div className="account-new-route account-route">
                        <div className="common-route-wrapper">
                            {this.form && (
                                <MultipleSteps
                                    btnConfig={{
                                        nextText: "Tiếp theo",
                                        cancelText: "Hủy bỏ",
                                        finishText: "Tạo mới",
                                        previousText: "Trở về"
                                    }}
                                    curStepIndex={curStep}
                                    steps={this.tabs}
                                    onCancel={() => customHistory.push("/manage/subjects")}
                                />
                            )}

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default AccountNewRoute;