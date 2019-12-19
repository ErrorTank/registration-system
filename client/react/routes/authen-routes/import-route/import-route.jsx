import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {AuthenLayout} from "../../../layout/authen-layout/authen-layout";

export default class ImportRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <PageTitle
                title={"Import"}
            >
                <AuthenLayout
                    title={"Import dữ liệu"}
                >
                    <div className="import-route">

                    </div>

                </AuthenLayout>
            </PageTitle>
        );
    }
}