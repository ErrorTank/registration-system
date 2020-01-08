import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {Alert} from "../../../common/alert/alert";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {registrationEventApi} from "../../../../api/common/registration-event";
import moment from "moment";
import {ApiScheduleBoard} from "../../../common/api-schedule-board/api-schedule-board";


export default class RegistrationRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
            subjectList: [],
            error: null,
            loading: true,
            delayEvent: null
        };
        registrationEventApi.getSubjectListForRegistration().then(data => {
            this.setState({...data, loading: false});
        }).catch((error) => {
            this.setState({error, loading: false});
        })
    };



    render(){
        let {subjectList, error, loading, delayEvent} = this.state;
        const api = async () => {
            return {list: []}
        };
        return(
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
                                    {error && (
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
                                    )}
                                    {loading ? (
                                        <LoadingInline/>
                                    ) : delayEvent ? (
                                        <div className="registration-notify">
                                            <div className="notify-title"> Thông báo thời gian đăng ký học</div>

                                            <Alert
                                                icon={(
                                                    <i className="far fa-clock"></i>
                                                )}
                                                strongText={`Học kì ${delayEvent.semester + 1} Nhóm ${delayEvent.studentGroup} Năm học ${delayEvent.year.from}-${delayEvent.year.to}: `}
                                                color={"success"}
                                                content={(
                                                    <>

                                                        <span className="pl-3">Từ <strong>{moment(delayEvent.activeChildEvent.from).format("HH:mm DD/MM/YYYY")}</strong> đến <strong>{moment(delayEvent.activeChildEvent.to).format("HH:mm DD/MM/YYYY")}</strong></span>
                                                    </>
                                                )}
                                            />
                                        </div>

                                        ) : (
                                        <div className="list-container">

                                        </div>
                                    )}
                                </div>

                                <ApiScheduleBoard
                                    className={"ins-schedule-board"}
                                    api={api}
                                    // displayItem={this.displayInsScheduleItem}
                                    emptyNotify={"Đăng ký học không khả dụng lúc này"}
                                    // onClickItem={this.onClickScheduleItem}
                                    getDayOfWeek={item => item.dayOfWeek}
                                    getShiftStart={item => item.from.name}
                                    getShiftEnd={item => item.to.name}
                                    showSuggestion
                                />

                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}