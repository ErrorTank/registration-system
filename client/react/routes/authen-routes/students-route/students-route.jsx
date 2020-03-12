import React, {Component} from 'react';
import {appConfigCache, divisionsCache, specialitiesCache} from "../../../../common/cache/api-cache/common-cache";
import {accountTypes} from "../../../../const/account-types";
import {userApi} from "../../../../api/common/user-api";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {customHistory} from "../../routes";
import {SearchInput} from "../../../common/search-input/search-input";
import {Select} from "../../../common/select/select";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {commonApi} from "../../../../api/common/common-api";
import {studentApi} from "../../../../api/common/student-api";
import {englishLevels} from "../../../../const/english-level";

const schoolYears = Array.from(Array(appConfigCache.syncGet().latestSchoolYear), (x, i) => i + 1).map(each => ({
    value: each,
    label: "K" + each
}));
const studentStates = [
    {
        value: "",
        label: "Tất cả"
    } , {
        value: 0,
        label: "Đã thôi học"
    }, {
        value: 1,
        label: "Đang học"
    }
];

class StudentsRoute extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            list: [],
            keyword: "",
            specialities: [],
            speciality: null,
            englishLevel: englishLevels[0],
            schoolYear: schoolYears[schoolYears.length - 1],
            active: studentStates[0],

        };
        specialitiesCache.get().then((specialities) => {
            let newSpecialities = [
                {
                    label: "Chọn chuyên ngành",
                    value: ""
                }
            ];
            newSpecialities = newSpecialities.concat(specialities.map(each => ({label: each.name, value: each._id})));
            this.setState({
                loading: false, specialities: newSpecialities, speciality: newSpecialities[0]
            });

        });
    }

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã sinh viên",
            cellDisplay: (s) => s.user ? s.user.identityID : "Dữ liệu lỗi",

        }, {
            label: "Họ tên",
            cellDisplay: (s) => s.user ? s.user.name : "Dữ liệu lỗi",

        }, {
            label: "Khóa",
            cellDisplay: (s) => s.schoolYear,

        },{
            label: "Chuyên ngành",
            cellDisplay: (s) => s.speciality.name,

        }
    ];

    render() {
        const api = (config) => studentApi.getAllStudents(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            keyword,
            specialities,
            speciality,
            englishLevel,
            schoolYear,
            active,
        } = this.state;
        return (
            <PageTitle
                title={"Tra cứu giảng viên"}
            >
                <AuthenLayoutTitle
                    title={"Tra cứu giảng viên"}
                >
                    <div className="registration-events manage-list-route">
                        <div className="common-route-wrapper">

                            <div className="route-actions">
                                <button className="btn btn-next icon-btn"
                                        onClick={() => customHistory.push("/manage/account/new")}
                                >
                                    <i className="fal fa-plus"></i>


                                    Tạo giảng viên
                                </button>
                            </div>
                            <div className="schedule-items">
                                {!loading && (
                                    <>
                                        <div className="table-actions">
                                            <div className="spec-select search-schedules">
                                                <SearchInput
                                                    placeholder={`Tìm theo mã sinh viên, email, họ tên, số điện thoại`}
                                                    onSearch={(keyword) => this.setState({keyword})}
                                                    value={keyword}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Chuyên ngành</span>
                                                <Select
                                                    options={specialities}
                                                    value={speciality}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : e.target.value;
                                                        this.setState({speciality: specialities.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Trình độ tiếng anh</span>
                                                <Select
                                                    options={englishLevels}
                                                    value={englishLevel}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : e.target.value;
                                                        this.setState({englishLevel: englishLevels.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Niên khóa</span>
                                                <Select
                                                    options={schoolYears}
                                                    value={schoolYear}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                                        this.setState({schoolYear: schoolYears.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                            <div className="spec-select">
                                                <span className="label">Trạng thái</span>
                                                <Select
                                                    options={studentStates}
                                                    value={active}
                                                    displayAs={(each) => each.label}
                                                    getValue={each => each.value}
                                                    onChange={e => {
                                                        let value = e.target.value === "" ? "" : Number(e.target.value);
                                                        this.setState({active: studentStates.find(sp => sp.value === value)})
                                                    }}
                                                />

                                            </div>
                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                keyword,
                                                speciality,
                                                englishLevel,
                                                schoolYear,
                                                active,
                                            }}
                                            rowLinkTo={(e, row) => row.user ? customHistory.push(`/manage/account/${row.user._id}/edit`) : null}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có sinh viên nào"}
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