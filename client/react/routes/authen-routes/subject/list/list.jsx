import React, {Component} from 'react';
import {subjectApi} from "../../../../../api/common/subject-api";
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {SearchInput} from "../../../../common/search-input/search-input";
import {Select} from "../../../../common/select/select";
import {subjectCredit} from "../../../../../const/subject-credit";
import {subjectCoefficient} from "../../../../../const/subject-coefficient";
import {divisionsCache} from "../../../../../common/cache/api-cache/common-cache";
import {CommonDataTable} from "../../../../common/common-data-table/common-data-table";
import {customHistory} from "../../../routes";



class StudentsRoute extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            list: [],
            keyword: "",
            credit: subjectCredit[0],
            coefficient: subjectCoefficient[0],
            divisions: [],
            division: null

        };
        divisionsCache.get().then((divisions) => {
            let newDivisions = [
                {
                    label: "Tất cả bộ môn",
                    value: ""
                }
            ];
            newDivisions = newDivisions.concat(divisions.map(each => ({label: each.name, value: each._id})));
            this.setState({
                loading: false, divisions: newDivisions, division: newDivisions[0]
            });

        });
    }

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã môn",
            cellDisplay: (s) => s.subjectID,

        }, {
            label: "Tên môn",
            cellDisplay: (s) => s.name,

        }, {
            label: "Số tín chỉ",
            cellDisplay: (s) => s.credits,

        },{
            label: "Hệ số",
            cellDisplay: (s) => s.coefficient,

        },{
            label: "Bộ môn",
            cellDisplay: (s) => s.division ? s.division.name : "Chưa xác định",

        },
    ];

    render() {
        const api = (config) => subjectApi.getAllSubjects(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            keyword,
            credit,
            coefficient,
            divisions,
            division
        } = this.state;
        return (
            <PageTitle
                title={"Danh sách môn học"}
            >
                <AuthenLayoutTitle
                    title={"Danh sách môn học"}
                >
                    <div className="registration-events manage-list-route">
                        <div className="common-route-wrapper">

                            <div className="route-actions">
                                <button className="btn btn-next icon-btn"
                                        onClick={() => customHistory.push("/manage/subject/new")}
                                >
                                    <i className="fal fa-plus"></i>


                                    Tạo môn học
                                </button>
                            </div>
                            <div className="schedule-items">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
                                            <div className="spec-select search-schedules">
                                                <SearchInput
                                                    placeholder={`Tìm theo mã môn, tên môn`}
                                                    onSearch={(keyword) => this.setState({keyword})}
                                                    value={keyword}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Bộ môn</span>
                                                <Select
                                                    options={divisions}
                                                    value={division}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : e.target.value;
                                                        this.setState({division: divisions.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Số tín chỉ</span>
                                                <Select
                                                    options={subjectCredit}
                                                    value={credit}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                                        this.setState({credit: subjectCredit.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Hệ số</span>
                                                <Select
                                                    options={subjectCoefficient}
                                                    value={coefficient}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : e.target.value;
                                                        this.setState({coefficient: subjectCoefficient.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>

                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                keyword,
                                                division ,
                                                coefficient,
                                                credit,
                                            }}
                                            rowLinkTo={(e, row) => customHistory.push(`/manage/subject/${row._id}/edit`)}
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

export default StudentsRoute;