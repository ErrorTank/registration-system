import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";

import {KComponent} from "../../../common/k-component";


export default class ImportRoute extends KComponent {
    constructor(props) {
        super(props);
        props.setTitle("Bảng điểm cá nhân");
        this.state = {

        };
    };

    render() {

        return (
            <PageTitle
                title={"Bảng điểm cá nhân"}
            >
                <div className="result-route">
                    <div className="common-route-wrapper">
                        <div>

                        </div>
                    </div>
                </div>
            </PageTitle>
        );
    }
}