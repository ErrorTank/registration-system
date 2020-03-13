import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";

import {userApi} from "../../../../../api/common/user-api";
import {MultipleTabWidget} from "../../../../common/multiple-tab-widget/multiple-tab-widget";
import pick from "lodash/pick";
import omit from "lodash/omit";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {subjectSchema} from "../schema";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {KComponent} from "../../../../common/k-component";

import {customHistory} from "../../../routes";
import isEqual from "lodash/isEqual";
import {appModal} from "../../../../common/modal/modals";
import * as yup from "yup";
import {commonPopup} from "../../../../common/common-popup/common-popup";
import {divisionsCache} from "../../../../../common/cache/api-cache/common-cache";
import {SubjectBasicForm} from "../subject-basic-form";
import {SubjectClassForm} from "../subject-class-form";
import {subjectApi} from "../../../../../api/common/subject-api";

class SubjectEditRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            draft: {},
            fetching: true,
            deleting: false,
            divisions: []
        };

        // initData: {
        //     subjectID: "",
        //         name: "",
        //         credits: 0,
        //         coefficient: 1,
        //         subjectsRequired: [],
        //         creditsRequired: 0,
        //         division: divisions[0],
        //         classes: []
        // }
        this.fetchingData().then(([data, divisions]) => {
            let division = divisions.find(each => each._id === data.division);
            this.form = createSimpleForm(subjectSchema, {
                initData: {
                    ...data,
                    division: division || divisions[0],
                }
            });

            this.onUnmount(this.form.on("change", (state) => {
                this.state.error && this.setState({error: ""});
                this.forceUpdate();
            }));

            this.setState({
                draft: {...data},
                fetching: false,
                divisions
            });
        });
    }

    fetchingData = () => {
        return Promise.all([subjectApi.getSubjectDetail(this.props.match.params.subjectID)], divisionsCache.get().then((divisions) => {
            let newDivisions = [
                {
                    label: "Tất cả bộ môn",
                    value: ""
                }
            ];
            return newDivisions.concat(divisions.map(each => ({label: each.name, value: each._id})));


        })).then(data => {
            return data;
        })
    };

    tabs = [
        {
            label: "Thông tin môn học",
            render: () => {
                return <SubjectBasicForm
                    form={this.form}
                    isEdit
                />
            }
        },{
            label: "Cài đặt lớp học",
            render: () => {
                return <SubjectClassForm
                    form={this.form}
                    isEdit
                />
            },
        },
    ];

    getServerError = (error) => {
        let errMatcher = {
            "duplicate_identityID": () => `Mã định danh ${error.extra.value} đã tồn tại`,
            "duplicate_email": () => `Email ${error.extra.value} đã tồn tại`,
            "duplicate_phone": () => `Số điện thoại ${error.extra.value} đã tồn tại`,
            "duplicate_username": () => `Tên đăng nhập ${error.extra.value} đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(error.message) ? errMatcher[error.message]() : "Đã có lỗi xảy ra."
    };

    handleUpdateSubject = (formData) => {
        console.log(formData)
        this.setState({loading: true});
        userApi.updateUserInfo(formData._id, omit(formData, "_id")).then((newInfo) => {
            this.setState({loading: false, draft: {...newInfo}});
            this.accountBasicForm.updateData(omit(newInfo, "info"));
            if(this.infoForm){
                this.infoForm.updateData({...newInfo.info});
            }
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Cập nhật thành công
                    </div>

                ),

            });

        }).catch(err => {
            this.setState({loading: false});
            console.log("dasd")
            appModal.alert({
                title: "Cập nhật thất bại",
                text: this.getServerError(err),
                btnText: "Ok",
                style: "danger"
            })
        })
    };

    deleteSubject = accountID => {
        return appModal.confirm({
            title: "Xác nhận",
            text: "Bạn muôn xóa tài khoản này?",
            btnText: "Đồng ý",
            cancelText: "Hủy bỏ"
        }).then(result => {
            if(result){
                this.setState({deleting: true});
                userApi.deleteAccount(accountID).then((data) => {
                    customHistory.push(`/manage/accounts`);
                    commonPopup.publish({
                        "common-popup": (
                            <div className="common-success-notify">
                                Xóa tài khoản {data.username} thành công
                            </div>

                        ),

                    });
                })

            }
        })
    };

    render() {
        let {fetching, draft, error, loading, deleting} = this.state;




        // console.log(formData)
        // console.log(this.infoForm ? draft : omit(draft, ["info"]))
        // console.log(isEqual(this.infoForm ? draft : omit(draft, ["info"]), formData))
        const canUpdate = !fetching && !deleting && !loading && !this.form.getInvalidPaths().length && !error && !isEqual(draft, this.form.getData()) ;
        return (
            <PageTitle
                title={"Cập nhật môn học"}
            >
                <AuthenLayoutTitle
                    title={"Cập nhật môn học"}
                >
                    <div className="account-edit-route account-route">
                        <div className="common-route-wrapper">

                            {fetching ? (
                                <LoadingInline/>
                            ) : (
                                <MultipleTabWidget
                                    tabs={this.tabs}
                                    initIndex={0}
                                />
                            )}


                            <div className="account-route-action">

                                <button className="btn btn-cancel"
                                        onClick={() => customHistory.push("/manage/subjects")}
                                >
                                    Hủy bỏ
                                </button>
                                <button className="btn btn-danger"
                                        onClick={() => this.deleteSubject(formData._id)}
                                        disabled={deleting}
                                >
                                    Xóa
                                    {deleting && (
                                        <LoadingInline/>
                                    )}
                                </button>
                                <button className="btn btn-next"
                                        onClick={() => this.handleUpdateSubject(formData)}
                                        disabled={!canUpdate}
                                >
                                    Cập nhật
                                    {loading && (
                                        <LoadingInline/>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default SubjectEditRoute;