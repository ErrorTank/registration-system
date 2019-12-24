import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import moment from "moment"
import {KComponent} from "../../../common/k-component";
import {userInfo} from "../../../../common/states/common";
import classnames from "classnames"
import {CommonDataTable} from "../../../common/common-data-table/common-data-table";
import {Select} from "../../../common/select/select";
import {eduProgramApi} from "../../../../api/common/edu-program-api";

export default class EduProgramRoute extends KComponent {
    constructor(props) {
        super(props);
        props.setTitle("Chương trình đào tạo");
        this.state = {
            loading: true,
            eduProgram: null,
            list: [],
            eduPrograms: []
        };
        eduProgramApi.getAll().then(eduPrograms => this.setState({eduPrograms, loading: false, eduProgram: eduPrograms[0]}))
    };

    columns = [
        {
            label: "STT",
            cellDisplay: (r, i) => i + 1,

        }, {
            label: "Mã đào tạo phần",
            cellDisplay: (r) => r.subject.subjectID,

        }, {
            label: "Tên đào tạo phần",
            cellDisplay: (r) => r.subject.name,

        }, {
            label: "Sô tín chỉ",
            cellDisplay: (r) => r.subject.credits,

        }, {
            label: "Điểm",
            cellDisplay: (r) => <p className={classnames("grade-display", {tach: r.grade < 5})}>{r.grade}</p>,

        },
    ];

    render() {
        const api = (config) => eduProgramApi.getEduProgram(config).then((data) => {
            return {
                list: data.results,
                total: null
            };
        });
        let {loading, eduProgram, eduPrograms} = this.state;
        return (

            <PageTitle
                title={"Chương trình đào tạo"}
            >
                <div className="educate-program-route">
                    <div className="common-route-wrapper">
                        <div className="student-result">
                            {!loading && (
                                <>
                                    <div className="table-actions">
                                        <div className="spec-select">
                                            <span className="label">Chương trình đào tạo ngành</span>
                                            <Select
                                                options={eduPrograms}
                                                value={eduProgram}
                                                displayAs={(each) => each.speciality.name}
                                                getValue={each => each._id}
                                                onChange={e => {
                                                    this.setState({eduProgram: eduPrograms.find(sp => sp._id === e.target.value)})
                                                }}
                                            />

                                        </div>
                                    </div>
                                    <CommonDataTable
                                        className={"result-table"}
                                        api={api}
                                        filter={{
                                            eduProgram
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