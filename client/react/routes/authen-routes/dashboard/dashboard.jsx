import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        props.setTitle("Trang chủ");
    };

    render() {
        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <div className="dashboard-route">

                </div>
            </PageTitle>
        );
    }
}