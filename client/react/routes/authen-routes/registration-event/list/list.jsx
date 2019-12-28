import React from "react";
import {PageTitle} from "../../../../common/page-title/page-title";
import {Select} from "../../../../common/select/select";
import {CommonDataTable} from "../../../../common/common-data-table/common-data-table";
import {semester as semesters} from "../../../../../const/semester";
import {studentGroups} from "../../../../../const/student-group";
import {years} from "../../../../../const/years";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {Badge} from "../../../../common/badge/badge";
import {customHistory} from "../../../routes";

export default class RegisterEventsRoute extends React.Component{
    constructor(props){
        super(props);

        this.state={
            loading: false,
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
            label: "Kì",
            cellDisplay: (s) => this.state.semester.label,

        }, {
            label: "Nhóm",
            cellDisplay: (s) => this.state.studentGroup.label,

        }, {
            label: "Năm học",
            cellDisplay: (s) => this.state.year.label,

        },{
            label: "Trạng thái",
            cellDisplay: (s) => {
                return <Badge
                    content={s.isActive ? "Diễn ra" : "Kết thúc"}
                    style={s.isActive ?  "success" : "danger"}
                />;
            }

        }
    ];

    render() {
        const api = (config) => registrationEventApi.getAll(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            semester,
            studentGroup,
            year} = this.state;
        return (

            <PageTitle
                title={"Danh sách đợt đăng ký"}
            >
                <AuthenLayoutTitle
                    title={"Danh sách đợt đăng ký"}
                >
                    <div className="registration-events manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="route-actions">
                                <button className="btn btn-next icon-btn"
                                        onClick={() => customHistory.push("/manage/registration-event/new")}
                                >
                                    <i class="fal fa-plus"></i>


                                    Tạo đợt đăng ký
                                </button>
                            </div>
                            <div className="schedule-items">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
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

                                                        this.setState({semester: semesters.find(sp => sp.value === Number(e.target.value))})
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
                                                        this.setState({studentGroup: studentGroups.find(sp => sp.value === Number(e.target.value))})
                                                    }}
                                                />

                                            </div>

                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                studentGroup,
                                                semester,
                                                year
                                            }}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có đợt đăng ký nào"}
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