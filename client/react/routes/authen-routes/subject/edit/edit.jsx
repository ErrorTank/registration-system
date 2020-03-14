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
import {SimpleDataTable} from "../../../../common/common-data-table/simple-data-table";

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
            this.form = createSimpleForm(subjectSchema, {
                initData: {
                    ...data,
                    division: data.division || divisions[0].value,
                }
            });

            this.onUnmount(this.form.on("change", (state) => {
                this.state.error && this.setState({error: ""});
                this.forceUpdate();
            }));
            this.form.validateData();
            this.setState({
                draft: {...data, division: data.division || divisions[0].value},
                fetching: false,
                divisions
            });
        });
    }

    fetchingData = () => {
        return Promise.all([subjectApi.getSubjectDetail(this.props.match.params.subjectID), divisionsCache.get().then((divisions) => {
            let newDivisions = [
                {
                    label: "Chọn bộ môn",
                    value: ""
                }
            ];
            return newDivisions.concat(divisions.map(each => ({label: each.name, value: each._id})));


        })])
    };

    tabs = [
        {
            label: "Thông tin môn học",
            render: () => {
                return <SubjectBasicForm
                    form={this.form}
                    isEdit
                    divisions={this.state.divisions}
                />
            }
        },{
            label: "Cài đặt lớp học phần",
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
            "duplicate_subjectID": () => `Mã môn ${error.extra.subjectID} (${error.extra.name}) đã tồn tại`,
            "un_deletable_classes": () => (
                <div className="err-reason">
                    <div className="err-section">
                        <p className="err-title">Lớp học phần nằm trong TKB toàn trường</p>
                        <SimpleDataTable
                            className={"err-table"}
                            list={error.extra}
                            columns={[
                                {
                                    label: "STT",
                                    cellDisplay: (s, i) => i + 1,

                                },  {
                                    label: "Tên lớp",
                                    cellDisplay: (s) => s.class.name
                                    ,

                                }, {
                                    label: "Thứ",
                                    cellDisplay: (s) => s.dayOfWeek + 1,

                                }, {
                                    label: "Ca",
                                    cellDisplay: (s) => s.from.name + "-" + s.to.name

                                }, {
                                    label: "Phòng học",
                                    cellDisplay: (s) => s.classRoom.name

                                },  {
                                    label: "Giảng viên",
                                    cellDisplay: (s) => {
                                        return s.instructor.user ? s.instructor.user.name + `(${s.instructor.user.identityID})` : "Unknown"
                                    }

                                }
                            ]}
                            rowTrackBy={(row, i) => row._id}
                        />
                    </div>
                </div>
            ),
        };
        return errMatcher.hasOwnProperty(error.message) ? errMatcher[error.message]() : "Đã có lỗi xảy ra."
    };

    handleUpdateSubject = () => {
        this.setState({loading: true});
        let updatedData = this.form.getData();
        subjectApi.updateSubject(updatedData._id, updatedData).then((data) => {
            let newData = {...data, division: data.division || this.state.divisions[0].value,};
            this.setState({
                draft:  {...newData},
                loading: false,
            });
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Cập nhật thành công
                    </div>

                ),

            });
            this.form.updateData({...newData});


        }).catch(err => {
            console.log("dsa")
            this.setState({loading: false});
            appModal.alert({
                title: "Cập nhật thất bại",
                text: this.getServerError(err),
                btnText: "Ok",
                style: "danger"
            }).then(() => {
                this.refreshData();
            })
        });

    };

    deleteSubject = () => {
        let subjectID = this.props.match.params.subjectID;
        return appModal.confirm({
            title: "Xác nhận",
            text: (
                <div className="alert-confirm">
                    <p className="alert-title">Bạn có muốn xóa học phần này? Học phần sẽ chỉ bị xóa nếu:</p>
                    <div className="prerequisites">
                        <p>- Không có lớp học phần nào thuộc thời khóa biểu toàn trường</p>
                        <p>- Học phần không thuộc chương trình học nào</p>
                        <p>- Không có lớp học phần nào đã được đăng ký trước đó (Kết quả đã nằm trong bảng điểm của sinh viên)</p>
                    </div>
                    <p className="alert-sub">Các lớp và nhóm lớp học phần liên quan sẽ bị xóa khi xóa học phần này. Các học phần khác có điều kiện tiên quyết bao gồm học phần này sẽ không còn hiệu lực.</p>
                </div>
            ),
            btnText: "Đồng ý",
            cancelText: "Hủy bỏ"
        }).then(result => {
            if(result){
                this.setState({deleting: true});
                subjectApi.deleteSubject(subjectID).then((data) => {
                    customHistory.push(`/manage/subjects`);
                    commonPopup.publish({
                        "common-popup": (
                            <div className="common-success-notify">
                                Xóa học phần {data.name}({data.subjectID}) thành công
                            </div>

                        ),

                    });
                }).catch(err => {
                    let { items,
                        programs,
                        results} = err.extra;
                    this.setState({deleting: false});
                    appModal.alert({
                        title: "Xóa học phần thất bại",
                        text: (
                            <div className="err-reason">
                                {!!items.length && (
                                    <div className="err-section">
                                        <p className="err-title">Thời khóa biểu toàn trường</p>
                                        <SimpleDataTable
                                            className={"err-table"}
                                            list={items}
                                            columns={[
                                                {
                                                    label: "STT",
                                                    cellDisplay: (s, i) => i + 1,

                                                },  {
                                                    label: "Tên lớp",
                                                    cellDisplay: (s) => s.class.name
                                                    ,

                                                }, {
                                                    label: "Thứ",
                                                    cellDisplay: (s) => s.dayOfWeek + 1,

                                                }, {
                                                    label: "Ca",
                                                    cellDisplay: (s) => s.from.name + "-" + s.to.name

                                                }, {
                                                    label: "Phòng học",
                                                    cellDisplay: (s) => s.classRoom.name

                                                },  {
                                                    label: "Giảng viên",
                                                    cellDisplay: (s) => {
                                                        return s.instructor.user ? s.instructor.user.name + `(${s.instructor.user.identityID})` : "Unknown"
                                                    }

                                                }
                                            ]}
                                            rowTrackBy={(row, i) => row._id}
                                        />
                                    </div>
                                )}
                                {!!programs.length && (
                                    <div className="err-section">
                                        <p className="err-title">Chương trình học</p>
                                        <SimpleDataTable
                                            className={"err-table"}
                                            list={programs}
                                            columns={[
                                                {
                                                    label: "STT",
                                                    cellDisplay: (s, i) => i + 1,

                                                },  {
                                                    label: "Tên chuyên ngành",
                                                    cellDisplay: (s) => s.speciality.name
                                                    ,

                                                },
                                            ]}
                                            rowTrackBy={(row, i) => row._id}
                                        />
                                    </div>
                                )}
                                {!!results.length && (
                                    <div className="err-section">
                                        <p className="err-title">Bảng điểm</p>
                                        <SimpleDataTable
                                            className={"err-table"}
                                            list={results}
                                            columns={[
                                                {
                                                    label: "STT",
                                                    cellDisplay: (s, i) => i + 1,

                                                },  {
                                                    label: "Sinh viên",
                                                    cellDisplay: (s) => s.owner.user ? s.owner.user.name + `(${s.owner.user.identityID})` : "Unknown"
                                                    ,

                                                },{
                                                    label: "Tên chuyên ngành",
                                                    cellDisplay: (s) => s.speciality.name
                                                    ,

                                                },
                                            ]}
                                            rowTrackBy={(row, i) => row._id}
                                        />
                                    </div>
                                )}
                            </div>
                        ),
                        btnText: "Ok",
                        style: "danger"
                    })
                })

            }
        })
    };

    refreshData = () => {
        this.form.updateData({...this.state.draft});
    };

    render() {
        let {fetching, draft, error, loading, deleting} = this.state;




        // console.log(formData)
        // console.log(this.infoForm ? draft : omit(draft, ["info"]))
        // console.log(isEqual(this.infoForm ? draft : omit(draft, ["info"]), formData))




        const canUpdate = !fetching && !deleting && !loading && !this.form.getInvalidPaths().length && !error && !isEqual(draft, this.form.getData()) ;
        if(this.form){
            console.log(isEqual(draft, this.form.getData()))
            console.log(this.form.getData())
            console.log(this.form.getInvalidPaths())
            console.log(this.form.getErrorPath(this.form.getInvalidPaths()[0]))
        }
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
                                <button className="btn btn-refresh"
                                        onClick={this.refreshData}
                                        disabled={this.form ? isEqual(draft, this.form.getData()) : true}
                                >
                                    <i className="far fa-sync-alt"></i>
                                </button>
                                <button className="btn btn-cancel"
                                        onClick={() => customHistory.push("/manage/subjects")}
                                >
                                    Hủy bỏ
                                </button>
                                <button className="btn btn-danger"
                                        onClick={this.deleteSubject}
                                        disabled={deleting}
                                >
                                    Xóa
                                    {deleting && (
                                        <LoadingInline/>
                                    )}
                                </button>
                                <button className="btn btn-next"
                                        onClick={this.handleUpdateSubject}
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