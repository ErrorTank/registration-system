import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";

import {userApi} from "../../../../../api/common/user-api";
import {MultipleTabWidget} from "../../../../common/multiple-tab-widget/multiple-tab-widget";
import pick from "lodash/pick";
import {AccountBasicForm} from "../account-basic-form/account-basic-form";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {getAccountFormStructure} from "../schema";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {KComponent} from "../../../../common/k-component";

class AccountEditRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            draft: {},
            fetching: true
        };

        let accountForm = getAccountFormStructure("account");

        this.fetchingData().then(data => {
            this.accountBasicForm = createSimpleForm(accountForm.schema, {
                initData: pick(data, ["username", "password", "role", "name", "phone", "email"])
            });
            this.onUnmount(this.accountBasicForm.on("change", (state) => {
                this.state.error && this.setState({error: ""});
                this.forceUpdate();
            }));
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

    detailFormComponent = {

    };

    tabs = [
        {
            label: "Thông tin tài khoản",
            render: () => {
                return <AccountBasicForm
                    form={this.accountBasicForm}
                    isEdit
                />
            }
        },{
            label: "Thông tin chi tiết",
            render: () => {
                return this.detailFormComponent[this.state.draft.role]
            }
        },
    ];

    render() {
        let {fetching, draft, error} = this.state;
        if(!fetching){
            console.log(this.accountBasicForm.getData())
            console.log(this.accountBasicForm.getInvalidPaths())
        }
        return (
            <PageTitle
                title={"Cập nhật người dùng"}
            >
                <AuthenLayoutTitle
                    title={"Cập nhật người dùng"}
                >
                    <div className="account-edit-route">
                        <div className="common-route-wrapper">
                            {fetching ? (
                                <LoadingInline/>
                            ) : (
                                <MultipleTabWidget
                                    tabs={this.tabs}
                                />
                            )}
                        </div>
                    </div>
                </AuthenLayoutTitle>
            </PageTitle>
        );
    }
}

export default AccountEditRoute;