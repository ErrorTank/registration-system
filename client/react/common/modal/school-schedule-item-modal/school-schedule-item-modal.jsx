import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {CommonDataTable} from "../../common-data-table/common-data-table";
import {studentApi} from "../../../../api/common/student-api";
import ReactToPrint from 'react-to-print';
import {userInfo} from "../../../../common/states/common";
import {ClassStudentInfo} from "../class-student-modal/class-student-modal";
import {MultipleTabWidget} from "../../multiple-tab-widget/multiple-tab-widget";

export const schoolScheduleItemModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <SchoolScheduleItemModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class ItemDetailInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <div className="item-detail-info">
            </div>
        );
    }
}


class SchoolScheduleItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };


    };

    tabs = [
        {
            label: "Thông tin lớp",
            render: () => {
                return <ItemDetailInfo
                    info={this.props.item}
                />
            }
        },{
            label: "Danh sách sinh viên",
            render: () =>{
                return <ClassStudentInfo
                    api={() => studentApi.getStudentsBySchoolScheduleItem(this.props.item).then((students) => {
                        return {
                            list: students,
                            total: null
                        };
                    })}
                />
            }
        },
    ];



    render() {

        let {onClose, item} = this.props;
        console.log(item)
        return (
            <div className={"ssi-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        {item.class.name}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <MultipleTabWidget
                        tabs={this.tabs}
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>

                </div>
            </div>
        );
    }
}