import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayout} from "../../../layout/authen-layout/authen-layout";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <AuthenLayout>
                    <div className="dashboard-route">

                    </div>
                </AuthenLayout>
            </PageTitle>
        );
    }
}