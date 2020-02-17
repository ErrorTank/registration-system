import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";

export class AccountBasicForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        props.form.validateData();
    }


    render() {
        let {form, isEdit} = this.props;
        return (
            <div className="account-basic-form">
                <div className="form-title">
                    Thông Tin Tài Khoản Cơ Bản
                </div>
                <div className="form-row">
                    {form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"username"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Tên đăng nhập"}
                            placeholder={"Nhập tên đăng nhập"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                    {form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"password"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Mật khẩu"}
                            placeholder={"Nhập mật khẩu"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="form-row">
                    {form.enhanceComponent("name", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"name"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Họ và tên"}
                            placeholder={"Nhập họ và tên"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                    {form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"email"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Email"}
                            placeholder={"Nhập email"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>

            </div>
        );
    }
}
