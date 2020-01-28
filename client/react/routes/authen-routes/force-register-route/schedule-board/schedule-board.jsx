import React, {Component} from 'react';
import {SchoolCharge} from "../../../../common/school-charge/school-charge";
import {userInfo} from "../../../../../common/states/common";
import {ApiScheduleBoard} from "../../../../common/api-schedule-board/api-schedule-board";
import {scheduleApi} from "../../../../../api/common/schedule-api";
import {appConfigCache} from "../../../../../common/cache/api-cache/common-cache";
import {semester as semesters} from "../../../../../const/semester";
import {years} from "../../../../../const/years";
import {mergeYear} from "../../../../../common/utils/common";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual"
import {Select} from "../../../../common/select/select";

export class ScheduleBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pickedStudent: props.pickedStudents[0],
            pickedStudents: props.pickedStudents
        }
    }

    onClickScheduleItem = item => {

    };

    refreshScheduleBoard = debounce((data) => {
        this.setState({
            pickedStudent: data.pickedStudents[0],
            pickedStudents: data.pickedStudents
        }, () => {
            this.board.loadData();
        });
    }, 1500);


    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.pickedStudents, this.props.pickedStudents)) {
            this.refreshScheduleBoard(nextProps);

        }
    }

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


    render() {
        let {pickedStudent, pickedStudents} = this.state;
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        const api = async () => {
            let {currentYear, currentSemester} = appConfigCache.syncGet();
            let {year, semester} = {
                year: years.find(each => each.value === mergeYear(currentYear)),
                semester: semesters.find(each => each.value === currentSemester)
            };
            return scheduleApi.getStudentSchedule(pickedStudent._id, year.value, semester.value, true).then(schedule => {
                this.setState({schedule});
                return schedule || {list: []};
            })
        };
        console.log(pickedStudent)
        return (
            <div className="force-schedule-board">
                <div className="student-select">
                    <span className="label">Sinh viên đang chọn</span>
                    <Select
                        options={pickedStudents}
                        value={pickedStudent}
                        displayAs={(each) => each.name + ` (${each.identityID})`}
                        getValue={each => each._id}
                        onChange={e => {
                            this.setState({pickedStudent: pickedStudents.find(each => each._id === e.target.value)}, () => {
                                this.board.loadData();
                            });
                        }}
                    />
                </div>
                <div className="content-wrapper-hehe">

                    <SchoolCharge
                        schoolYear={pickedStudent.schoolYear}
                        schedule={this.state.schedule}
                        label={"Học phí kì này"}
                    />
                    <ApiScheduleBoard
                        filter={{
                            semester: semesters.find(each => each.value === currentSemester),
                            year: years.find(each => each.value === mergeYear(currentYear))
                        }}
                        ref={board => this.board = board}
                        className={"ins-schedule-board"}
                        api={api}
                        displayItem={this.displayInsScheduleItem}
                        // emptyNotify={"Sinh viên chưa đăng ký lớp học phần nào"}
                        onClickItem={this.onClickScheduleItem}
                        getDayOfWeek={item => item.dayOfWeek}
                        getShiftStart={item => item.from.name}
                        getShiftEnd={item => item.to.name}
                        showSuggestion
                    />


                </div>
            </div>
        );
    }
}
