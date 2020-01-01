import React, {Component} from 'react';
import {Select} from "../../../common/select/select";
import {years} from "../../../../const/years";
import {semester} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {DateTimePicker, MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CommonInput} from "../../../common/common-input/common-input";
import {KComponent} from "../../../common/k-component";
import * as yup from "yup";
import uniqid from "uniqid";
import {createSimpleForm} from "../../../common/form-validator/form-validator";

class RegistrationEventForm extends KComponent {
    constructor(props) {
        super(props);

        const registrationEventSchema = yup.object().shape({
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object(),
            childEvents: yup.array().of(yup.object().shape({
                delay: yup.number().min(0, "Thời gian delay phải lớn hơn 0 mili giây").typeError('Không được để trống'),
                from: yup.date().notReach("Thời gian bắt đầu phải trước kết thúc"),
                to: yup.date()
            })),

        });

        this.getInitChildEvent = () => {
            let fromDate = new Date();
            let toDate = new Date();
            toDate.setDate(toDate.getDate() + 1);

            return {
                id: uniqid(),
                delay: 0,
                from: fromDate.toISOString(),
                to: toDate.toISOString()
            }
        };

        const getInitData = () => {


            return {
                year: years[1],
                semester: semester[1],
                studentGroup: studentGroups[1],
                childEvents: [
                    {...this.getInitChildEvent()}
                ]

            }
        };

        this.form = createSimpleForm(registrationEventSchema, {
            initData: getInitData()
        });

        this.onUnmount(this.form.on("change", (state) => {
            this.forceUpdate();
            this.props.onFormChange(state);

        }));
        this.form.validateData();
    }

    removeEvent = (eventID) => {
        let events = this.form.getPathData("childEvents");
        this.form.updatePathData("childEvents", events.filter(each => each.id !== eventID));
    };

    addMoreEvent = () => {
        let events = this.form.getPathData("childEvents");
        events = [...events.concat({...this.getInitChildEvent()})];
        this.form.updatePathData("childEvents", events);

    };

    render() {
        let form = this.form;
        let childEvents = form.getPathData("childEvents");
        return (
            <div className="registration-event-form manage-form">
                <div className="form-row row">
                    <div className="form-item col-4">
                        <p className="form-label">Năm học</p>
                        {form.enhanceComponent("year", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={years.filter(each => each.value !== "")}
                                value={others.value}
                                displayAs={(each) => each.label}
                                getValue={each => each.value}
                                onChange={e => {
                                    onChange(years.find(sp => sp.value === e.target.value))
                                }}
                            />

                        ), true)}
                    </div>
                    <div className="form-item col-4">
                        <p className="form-label">Học kì</p>
                        {form.enhanceComponent("semester", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={semester.filter(each => each.value !== "")}
                                value={others.value}
                                displayAs={(each) => each.label}
                                getValue={each => each.value}
                                onChange={e => {
                                    onChange(semester.find(sp => sp.value === Number(e.target.value)))
                                }}
                            />

                        ), true)}

                    </div>
                    <div className="form-item col-4">
                        <p className="form-label">Nhóm</p>
                        {form.enhanceComponent("studentGroup", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={studentGroups.filter(each => each.value !== "")}
                                value={others.value}
                                displayAs={(each) => each.label}
                                getValue={each => each.value}
                                onChange={e => {
                                    onChange(studentGroups.find(sp => sp.value === Number(e.target.value)))
                                }}
                            />

                        ), true)}
                    </div>
                </div>
                <div className="child-summary">
                    <span className="label">Tổng số đợt nhỏ:</span>
                    <span className="value">{childEvents.length}</span>
                    <p className="sub">*Số đợt nhỏ tối đa là 3</p>
                </div>
                {childEvents.map((each, i) => {
                    return (
                        <div className="child-event" key={each.id}>
                            <div className="child-action">
                                {(i === childEvents.length -1 && childEvents.length < 3) && (
                                    <div className="action-btn plus"
                                         onClick={this.addMoreEvent}
                                    >
                                        <i className="fal fa-plus"></i>
                                    </div>
                                )

                                }

                                {childEvents.length > 1 && (
                                    <div className="action-btn minus"
                                         onClick={() => this.removeEvent(each.id)}
                                    >
                                        <i className="fal fa-minus"></i>
                                    </div>
                                )}

                            </div>
                            <div className="form-row row" >
                                <div className="form-item col-4">
                                    <p className="form-label">Thời gian bắt đầu</p>
                                    {form.enhanceComponent(`childEvents[${i}].from`, ({error, onChange, onEnter, ...others}) => {

                                        return (
                                            <div className="date-picker-wrapper">
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <DateTimePicker
                                                        showTodayButton
                                                        value={others.value}
                                                        onChange={onChange}
                                                        format="dd/MM/yyyy HH:mm"
                                                        autoOk
                                                        ampm={false}

                                                    />

                                                </MuiPickersUtilsProvider>
                                                {error && (
                                                    <p className="form-error">{error.message}</p>
                                                )}
                                            </div>
                                        )
                                    }, true)}
                                </div>
                                <div className="form-item col-4">
                                    <p className="form-label">Thời gian kết thúc</p>
                                    {form.enhanceComponent(`childEvents[${i}].to`, ({error, onChange, onEnter, ...others}) => {

                                        return (
                                            <div className="date-picker-wrapper">
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <DateTimePicker
                                                        showTodayButton
                                                        value={others.value}
                                                        onChange={onChange}
                                                        format="dd/MM/yyyy HH:mm"
                                                        autoOk
                                                        ampm={false}
                                                    />

                                                </MuiPickersUtilsProvider>
                                                {error && (
                                                    <p className="form-error">{error.message}</p>
                                                )}
                                            </div>
                                        )
                                    }, true, ["from"])}
                                </div>
                                <div className="form-item col-4">
                                    {form.enhanceComponent(`childEvents[${i}].delay`, ({error, onChange, onEnter, ...others}) => (
                                        <CommonInput
                                            className="pt-0"
                                            id={"delay"}
                                            type={"text"}
                                            error={error}
                                            label={"Thời gian delay (Mili giây)"}

                                            placeholder={"Nhập thời gian delay"}
                                            onChange={e => {

                                                onChange(e);

                                            }}
                                            {...others}
                                        />
                                    ), true)}
                                </div>
                            </div>
                        </div>

                    )
                })}
                <div className="form-actions">
                    {this.props.renderActions(form)}
                </div>
            </div>
        );
    }
}


export default RegistrationEventForm;