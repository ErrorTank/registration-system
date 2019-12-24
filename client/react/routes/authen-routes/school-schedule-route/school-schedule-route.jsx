import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {Select} from "../../../common/select/select";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {semester as semesters} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {years} from "../../../../const/years";
import {SearchInput} from "../../../common/search-input/search-input";

export default class SchoolScheduleRoute extends React.Component{
    constructor(props){
        super(props);
        props.setTitle("TKB toàn trường");
        this.state={
            loading: false,
            keyword: "",
            semester: semesters[0],
            studentGroup: studentGroups[0],
            year: years[0]
        };


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

        },{
            label: "Phòng học",
            cellDisplay: (s) => s.classRoom.name

        },{
            label: "TC",
            cellDisplay: (s) => s.class.subject.credits

        },{
            label: "Giáo viên",
            cellDisplay: (s) => s.instructor.user.name + `(${s.instructor.user.identityID})`

        },
    ];

    render() {
        const api = (config) => schoolScheduleApi.getSchoolScheduleItems(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            keyword,
            semester,
            studentGroup,
            year} = this.state;
        console.log(years)
        return (

            <PageTitle
                title={"Thời khóa biểu toàn trường"}
            >
                <div className="school-schedule-route">
                    <div className="common-route-wrapper">
                        <div className="schedule-items">
                            {!loading && (
                                <>
                                    <div className="table-actions">
                                        <div className="spec-select search-schedules">
                                            <SearchInput
                                                placeholder={`Tìm theo tên hoặc mã môn`}
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
                                                    this.setState({semester: semesters.find(sp => sp.value === e.target.value)})
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
                                                    this.setState({studentGroup: studentGroups.find(sp => sp.value === e.target.value)})
                                                }}
                                            />

                                        </div>

                                    </div>
                                    <CommonDataTable
                                        className={"result-table"}
                                        api={api}
                                        filter={{
                                            keyword,
                                            studentGroup,
                                            semester,
                                            year
                                        }}
                                        columns={this.columns}
                                        rowTrackBy={(row, i) => row._id}
                                        emptyNotify={"Không có môn học nào"}
                                    />
                                </>
                            )}


                        </div>
                    </div>
                </div>
            </PageTitle>
        );
    }
}