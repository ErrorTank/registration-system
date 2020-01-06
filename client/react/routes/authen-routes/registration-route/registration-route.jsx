import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {Alert} from "../../../common/alert/alert";

export default class RegistrationRoute extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <PageTitle
                title={"Đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Đăng ký học"}
                >
                    <div className="registration-route manage-list-route">
                        <div className="common-route-wrapper">
                            <div className="content-wrapper">
                                <Alert
                                    icon={(
                                        <i className="fas fa-info-circle"></i>
                                    )}
                                    strongText={"Thông báo:"}
                                    content={(
                                        <>

                                            <span className="pl-3">Bạn chưa thuộc đối tượng được đăng ký học kì này!</span>
                                        </>
                                    )}
                                />
                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}