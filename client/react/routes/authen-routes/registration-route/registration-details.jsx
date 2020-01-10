import React, {Component} from 'react';
import classnames from "classnames";
import {Tooltip} from "../../../common/tooltip/tooltip";

export class RegistrationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {subject} = this.props;
        return (
            <>
                <div className="small-title mt-3 mb-3">Chi tiết: <span className="class-count">{subject.lessons.length}</span><span className="class-name">Lớp {subject.name}</span></div>
                <div className="registration-details">

                    {subject.lessons.map((each, i) => {
                        let isSame = each.filter(i => i.name === each[0].name).length === each.length;
                        return (
                            <Tooltip
                                text={() => "Click để đăng ký"}
                                position={"bottom"}
                                key={i}
                                className={classnames("lesson-tooltip")}
                            >
                                <div className={classnames("each-lesson")}
                                >
                                    <div className="info-bar">
                                        {isSame ? (
                                            <>
                                                <span className="lesson-name">{each[0].name}</span>
                                                {each.map((cl) => {
                                                    return (
                                                        <span className={classnames("class")} key={cl._id}><span className="day">{cl.dayOfWeek < 7 ? "Thứ " + (cl.dayOfWeek + 1) : "Chủ nhật"}:</span><span className="shift">Ca {cl.from.name} - Ca {cl.to.name}</span></span>
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
                                    <div className="status-bar">

                                    </div>
                                </div>
                            </Tooltip>

                        )
                    })}
                </div>
            </>
        );
    }
}
