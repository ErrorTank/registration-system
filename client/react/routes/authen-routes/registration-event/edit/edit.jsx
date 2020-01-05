import React from 'react';
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {PageTitle} from "../../../../common/page-title/page-title";
import {years} from "../../../../../const/years";
import {semester} from "../../../../../const/semester";
import {studentGroups} from "../../../../../const/student-group";
import {RegistrationEventForm} from "../registration-event-form";
import {customHistory} from "../../../routes";
import omit from "lodash/omit"
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {mergeYear, parseYear} from "../../../../../common/utils/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import isEqual from "lodash/isEqual";
import uniqid from "uniqid";
import {appModal} from "../../../../common/modal/modals";

class RegistrationEventEditRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            draft: {},
            fetching: true
        };


        this.fetchingData().then(data => {
            this.setState({
                draft: {...data, childEvents: data.childEvents.map(each => ({...each, id: uniqid()}))},
                fetching: false
            });
        });
    };

    fetchingData = () => {
        return registrationEventApi.getRegistrationEventById(this.props.match.params.eventID).then(data => {
            return {
                ...data,
                year: years.find(each => each.value === mergeYear(data.year)),
                semester: semester.find(each => each.value === data.semester),
                studentGroup: studentGroups.find(each => each.value === data.studentGroup),
            }
        })
    };


    handleUpdateRegistrationEvent = (form) => {
        this.setState({loading: true});
        let data = {...form.getData()};
        let childEvents = [...data.childEvents];
        data.childEvents = childEvents.map(each => {
            if (!each.delay) {
                each = omit(each, "delay");
            } else {
                each.delay = each.delay.toString();
            }
            each = omit(each, ["id", "status"]);
            return each;
        });
        if(this.state.draft.isActive){
            return appModal.alert({
                text: "Bạn không thể sửa đổi Đợt đăng ký đang diễn ra",
                title: "Thông báo",
                btnText: "Đồng ý"
            }).then(() => {
                this.setState({loading: false});
            });
        }
        return registrationEventApi.updateRegistrationEvent(this.props.match.params.eventID, {
            ...data,
            year: parseYear(data.year.value),
            semester: data.semester.value,
            studentGroup: data.studentGroup.value,
        }).then((updatedData) => {

            this.setState({
                draft: {
                    ...updatedData,
                    childEvents: updatedData.childEvents.map(each => ({...each, id: uniqid()})),
                    year: years.find(each => each.value === mergeYear(updatedData.year)),
                    semester: semester.find(each => each.value === updatedData.semester),
                    studentGroup: studentGroups.find(each => each.value === updatedData.studentGroup),
                }, loading: false
            });
        }).catch(err => this.setState({loading: false, error: err.message}));
    };

    handleDelete = () => {
        if(this.state.draft.isActive){
            return appModal.alert({
                text: "Bạn không thể xóa Đợt đăng ký đang diễn ra",
                title: "Thông báo",
                btnText: "Đồng ý"
            })
        }
        return registrationEventApi.deleteRegistrationEvent(this.props.match.params.eventID).then(() => {
            customHistory.push("/manage/registration-events");
        })
    };

    render() {
        return (
            <PageTitle
                title={"Cập nhật đợt đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Cập nhật đợt đăng ký học"}
                >
                    <div className="registration-event-new-route">
                        <div className="common-route-wrapper">
                            {this.state.fetching && (
                                <LoadingInline
                                    className="edit-form-loading"
                                />
                            )}
                        </div>
                        <div className="common-route-wrapper">
                            {this.state.fetching && (
                                <LoadingInline
                                    className="edit-form-loading"
                                />
                            )}
                            <div className="route-body">
                                <RegistrationEventForm
                                    isEdit
                                    onFormChange={(formData) => {
                                        this.state.error && this.setState({error: ""});
                                    }}
                                    initData={{...this.state.draft}}
                                    serverError={this.state.error}
                                    renderActions={(form, childEventsError) => {
                                        let formData = {...form.getData()};
                                        // console.log(form.getInvalidPaths())
                                        // console.log(isEqual({...this.state.draft}, formData))
                                        // console.log(childEventsError)

                                        const canUpdate = !form.getInvalidPaths().length && !this.state.error && !this.state.loading && !isEqual({...this.state.draft}, formData) && !childEventsError;
                                        return (
                                            <>
                                                <button className="btn btn-cancel"
                                                        onClick={() => customHistory.push("/manage/registration-events")}

                                                >
                                                    Trở về
                                                </button>
                                                <button className="btn btn-back"
                                                        onClick={this.handleDelete}

                                                >
                                                    Xóa bỏ
                                                </button>
                                                <button className="btn btn-next"
                                                        onClick={() => this.handleUpdateRegistrationEvent(form)}
                                                        disabled={!canUpdate}
                                                >
                                                    Cập nhật
                                                    {this.state.loading && (
                                                        <LoadingInline/>
                                                    )}
                                                </button>
                                            </>
                                        )
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}

export default RegistrationEventEditRoute;