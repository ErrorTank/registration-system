import React from "react";
import ReactDOM from "react-dom";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {Alert} from "../../../common/alert/alert";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {registrationEventApi} from "../../../../api/common/registration-event";
import moment from "moment";
import {ApiScheduleBoard} from "../../../common/api-schedule-board/api-schedule-board";
import classnames from "classnames"
import {RegistrationDetails} from "./registration-details";
import {scheduleApi} from "../../../../api/common/schedule-api";
import {userInfo} from "../../../../common/states/common";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import pick from "lodash/pick"
import isEqual from "lodash/isEqual"
import {appModal} from "../../../common/modal/modals";

export default class RegistrationRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectList: [],
            error: null,
            loading: true,
            delayEvent: null,
            pickedSubject: null,
            schedule: null
        };
        registrationEventApi.getSubjectListForRegistration().then(data => {
            this.setState({...data, loading: false});
        }).catch((error) => {
            this.setState({error, loading: false});
        })
    };

    onRegister = (lesson) => {
        let {schedule, pickedSubject} = this.state;
        let pickedSchoolSchedule = pickedSubject.lessons.reduce((total, cur) => total.concat(cur.map(each => each._id)),[]);
        let currentList = schedule.list.map(each => each._id);
        let match = null;
        if (currentList.find(each => !!pickedSchoolSchedule.includes(each)) || !schedule.list.find(each => !!lesson.find(item => {
            if(item.dayOfWeek === each.dayOfWeek && !(item.from.name > each.to.name || item.to.name < each.from.name)){
                match = {
                    newItem: item,
                    existed: each
                };
                return true;
            }
            return false;
        }))) {
            return this.toggleRegister(lesson)
        }
        console.log(match)
        return appModal.alert({
            text: (
                <Alert
                    strongText={"Thông báo:"}
                    type={"border"}
                    color={"danger"}
                    content={(
                        <>

                            <span className="pl-3">Bạn không thể đăng ký <strong>{match.newItem.name}</strong> do trùng vào <strong>{match.existed.dayOfWeek < 7 ? "Thứ " + (match.existed.dayOfWeek + 1) : "Chủ nhật"}</strong> <strong>Ca {match.existed.from.name}-{match.existed.to.name}</strong> của <strong>{match.existed.class.name}</strong></span>
                        </>
                    )}
                />
            ),
            title: "Lỗi đăng ký",
            btnText: "Đồng ý"
        })

    };

    toggleRegister = (lesson) => {
        let {info} = userInfo.getState();
        let {currentYear, currentSemester} = appConfigCache.syncGet();
        return scheduleApi.toggleRegisterLesson(info._id, `${currentYear.from}-${currentYear.to}`, currentSemester, lesson).then(() => {
            return this.board.loadData();
        });
    };

    displayInsScheduleItem = (item) => {
        return (
            <div className="common-inner-task">
                <div className="class-name">
                    {item.class.name}
                </div>
                <div className="class-room-name">
                    {item.classRoom.name}
                </div>
            </div>
        )
    };

    onClickScheduleItem = (item, utils) => {
        let {setLoading} = utils;
        setLoading();
        for (let subject of this.state.subjectList) {
            let {lessons} = subject;
            let lesson = lessons.find(each => {
                return !!each.find(child => child._id === item._id)
            });
            if (lesson) {
                return this.toggleRegister(lesson)
            }
        }
    };


    render() {
        let {subjectList, error, loading, delayEvent, pickedSubject} = this.state;

        const api = async () => {
            let {info} = userInfo.getState();
            let {currentYear, currentSemester} = appConfigCache.syncGet();
            return scheduleApi.getStudentSchedule(info._id, `${currentYear.from}-${currentYear.to}`, currentSemester).then(schedule => {
                this.setState({schedule});
                return schedule || {list: []};
            })
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
                                                            onClick={() => {
                                                                let isToggle = pickedSubject && each._id === pickedSubject._id;
                                                                this.setState({pickedSubject: isToggle ? null : each}, () => {
                                                                   if(!isToggle){
                                                                       const yOffset = -100;
                                                                       const element = document.querySelector(".registration-details");
                                                                       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                                                       window.scrollTo({top: y, behavior: 'smooth'});
                                                                   }
                                                                })
                                                            }}

                                                        >
                                                            <div className="s-name">{each.name}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {pickedSubject && (
                                                <RegistrationDetails
                                                    schedule={this.state.schedule}
                                                    subject={pickedSubject}
                                                    onRegister={this.onRegister}
                                                    onUnregister={this.toggleRegister}
                                                />
                                            )}

                                        </>
                                    )}

                                </div>
                                <div className="small-title">Thời khóa biểu tạm thời</div>
                                <ApiScheduleBoard
                                    ref={board => this.board = board}
                                    className={"ins-schedule-board"}
                                    api={api}
                                    displayItem={this.displayInsScheduleItem}
                                    // emptyNotify={"Đăng ký học không khả dụng lúc này"}
                                    onClickItem={this.onClickScheduleItem}
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