import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {SearchInput} from "../../../common/search-input/search-input";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {userInfo} from "../../../../common/states/common";
import {Checkbox} from "../../../common/checkbox/checkbox";
import {Tooltip} from "../../../common/tooltip/tooltip";
import classnames from "classnames";
import {schoolScheduleItemModal} from "../../../common/modal/school-schedule-item-modal/school-schedule-item-modal";

export default class DivisionClassRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            list: []
        };
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => (
                <>

                    {i + 1}
                </>
            ),

        }, {
            label: "Mã môn",
            cellDisplay: (s) => s.class.subject.subjectID,

        }, {
            label: "Tên môn",
            cellDisplay: (s) => s.class.subject.name,

        }, {
            label: "Tên lớp",
            cellDisplay: (s) => s.class.name
            ,

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

    handleClickRow = (e, item) => {

        schoolScheduleItemModal.open({
            item
        })
    };

    render() {
        let {keyword, list} = this.state;
        const api = (config) => schoolScheduleApi.getSchoolScheduleItemsByDivision(userInfo.getState().info.division._id, config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        return (
            <PageTitle
                title={"Lớp bộ môn"}
            >
                <AuthenLayoutTitle
                    title={"Tra cứu lớp bộ môn"}
                >
                    <div className="division-class-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="schedule-items">
                                <div className="table-actions">
                                    <div className="spec-select">
                                        <div className="spec-select search-schedules">
                                            <SearchInput
                                                placeholder={`Tìm theo tên môn, mã môn hoặc mã GV`}
                                                onSearch={(keyword) => this.setState({keyword})}
                                                value={keyword}
                                            />

                                        </div>

                                    </div>
                                </div>
                                <div className="custom-summary">
                                    Tìm
                                    thấy <span>{this.state.list ? this.state.list.length : 0}</span> lớp
                                    học thuộc <span>{userInfo.getState().info.division.name}</span>
                                </div>
                                <CommonDataTable
                                    className={"result-table"}
                                    api={api}
                                    filter={{
                                        keyword
                                    }}
                                    onClickRow={this.handleClickRow}
                                    columns={this.columns}
                                    rowTrackBy={(row, i) => row._id}
                                    emptyNotify={"Không có môn học nào"}
                                />
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}