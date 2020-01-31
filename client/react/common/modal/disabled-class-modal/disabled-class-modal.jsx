import React from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {modals} from "../modals";

export const disabledClassModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <DisabledClassModal
                    {...config}
                    onClose={() => modal.close()}
                />
            )
        });
        return modal.result;
    }
};

class DisabledClassModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            lessons: [],
            loading: true,
            isSuccess: false
        };
        schoolScheduleApi.getSubjectLessonsByScheduleItems(props.classes).then(lessons => this.setState({lessons, loading: false}));
    };
    render(){
        let {lessons, loading, isSuccess} = this.state;
        let {onClose} = this.props;
        return(
            <div className={"disabled-class-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        {isSuccess ? "Thông báo" : "Xác nhận hủy lớp"}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className="lessons-container">
                        {loading ? (
                            <LoadingInline/>
                        ) : isSuccess ? (
                            <div className="success-notify">

                            </div>
                        ) : (
                            <div className="lessons">

                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}