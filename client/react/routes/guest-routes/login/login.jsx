import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {Container} from "@material-ui/core"
import * as yup from "yup"
import {createSimpleForm} from "../../../common/form-validator/form-validator";

export default class LoginRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
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

    handleLogin = () => {

    };

    render(){
        return(
            <PageTitle
                title={"Đăng nhập"}
            >
                <div className="login-route">
                    <Container maxWidth="lg">
                        <div className="login-form-wrapper">
                            <div className="login-form">
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
                                        <div className="main-title">
                                            ĐĂNG NHẬP
                                        </div>

                                    </div>

                                </div>
                                <div className="login-form__body">
                                    <div className="wrapper">

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