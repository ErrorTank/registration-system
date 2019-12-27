import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";

export default class AdminDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    };

    render() {
        return (
            <PageTitle
                title={"Trang chủ quản lý"}
            >
                <AuthenLayoutTitle
                    title={"Trang chủ quản lý"}
                >
                    <div className="admin-dashboard-route">

                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}