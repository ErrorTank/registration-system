import React from 'react';
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {PageTitle} from "../../../../common/page-title/page-title";
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {years} from "../../../../../const/years";
import {semester} from "../../../../../const/semester";
import {studentGroups} from "../../../../../const/student-group";
import RegistrationEventForm from "../registration-event-form";
import {customHistory} from "../../../routes";
import omit from "lodash/omit"
import {registrationEventApi} from "../../../../../api/common/registration-event";

class RegistrationEventNewRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };

        const registrationEventSchema = yup.object().shape({
            studentGroup: yup.object(),
            semester: yup.object(),
            year: yup.object(),
            delay: yup.number().min(0, "Thời gian delay phải lớn hơn 0 mili giây").typeError('Không được để trống'),
            from: yup.date().notReach(yup.ref("to"), "Thời gian bắt đầu phải trước kết thúc"),
            to: yup.date()
        });

        const getInitData = () => {
            let fromDate = new Date();
            let toDate = new Date();
            toDate.setDate(toDate.getDate() + 1);

            return {
                year: years[0],
                semester: semester[0],
                studentGroup: studentGroups[0],
                delay: 0,
                from: fromDate.toISOString(),
                to: toDate.toISOString()
            }
        };

        this.form = createSimpleForm(registrationEventSchema, {
            initData: getInitData()
        });

        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();

            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    handleCreateRegistrationEvent = () => {
        this.setState({loading: true});
        let data = this.form.getData();
        if(!data.delay){
            data = omit(data, "delay");
        }else{
            data.delay = data.delay.toString();
        }
        registrationEventApi.create({...data}).then(newRegistrationEvent => {
           customHistory.push("/manage/registration-events");
        }).catch(err => {

        });
    };

    render() {
        const canCreate = !this.form.getInvalidPaths().length && !this.state.error && !this.state.loading;
        return (
            <PageTitle
                title={"Tạo đợt đăng ký học"}
            >
                <AuthenLayoutTitle
                    title={"Tạo đợt đăng ký học"}
                >
                    <div className="registration-event-new-route">
                        <div className="common-route-wrapper">
                            <div className="route-body">
                                <RegistrationEventForm
                                    form={this.form}
                                />
                            </div>
                            <div className="route-actions">
                                <button className="btn btn-cancel"
                                        onClick={this.handleCreateRegistrationEvent}
                                >
                                    Trở về
                                </button>
                                <button className="btn btn-next"
                                        onClick={() => customHistory.push("/manage/registration-events")}
                                        disabled={!canCreate}
                                >
                                    Tạo mới
                                </button>
                            </div>
                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}

export default RegistrationEventNewRoute;