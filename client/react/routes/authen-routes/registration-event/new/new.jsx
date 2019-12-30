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
import {parseYear} from "../../../../../common/utils/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";

class RegistrationEventNewRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
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
                year: years[1],
                semester: semester[1],
                studentGroup: studentGroups[1],
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

    renderServerError = () => {
        let {error} = this.state;
        let {year, semester, studentGroup} = this.form.getData();
        let errMatcher = {
            "existed": `Đợt đăng ký học ${semester.label} ${studentGroup.label} năm học ${year.label} đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(error) ? errMatcher[error] : "Đã có lỗi xảy ra"
    };

    handleCreateRegistrationEvent = () => {
        this.setState({loading: true});
        let data = this.form.getData();
        if(!data.delay){
            data = omit(data, "delay");
        }else{
            data.delay = data.delay.toString();
        }
        registrationEventApi.create({...data,
            year: parseYear(data.year.value),
            semester: data.semester.value,
            studentGroup: data.studentGroup.value,
        }).then(newRegistrationEvent => {
           customHistory.push(`/manage/registration-event/${newRegistrationEvent._id}/edit`);
        }).catch(err => this.setState({loading: false, error: err.message}));
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
                                <div style={{padding: "20px 20px 0 20px"}}>
                                    {this.state.error && (
                                        <div className="server-error">
                                            {this.renderServerError()}
                                        </div>
                                    )}
                                </div>
                                <RegistrationEventForm
                                    form={this.form}
                                />
                            </div>
                            <div className="route-actions">
                                <button className="btn btn-cancel"
                                        onClick={() => customHistory.push("/manage/registration-events")}

                                >
                                    Trở về
                                </button>
                                <button className="btn btn-next"
                                        onClick={this.handleCreateRegistrationEvent}
                                        disabled={!canCreate}
                                >
                                    Tạo mới
                                    {this.state.loading && (
                                        <LoadingInline/>
                                    )}
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