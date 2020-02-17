import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import uniqid from "uniqid";
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {years} from "../../../../../const/years";
import {mergeYear} from "../../../../../common/utils/common";
import {semester} from "../../../../../const/semester";
import {studentGroups} from "../../../../../const/student-group";
import {userApi} from "../../../../../api/common/user-api";

class AccountEditRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            draft: {},
            fetching: true
        };

        this.fetchingData().then(data => {
            this.setState({
                draft: {...data},
                fetching: false
            });
        });
    }

    fetchingData = () => {
        return userApi.getUserDetails(this.props.match.params.accountID).then(data => {
            return data;
        })
    };

    render() {
        return (
            <PageTitle
                title={"Cập nhật người dùng"}
            >
                <AuthenLayoutTitle
                    title={"Cập nhật người dùng"}
                >
                    <div className="account-edit-route">

                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default AccountEditRoute;