import React, {Component} from 'react';
import classnames from "classnames";
import {Tooltip} from "../../../common/tooltip/tooltip";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";



class LessonDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


    isFullLesson = item => {
        return !!item.find(each => {
            return each.count >= each.capacity.max
        })
    };

    toggleRegister = (lesson) => {

        this.setState({loading: true});
        this.props.toggleRegister(lesson).then(() => {
            this.setState({loading: false});
        });
    };

    render() {
        let {lesson, isSame, isInScheduleList} = this.props;
        return (
            <Tooltip
                text={() => isInScheduleList ? "Click để hủy" : "Click để đăng ký"}
                position={"bottom"}
                className={classnames("lesson-tooltip", {"is-registered": isInScheduleList})}
            >
                <div className={classnames("each-lesson", {full: this.isFullLesson(lesson)})}
                     onClick={() => this.toggleRegister(lesson)}
                >
                    {this.state.loading && (
                        <LoadingInline
                        />
                    )}
                    <div className="info-bar">
                        {isSame ? (
                            <>
                                <span className="lesson-name">{lesson[0].name}</span>
                                {lesson.map((cl) => {
                                    return (
                                        <span className={classnames("class", {full: cl.count >= cl.capacity.max})} key={cl._id}><span className="day">{cl.dayOfWeek < 7 ? "Thứ " + (cl.dayOfWeek + 1) : "Chủ nhật"}:</span><span className="shift">Ca {cl.from.name} - Ca {cl.to.name}</span><span className="slot"><i
                                            className="fal fa-user-check"></i>:{cl.count}/{cl.capacity.max}</span></span>
                                    )
                                })}
                            </>
                        ) : lesson.map((cl) => {
                            return (
                                <span key={cl._id}>
                                                                                <span
                                                                                    className="lesson-name">{cl.name}</span>
                                                                                <span className={classnames("class", {full: cl.count >= cl.capacity.max})}>

                                                                            <span
                                                                                className="day">{cl.dayOfWeek < 7 ? "Thứ " + (cl.dayOfWeek + 1) : "Chủ nhật"}:</span>
                                                                            <span className="shift">Ca {cl.from.name} - Ca {cl.to.name}</span>
                                                                                    <span className="slot"><i
                                                                                        className="fal fa-user-check"></i>:{cl.count}/{cl.capacity.max}</span>
                                                                        </span>
                                                                            </span>
                            )
                        })}
                    </div>
                    {/*<div className="status-bar">*/}
                    {/*    {status.map(each => each.condition() ? (*/}
                    {/*        */}
                    {/*    ) : null}*/}
                    {/*</div>*/}
                </div>
            </Tooltip>
        );
    }
}



export class RegistrationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }




    render() {
        let {subject, schedule, toggleRegister} = this.props ;
        let list = schedule ? schedule.list  || [] : [];
        console.log(list)
        return (
            <>
                <div className="small-title mt-3 mb-3">Chi tiết: <span className="class-count">{subject.lessons.length}</span><span className="class-name">Lớp {subject.name}</span></div>
                <div className="registration-details">

                    {subject.lessons.map((each, i) => {
                        let isSame = each.filter(i => i.name === each[0].name).length === each.length;
                        let idArr = each.map(test => test._id);
                        console.log(idArr);

                        return (
                            <LessonDisplay
                                lesson={each}
                                key={i}
                                toggleRegister={toggleRegister}
                                isSame={isSame}
                                isInScheduleList={list.filter(item => idArr.includes(item._id)).length === each.length}
                            />

                        )
                    })}
                </div>
            </>
        );
    }
}
