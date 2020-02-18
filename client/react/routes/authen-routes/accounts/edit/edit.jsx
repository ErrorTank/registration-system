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
import {AdminPdtForm} from "../common-form/admin-pdt-form";
import {InstructorForm} from "../common-form/instructor-form";

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
                initData: pick(data, ["username", "password", "role", "name", "phone", "email", "identityID"])
            });
            this.infoForm = null;
            let infoForm = getAccountFormStructure(data.role);
            if(infoForm){
                this.infoForm = createSimpleForm(infoForm.schema, {
                    initData: {...data.info}
                });
                this.onUnmount(this.infoForm.on("change", (state) => {
                    this.state.error && this.setState({error: ""});
                    this.forceUpdate();
                }));
            }
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
        "pdt":  () => (
            <AdminPdtForm
                form={this.infoForm}
                isEdit
            />
        ),"admin": () => (
            <AdminPdtForm
                form={this.infoForm}
                isEdit
            />
        ),"gv": () => (
            <InstructorForm
                form={this.infoForm}
                isEdit
            />
        ),"sv": () => (
            <AdminPdtForm
                form={this.infoForm}
                isEdit
            />
        ),
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

                return this.detailFormComponent[this.state.draft.role]()
            }
        },
    ];

    render() {
        let {fetching, draft, error} = this.state;
        if(!fetching){
            console.log(this.accountBasicForm.getData())
            console.log(this.accountBasicForm.getInvalidPaths())
            console.log(this.infoForm.getData())
            console.log(this.infoForm.getInvalidPaths())
        }
        let disabledTabs = [];
        if(!this.infoForm){
            disabledTabs.push(1);
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
                                    disabledTabs={disabledTabs}
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