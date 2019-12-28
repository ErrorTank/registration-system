import React, {Component} from 'react';
import {Select} from "../../../common/select/select";
import {years} from "../../../../const/years";
import {semester} from "../../../../const/semester";
import {studentGroups} from "../../../../const/student-group";
import {DateTimePicker, MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CommonInput} from "../../../common/common-input/common-input";

class RegistrationEventForm extends Component {
    render() {
        let {form} = this.props;
        return (
            <div className="registration-event-form manage-form">
                <div className="form-row row">
                    <div className="form-item col-6">
                        <p className="form-label">Thời gian bắt đầu</p>
                        {this.props.form.enhanceComponent("from", ({error, onChange, onEnter, ...others}) => (
                            <div className="date-picker-wrapper">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        showTodayButton
                                        disablePast
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
                        ), true)}
                    </div>
                    <div className="form-item col-6">
                        <p className="form-label">Thời gian kết thúc</p>
                        {this.props.form.enhanceComponent("to", ({error, onChange, onEnter, ...others}) => (
                            <div className="date-picker-wrapper">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        showTodayButton
                                        value={others.value}
                                        onChange={onChange}
                                        disablePast
                                        format="dd/MM/yyyy HH:mm"
                                        autoOk
                                        ampm={false}
                                    />

                                </MuiPickersUtilsProvider>
                                {error && (
                                    <p className="form-error">{error.message}</p>
                                )}
                            </div>
                        ), true, ["from"])}
                    </div>
                </div>
                <div className="form-row row">
                    <div className="form-item col-4">
                        <p className="form-label">Năm học</p>
                        {form.enhanceComponent("year", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={years}
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
                        {this.props.form.enhanceComponent("semester", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={semester}
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
                        {this.props.form.enhanceComponent("studentGroup", ({error, onChange, onEnter, ...others}) => (
                            <Select
                                error={error}
                                options={studentGroups}
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
                <div className="form-row row">
                    <div className="form-item col-4">
                        {form.enhanceComponent("delay", ({error, onChange, onEnter, ...others}) => (
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
        );
    }
}

export default RegistrationEventForm;