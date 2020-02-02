import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {CommonDataTable} from "../../common-data-table/common-data-table";
import {studentApi} from "../../../../api/common/student-api";
import ReactToPrint from 'react-to-print';
import {userInfo} from "../../../../common/states/common";

export const classStudentModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ClassStudentModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class ClassStudentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
        };

        this.title = document.title;
        document.title = `Danh sách sinh viên lớp ${props.item.class.name} ${props.semester.label} Năm học ${props.year.label}`
    };

    componentWillUnmount() {
        document.title = this.title;
    }

    columns = [
        {
            label: "STT",
            cellDisplay: (s, i) => i + 1,

        }, {
            label: "Mã sinh viên",
            cellDisplay: (s) => s.user.identityID,

        }, {
            label: "Họ và tên",
            cellDisplay: (s) => s.user.name,

        }, {
            label: "Lớp",
            cellDisplay: (s) => `${s.speciality.shortName}${s.schoolYear}${s.englishLevel}`,

        },
    ];

    render() {
        let {students,} = this.state;
        let {onClose, item} = this.props;
        const api = () => studentApi.getStudentsBySchoolScheduleItem(item).then((students) => {
            this.setState({students,});
            return {
                list: students,
                total: null
            };
        });
        return (
            <div className={"class-student-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        Danh sách sinh viên
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className="summary">
                        <span>{students.length}</span> sinh viên thuộc lớp <span>{item.class.name}</span>
                    </div>
                    <div className="table-container">
                        <CommonDataTable
                            className={"class-student-table"}
                            api={api}
                            ref={table => this.table = table}
                            columns={this.columns}
                            rowTrackBy={(row, i) => row._id}
                            emptyNotify={"Không có sinh viên nào"}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>
                    <ReactToPrint
                        removeAfterPrint={true}
                        trigger={() =>
                            <button type="button" className="btn btn-confirm"
                                    disabled={students.length === 0}
                            >
                                <i className="fal fa-print"></i>
                                In danh sách
                            </button>
                        }
                        content={() => this.table}
                    />

                </div>
            </div>
        );
    }
}