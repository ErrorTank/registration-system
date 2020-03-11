import React, {Component} from 'react';
import {divisionsCache} from "../../../../common/cache/api-cache/common-cache";
import {accountTypes} from "../../../../const/account-types";
import {userApi} from "../../../../api/common/user-api";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {customHistory} from "../../routes";
import {SearchInput} from "../../../common/search-input/search-input";
import {Select} from "../../../common/select/select";
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {commonApi} from "../../../../api/common/common-api";


class InstructorsRoute extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            list: [],
            keyword: "",
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
            label: "Mã định danh",
            cellDisplay: (s) => s.user ? s.user.identityID : "Dữ liệu lỗi",

        }, {
            label: "Họ tên",
            cellDisplay: (s) => s.user ? s.user.name : "Dữ liệu lỗi",

        }, {
            label: "Bộ môn",
            cellDisplay: (s) => s.division ? s.division.name : "Không thuộc bộ môn",

        }
    ];

    render() {
        const api = (config) => commonApi.getAllInstructors(config).then((data) => {
            this.setState({list: data});
            return {
                list: data,
                total: null,
            };
        });
        let {loading,
            keyword,
            divisions,
            division
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
                                                    placeholder={`Tìm theo mã định danh, email, họ tên, số điện thoại`}
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

                                        </div>
                                        <CommonDataTable
                                            className={"result-table"}
                                            api={api}
                                            filter={{
                                                keyword,
                                                division
                                            }}
                                            rowLinkTo={(e, row) => row.user ? customHistory.push(`/manage/account/${row.user._id}/edit`) : null}
                                            columns={this.columns}
                                            rowTrackBy={(row, i) => row._id}
                                            emptyNotify={"Không có giảng viên nào"}
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

export default InstructorsRoute;