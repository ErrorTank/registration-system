import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {KComponent} from "../../../common/k-component";
import {AuthenLayoutTitle} from "../../../layout/authen-layout/authen-layout-title";
import {commonApi} from "../../../../api/common/common-api";

export default class ForceRegisterRoute extends KComponent {
    constructor(props) {
        super(props);


        this.initData = {
            pickedStudents: [],
            students: [],
            loadStudents: true
        };

        this.state = {...this.initData};
        commonApi.getBriefStudents().then(students => this.setState({students, loadStudents: false}))
    };


    render() {
        let {students, loadStudents} = this.state;
        return (
            <PageTitle
                title={"Ép cứng"}
            >
                <AuthenLayoutTitle
                    title={"Ép cứng môn học"}
                >
                    <div className="force-register-route">
                        <div className="common-route-wrapper">

                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}