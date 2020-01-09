import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {Alert} from "../../../common/alert/alert";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {registrationEventApi} from "../../../../api/common/registration-event";
import moment from "moment";
import {ApiScheduleBoard} from "../../../common/api-schedule-board/api-schedule-board";
import classnames from "classnames"

export default class RegistrationRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectList: [],
            error: null,
            loading: true,
            delayEvent: null,
            pickedSubject: null
        };
        registrationEventApi.getSubjectListForRegistration().then(data => {
            this.setState({...data, loading: false});
        }).catch((error) => {
            this.setState({error, loading: false});
        })
    };


    render() {
        let {subjectList, error, loading, delayEvent, pickedSubject} = this.state;

        const api = async () => {
            return {list: []}
        };
        let boardErr = (delayEvent || error) ? "Đăng ký học không khả dụng lúc này" : "";
        return (
            <PageTitle
                title={"Đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Đăng ký học"}
                >
                    <div className="registration-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="content-wrapper">
                                <div className="subject-list">
                                    {error ? (
                                        <Alert
                                            icon={(
                                                <i className="fas fa-info-circle"></i>
                                            )}
                                            strongText={"Thông báo:"}
                                            content={(
                                                <>

                                                    <span className="pl-3">{error.message}</span>
                                                </>
                                            )}
                                        />
                                    ) : loading ? (
                                        <LoadingInline/>
                                    ) : delayEvent ? (
                                        <div className="registration-notify">
                                            <div className="small-title"> Thông báo thời gian đăng ký học</div>

                                            <Alert
                                                icon={(
                                                    <i className="far fa-clock"></i>
                                                )}
                                                strongText={`Học kì ${delayEvent.semester + 1} Nhóm ${delayEvent.studentGroup} Năm học ${delayEvent.year.from}-${delayEvent.year.to}: `}
                                                color={"success"}
                                                content={(
                                                    <>

                                                        <span
                                                            className="pl-3">Từ <strong>{moment(delayEvent.activeChildEvent.from).format("HH:mm DD/MM/YYYY")}</strong> đến <strong>{moment(delayEvent.activeChildEvent.to).format("HH:mm DD/MM/YYYY")}</strong></span>
                                                    </>
                                                )}
                                            />
                                        </div>

                                    ) : (
                                        <>
                                            <div className="small-title">Danh sách môn đăng ký</div>
                                            <div className="list-container">
                                                {subjectList.map(each => {
                                                    return (
                                                        <div
                                                            className={classnames("registration-subject", {active: pickedSubject && (pickedSubject._id === each._id)})}
                                                            key={each._id}
                                                            onClick={() => this.setState({pickedSubject: each})}

                                                        >
                                                            <div className="s-name">{each.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {pickedSubject && (
                                                <>
                                                    <div className="small-title mt-3 mb-3">Chi tiết</div>
                                                    <div className="registration-details">

                                                        {pickedSubject.lessons.map((each, i) => {
                                                            let isSame = each.filter(i => i.name === each[0].name).length === each.length;
                                                            return (
                                                                <div className={classnames("each-lesson")} key={i}>
                                                                    {isSame ? (
                                                                        <>
                                                                            <span
                                                                                className="lesson-name">{each[0].name}</span>
                                                                            {each.map((cl) => {
                                                                                return (
                                                                                    <span
                                                                                        className={classnames("class")}
                                                                                        key={cl._id}>
                                                                                    <span
                                                                                        className="day">{cl.dayOfWeek < 7 ? "Thứ " + (cl.dayOfWeek + 1) : "Chủ nhật"}:</span>
                                                                                    <span
                                                                                        className="shift">Ca {cl.from.name} - Ca {cl.to.name}</span>
                                                                                </span>
                                                                                )
                                                                            })}
                                                                        </>
                                                                    ) : each.map((cl) => {
                                                                        return (
                                                                            <span key={cl._id}>
                                                                                <span
                                                                                    className="lesson-name">{cl.name}</span>
                                                                                <span className={classnames("class")}>

                                                                            <span
                                                                                className="day">{cl.dayOfWeek < 7 ? "Thứ " + (cl.dayOfWeek + 1) : "Chủ nhật"}:</span>
                                                                            <span className="shift">Ca {cl.from.name} - Ca {cl.to.name}</span>
                                                                        </span>
                                                                            </span>
                                                                        )
                                                                    })}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </>
                                            )}

                                        </>
                                    )}

                                </div>
                                <div className="small-title"> Thời khóa biểu tạm thời</div>
                                <ApiScheduleBoard
                                    className={"ins-schedule-board"}
                                    api={api}
                                    // displayItem={this.displayInsScheduleItem}
                                    // emptyNotify={"Đăng ký học không khả dụng lúc này"}
                                    // onClickItem={this.onClickScheduleItem}
                                    getDayOfWeek={item => item.dayOfWeek}
                                    getShiftStart={item => item.from.name}
                                    getShiftEnd={item => item.to.name}
                                    showSuggestion
                                    error={boardErr}
                                />

                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}