import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {Container} from "@material-ui/core"
import * as yup from "yup"
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {KComponent} from "../../../common/k-component";
import {CommonInput} from "../../../common/common-input/common-input";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {customHistory} from "../../routes";


class LoginForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };
        const loginSchema = yup.object().shape({
            username: yup.string().required("Tên đăng nhập không được để trống"),
            password: yup.string().min(6, "Mật khẩu phải nhiều hơn 6 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                username: "",
                password: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleLogin()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    render() {
        return (
            <div className="login-form">
                {this.state.error && (
                    <div className="server-error">
                        error
                    </div>
                )}
                {this.form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0"
                        error={error}
                        id={"username"}
                        onKeyDown={onEnter}
                        type={"text"}
                        label={"Tên đăng nhập"}
                        placeholder={"Nhập tên đăng nhập"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0"
                        error={error}
                        id={"password"}
                        onKeyDown={onEnter}
                        type={"text"}
                        label={"Mật khẩu"}
                        placeholder={"Nhập mật khẩu"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <div className="navigate-btn">
                    {this.props.renderNavigate()}
                </div>
                <div className="form-actions">
                    <button className="btn btn-block btn-info">
                        Đăng nhập
                    </button>
                </div>
            </div>
        )
    }
}

class ForgotPasswordForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };
        const loginSchema = yup.object().shape({
            recover: yup.string().required("Trường không được để trống"),
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                recover: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleLogin()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    render() {
        return (
            <div className="login-form">
                {this.state.error && (
                    <div className="server-error">
                        error
                    </div>
                )}
                {this.form.enhanceComponent("recover", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0 login-input"
                        error={error}
                        id={"recover"}
                        onKeyDown={onEnter}
                        type={"text"}
                        label={"Email, SĐT hoặc Mã định danh"}
                        placeholder={"Nhập thông tin"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <div className="navigate-btn">
                    {this.props.renderNavigate()}
                </div>
                <div className="form-actions">
                    <button className="btn btn-block btn-info">
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        )
    }
}


export default class LoginRoute extends React.Component {
    constructor(props) {
        super(props);


    };



    forms = {
        "login": {
            title: "Đăng nhập",
            form: () => {
                return (
                    <LoginForm
                        renderNavigate={() => (
                            <span onClick={() => customHistory.push("/login#forgot-password")}>
                    Quên mật khẩu?
                </span>
                        )}
                    />
                )
            },


        },
        "forgotPassword": {
            title: "Đổi mật khẩu",
            form: () => {
                return (
                    <ForgotPasswordForm
                        renderNavigate={() => (
                            <span onClick={() => customHistory.push("/login")}>
                    <KeyboardBackspaceIcon

                    />
                    <span style={{marginLeft: "3px"}}>Quay về đăng nhập</span>

                </span>
                        )}
                    />
                )
            },

        }
    };

    handleLogin = () => {

    };

    render() {

        let form = this.props.location.hash !== "#forgot-password" ? this.forms["login"] : this.forms["forgotPassword"];

        return (
            <PageTitle
                title={"Đăng nhập"}
            >
                <div className="login-route">
                    <Container maxWidth="lg">
                        <div className="login-form-wrapper">
                            <div className="login-form-inner">
                                <div className="login-form__header">
                                    <div className="wrapper">
                                        <div className="header-logo">
                                            <div className="header-logo__image">
                                                <img src={"/assets/images/logotlu.jpg"}/>
                                            </div>
                                            <div className="header-logo__title">
                                                <p>Hệ thống đăng ký học</p>
                                                <p>Trường Đại học Thăng Long</p>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                <div className="login-form__body">
                                    <div className="main-title">
                                        {form.title}
                                    </div>
                                    <div className="form-wrapper">
                                        {form.form()}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </Container>
                </div>
            </PageTitle>
        );
    }
}