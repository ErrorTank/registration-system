import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

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
                    <div className="ins-schedule-route manage-list-route">
                        <div className="common-route-wrapper">

                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}