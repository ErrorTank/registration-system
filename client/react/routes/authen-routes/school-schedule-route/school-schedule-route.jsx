import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {Select} from "../../../common/select/select";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {semester as semesters} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {years} from "../../../../const/years";
import {SearchInput} from "../../../common/search-input/search-input";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";
import {userInfo} from "../../../../common/states/common";
import isNil from "lodash/isNil"
import {getStudentGroup, mergeYear} from "../../../../common/utils/common";
import {classStates} from "../../../../const/class-state";
import {classStatus} from "../../../../const/class-status";

export default class SchoolScheduleRoute extends React.Component {
    constructor(props) {
        super(props);
        const {currentYear, currentSemester} = appConfigCache.syncGet();
        let info = userInfo.getState();
        let latestSchoolYear = appConfigCache.syncGet();
        let studentGroup = info.role === "sv" ? getStudentGroup(info.info.schoolYear, info.info.speciality.department, latestSchoolYear) : "";

        let initState = {
            loading: false,
            keyword: "",
            semester: semesters.find(each => each.value === currentSemester),
            studentGroup: studentGroups.find(each => each.value === studentGroup),
            year: years.find(each => each.value === mergeYear(currentYear))
        };

        if (["pdt", "admin"].includes(info.role)) {
            initState.state = classStates[0];
            initState.status = classStatus[0];
        }

        this.state = {...initState};


    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã môn",
            cellDisplay: (s) => s.class.subject.subjectID,

        }, {
            label: "Tên môn",
            cellDisplay: (s) => s.class.subject.name,

        }, {
            label: "Tên lớp",
            cellDisplay: (s) => s.class.name,

        }, {
            label: "Thứ",
            cellDisplay: (s) => s.dayOfWeek + 1,

        }, {
            label: "Ca",
            cellDisplay: (s) => s.from.name + "-" + s.to.name

        }, {
            label: "Phòng học",
            cellDisplay: (s) => s.classRoom.name

        }, {
            label: "TC",
            cellDisplay: (s) => s.class.subject.credits

        }, {
            label: "Giáo viên",
            cellDisplay: (s) => s.instructor.user.name + `(${s.instructor.user.identityID})`

        }
    ];

    displayTooltipContent = (s) => {

    };

    render() {
        const api = (config) => schoolScheduleApi.getSchoolScheduleItems(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {
            loading,
            keyword,
            semester,
            studentGroup,
            year,
            state,
            status
        } = this.state;

        let config = {
            keyword,
            semester,
            studentGroup,
            year,
        };

        let info = userInfo.getState();

        let isManager = ["pdt", "admin"].includes(info.role);

        if(isManager){
            config.state = state;
            config.status = status;
        }

        return (

            <PageTitle
                title={"Thời khóa biểu toàn trường"}
            >
                <AuthenLayoutTitle
                    title={"TKB toàn trường"}
                >
                    <div className="school-schedule-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="schedule-items">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
                                            <div className="spec-select search-schedules">
                                                <SearchInput
                                                    placeholder={`Tìm theo tên môn, mã môn hoặc mã GV`}
                                                    onSearch={(keyword) => this.setState({keyword})}
                                                    value={keyword}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Năm học</span>
                                                <Select
                                                    options={years}
                                                    value={year}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        this.setState({year: years.find(sp => sp.value === e.target.value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Học kì</span>
                                                <Select
                                                    options={semesters}
                                                    value={semester}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                                        this.setState({semester: semesters.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Nhóm</span>
                                                <Select
                                                    options={studentGroups}
                                                    value={studentGroup}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                                        this.setState({studentGroup: studentGroups.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            {isManager && (
                                                <>
                                                    <div className="spec-select">
                                                        <span className="label">Lg.Sinh viên</span>
                                                        <Select
                                                            options={classStates}
                                                            value={state}
                                                            displayAs={(each) => each.label}
                                                            getValue={each => each.value}
                                                            onChange={e => {
                                                                let value = e.target.value === "" ? "" : Number(e.target.value);
                                                                this.setState({state: classStates.find(sp => sp.value === value)})
                                                            }}
                                                        />

                                                    </div>
                                                    <div className="spec-select">
                                                        <span className="label">Trạng thái</span>
                                                        <Select
                                                            options={classStatus}
                                                            value={status}
                                                            displayAs={(each) => each.label}
                                                            getValue={each => each.value}
                                                            onChange={e => {
                                                                let value = e.target.value === "" ? "" : Number(e.target.value);
                                                                this.setState({status: classStatus.find(sp => sp.value === value)})
                                                            }}
                                                        />

                                                    </div>
                                                </>
                                            )

                                            }
                                        </div>
                                        {isManager && (
                                            <div className="custom-summary">
                                                Tìm thấy <span>{this.state.list ? this.state.list.length : 0}</span> lớp học
                                            </div>
                                        )

                                        }

                                        <CommonDataTable
                                            showTooltip
                                            tooltipContent={this.displayTooltipContent}
                                            className={"result-table"}
                                            api={api}
                                            filter={config}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có môn học nào"}
                                        />
                                    </>
                                )}


                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}