import React, {Component} from 'react';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CommonInput} from "../../../common/common-input/common-input";
import {subjectApi} from "../../../../api/common/subject-api";
import {Select} from "../../../common/select/select";
import {MultipleSelect} from "../../../common/multiple-select/multiple-select";


export class SubjectBasicForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            brief: []
        };
        if(props.form.getPathData("division")){
            this.loadBrief(props.form.getPathData("division")).then(brief => {
                this.setState({loading: false, brief});
                this.props.form.validateData();
            });
        }

    }

    loadBrief = (divisionID) => {
        this.setState({loading: true});
        return subjectApi.getSubjectsBriefByDivision(divisionID);
    };

    filterSubject = (list, keyword) => {
        return list.filter(each => each.subjectID.toLowerCase().includes(keyword.trim().toLowerCase()) || each.name.toLowerCase().includes(keyword.trim().toLowerCase()));
    };

    render() {
        let {form, isEdit, divisions} = this.props;
        console.log(this.state.brief.filter(each => form.getPathData("subjectsRequired").includes(each.subjectID)))
        console.log(form.getPathData("division"))
        return (
            <div className="subject-basic-form common-form">
                <div className="form-title">
                    Thông tin môn học cơ bản
                </div>
                <>
                    <div className="form-row">
                        {form.enhanceComponent("subjectID", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 account-basic-input"
                                error={error}
                                id={"subjectID"}
                                onKeyDown={onEnter}
                                type={"text"}
                                label={"Mã môn"}
                                placeholder={"Nhập mã môn"}
                                onChange={e => {
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}
                        {form.enhanceComponent("name", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 account-basic-input"
                                error={error}
                                id={"name"}
                                onKeyDown={onEnter}
                                type={"text"}
                                label={"Tên môn"}
                                placeholder={"Tên môn"}
                                onChange={e => {
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}
                    </div>
                    <div className="form-row">
                        {form.enhanceComponent("credits", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 account-basic-input"
                                error={error}
                                id={"credits"}
                                type={"number"}
                                label={"Số tín chỉ"}
                                placeholder={"Nhập tín chỉ"}
                                onChange={e => {
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}
                        {form.enhanceComponent("coefficient", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 account-basic-input"
                                error={error}
                                id={"coefficient"}
                                type={"number"}
                                label={"Hệ số"}
                                placeholder={"Nhập hê số"}
                                onChange={e => {
                                    onChange(parseFloat(e.target.value));
                                }}
                                {...others}
                            />
                        ), true)}
                    </div>
                    <div className="form-row">
                        {form.enhanceComponent("creditsRequired", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0 account-basic-input"
                                error={error}
                                id={"creditsRequired"}
                                type={"number"}
                                label={"Số tín chỉ tiên quyết"}
                                placeholder={"Nhập tín chỉ tiên quyết"}
                                onChange={e => {
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}

                        {form.enhanceComponent("division", ({error, onChange, onEnter, ...others}) => {
                            return (
                                <Select
                                    className="pt-0 account-basic-input"
                                    label={"Bộ môn"}
                                    error={error}
                                    options={divisions}
                                    getValue={each => {
                                        return each.value
                                    }}
                                    value={divisions.find(each => {
                                        return  each.value === others.value;
                                    })}
                                    displayAs={(each) => each.label}
                                    onChange={e => {
                                        let value = e.target.value === "" ? "" : e.target.value;
                                        onChange(value);
                                        form.updatePathData("subjectsRequired", []);
                                        if(value){
                                            this.loadBrief(value).then(brief => {
                                                this.setState({loading: false, brief});

                                            });
                                        }


                                    }}
                                />

                            )
                        }, true)}

                    </div>
                    {(form.getPathData("division")) && (
                        <div className="form-row">
                            <div className="account-basic-input">
                                <p className="form-label">Điều kiện tiên quyết</p>
                                {form.enhanceComponent("subjectsRequired", ({error, onChange, onEnter, ...others}) => (
                                    <MultipleSelect
                                        values={this.state.brief.filter(each => others.value.includes(each.subjectID))}
                                        list={this.state.brief}
                                        displayTagAs={(tag, index) => tag.subjectID}
                                        displayAs={(item, index) => item.name + ` (${item.subjectID})`}
                                        filterFunc={this.filterSubject}
                                        onChange={value => {
                                            onChange(value.map(each => each.subjectID));
                                        }}
                                        listKey={(item) => item._id}
                                        tagKey={item => item._id}
                                        emptyNotify={() => "Không tìm thấy môn học nào"}
                                        isPicked={item => others.value.find(each => each === item.subjectID)}
                                        deleteFilterFunc={(item1, item2) => item1._id !== item2._id}
                                    />
                                ), true)}
                            </div>


                        </div>
                    )
                    }

                </>

            </div>
        );
    }
}
