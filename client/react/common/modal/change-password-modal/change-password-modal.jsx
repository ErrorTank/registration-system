import React, {Fragment} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";
import classnames from "classnames";
import uniq from "lodash/uniq"
import {createSimpleForm} from "../../form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../common-input/common-input";
import {KComponent} from "../../k-component";
import {userApi} from "../../../../api/common/user-api";
import {commonPopup} from "../../common-popup/common-popup";

export const changePasswordModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ChangePasswordModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            )
        });
        return modal.result;
    }
};

class ChangePasswordModal extends KComponent{

    constructor(props){
        super(props);
        this.state={
            loading: false,
        };


        this.form = createSimpleForm(yup.object().shape({
            currentPassword:  yup.string().test({
                message: "Mật khẩu hiện tại không đúng",
                test: value => value === props.info.password
            }),
            newPassword: yup.string().min(6, "Mật khẩu bắt buộc từ 6 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt"),
            rePassword: yup.string().equalTo(yup.ref("newPassword"), "Mật khẩu nhập lại không trùng với mật khẩu mới")
        }), {
            initData: {
                currentPassword: "",
                newPassword: "",
                rePassword: ""
            }
        });

        this.onUnmount(this.form.on("change", (state) => {
            this.forceUpdate();

        }));
        this.form.validateData();
    };

    handleChangePassword = () => {
        userApi.updateUserInfo(this.props.info._id, {password: this.form.getPathData("newPassword")}).then(() => {
            commonPopup.publish({
                "common-popup": (
                    <div className="common-success-notify">
                        Đổi mật khẩu thành công
                    </div>

                ),

            });
            this.props.onClose(true);
        })
    };

    render(){
        let {onClose} = this.props;
        let canChange = !this.state.loading && !this.form.getInvalidPaths().length;
        console.log(this.form.getData())

        return(
            <div className={"change-password-modal common-modal"}>
                <div className="modal-header">
                    <div className="modal-title">
                        Đổi mật khẩu
                    </div>
                    <i className="fas fa-times close-modal"
                       onClick={() => onClose()}
                    />
                </div>
                <div className="modal-body">
                    <div className="common-form">
                        <div className="form-row">
                            {this.form.enhanceComponent("currentPassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"currentPassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Mật khẩu hiện tại"}
                                    placeholder={"Nhập mật khẩu hiện tại"}
                                    onChange={e => {

                                        this.setState({error: ""});
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>
                        <div className="form-row">
                            {this.form.enhanceComponent("newPassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"newPassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Mật khẩu mới"}
                                    placeholder={"Nhập mật mới"}
                                    onChange={e => {

                                        this.setState({error: ""});
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>
                        <div className="form-row">
                            {this.form.enhanceComponent("rePassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"rePassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Nhập lại mật khẩu mới"}
                                    placeholder={"Nhập lại mật khẩu mới"}
                                    onChange={e => {

                                        this.setState({error: ""});
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>

                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                        Đóng
                    </button>
                    <button type="button" className="btn btn-confirm" disabled={!canChange} onClick={this.handleChangePassword}>
                        Đổi mật khẩu
                        {
                            this.state.loading && (
                                <LoadingInline/>
                            )
                        }
                    </button>

                </div>
            </div>
        );
    }
}