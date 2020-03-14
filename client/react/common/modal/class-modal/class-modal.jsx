import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {schoolScheduleApi} from "../../../../api/common/school-schedule-api";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import * as yup from "yup"
import {CommonInput} from "../../common-input/common-input";

export const classModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ClassModal
                    {...config}
                    onClose={() => modal.close()}
                    onChange={(data) => {
                        modal.close(data);
                    }}
                />
            )
        });
        return modal.result;
    }
};

class ClassModal extends React.Component {
    constructor(props) {
        super(props);
        let state = {
            name: "",
            capacity: {
                min: 15,
                max: 30
            },
            isTouched: {
                name: false,
                capacity: {
                    min: false,
                    max: false
                }
            }
        };
        if (props.classInfo) {
            state = {...state, ...props.classInfo};
        }
        this.state = {
            ...state
        };


    };

    handleConfirmClass = () => {
        this.props.onChange({name: this.state.name, capacity: {...this.state.capacity}});
    };

    render() {
        let {name, capacity, isTouched} = this.state;
        let {onClose, classInfo} = this.props;
        let isNameValid = !!name;
        let isMinCapacityValid = capacity.min >= 1;
        let isMaxCapacityValid = capacity.max <= 120 && capacity.max > capacity.min;

        return (
            <div className={"class-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        {classInfo ? "Cập nhật lớp học phần" : "Tạo mới lớp học phần"}
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className={"common-form"}>
                        <CommonInput
                            className="pt-0 class-input"
                            error={(isNameValid || !isTouched.name) ? null : {message: "Giới hạn tối thiểu phải lớn hơn 1"}}
                            id={"name"}
                            type={"text"}
                            label={"Tên lớp học phần"}
                            placeholder={"Tên lớp học phần"}
                            onChange={e => {
                                this.setState({name: e.target.value.trim(), isTouched: {...isTouched, name: true}})
                            }}
                            value={name}
                        />
                        <div className="capacity">
                            <p className="form-label">Giới hạn sinh viên</p>
                            <div className="row">
                                <CommonInput
                                    className="pt-0 capacity-input"
                                    error={(isMinCapacityValid || !isTouched.capacity.min) ? null : {message: "Giới hạn tối thiểu phải lớn hơn 1"}}
                                    id={"min"}
                                    type={"text"}
                                    label={"Min"}
                                    placeholder={"Nhập min"}
                                    onChange={e => {
                                        this.setState({capacity: {min: e.target.value, max: capacity.max},
                                            isTouched: {
                                                ...isTouched,
                                                capacity: {min: true, max: isTouched.capacity.max}
                                            }
                                        })
                                    }}
                                    value={capacity.min}
                                />
                                <CommonInput
                                    className="pt-0 capacity-input"
                                    error={(isMaxCapacityValid || !isTouched.capacity.max) ? null : {message: "Giới hạn tối đa phải nhỏ hơn 120 và lớn hơn tối thiểu"}}
                                    id={"max"}
                                    type={"text"}
                                    label={"Max"}
                                    placeholder={"Nhập max"}
                                    onChange={e => {
                                        this.setState({capacity: {max: e.target.value, min: capacity.min},
                                            isTouched: {
                                                ...isTouched,
                                                capacity: {max: true, min: isTouched.capacity.min}
                                            }
                                        })
                                    }}
                                    value={capacity.max}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>
                    <button type="button" className="btn btn-confirm" onClick={this.handleConfirmClass}
                            disabled={!isMinCapacityValid || !isNameValid || !isMaxCapacityValid}>
                        {classInfo ? "Cập nhật" : "Tạo mới"}
                    </button>

                </div>
            </div>
        );
    }
}