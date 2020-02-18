import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {Select} from "../../../../common/select/select";
import {years} from "../../../../../const/years";
import {accountTypes} from "../../../../../const/account-types";

export class AccountBasicForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        props.form.validateData();
    }


    render() {
        let {form, isEdit} = this.props;
        let matcher = {
            "pdt": "Nhân viên",
            "admin": "Nhân viên",
            "gv": "Mã giáo viên",
            "sv": "Mã sinh viên"
        };
        return (
            <div className="account-basic-form common-form">
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
                <div className="form-row">
                    {form.enhanceComponent("phone", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"phone"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Số điện thoại"}
                            placeholder={"Số điện thoại"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}

                    {form.enhanceComponent("role", ({error, onChange, onEnter, ...others}) => {
                        return (
                            <Select
                                disabled={isEdit}
                                className="pt-0 account-basic-input"
                                label={"Loại tài khoản"}
                                error={error}
                                options={accountTypes.filter(each => each.value !== "")}
                                value={accountTypes.find(each => each.value === others.value)}
                                displayAs={(each) => each.label}
                                getValue={each => each.value}
                                onChange={e => {
                                    let newValue = accountTypes.find(sp => sp.value === e.target.value).value;
                                    onChange(newValue);
                                    let matcher = {
                                        "pdt": "PDT",
                                        "gv": "",
                                        "sv": "A",
                                        "admin": "",
                                    };
                                    if(!form.getPathData("identityID")){
                                        form.updatePathData("identityID", matcher[newValue]);
                                    }
                                }}
                            />

                        )
                    }, true)}
                    {form.enhanceComponent("identityID", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 account-basic-input"
                            error={error}
                            id={"identityID"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Mã định danh " + `(${matcher[form.getPathData("role")]})`}
                            placeholder={"Nhập mã định danh"}
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
