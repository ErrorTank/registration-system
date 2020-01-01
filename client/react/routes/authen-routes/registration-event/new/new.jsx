import React from 'react';
import {AuthenLayoutTitle} from "../../../../layout/authen-layout/authen-layout-title";
import {PageTitle} from "../../../../common/page-title/page-title";
import RegistrationEventForm from "../registration-event-form";
import {customHistory} from "../../../routes";
import omit from "lodash/omit"
import {registrationEventApi} from "../../../../../api/common/registration-event";
import {parseYear} from "../../../../../common/utils/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";


class RegistrationEventNewRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };


    };

    renderServerError = () => {
        let {error} = this.state;
        let {year, semester, studentGroup} = this.form.getData();
        let errMatcher = {
            "existed": `Đợt đăng ký học ${semester.label} ${studentGroup.label} năm học ${year.label} đã tồn tại`,
        };
        return errMatcher.hasOwnProperty(error) ? errMatcher[error] : "Đã có lỗi xảy ra"
    };

    handleCreateRegistrationEvent = (form) => {
        this.setState({loading: true});
        let data = form.getData();
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
                                    onFormChange={(formData) => {
                                        this.state.error && this.setState({error: ""});
                                    }}
                                    serverError={this.state.error}
                                    renderActions={(form) => {
                                        const canCreate = !form.getInvalidPaths().length && !this.state.error && !this.state.loading;
                                        return (
                                            <>
                                                <button className="btn btn-cancel"
                                                        onClick={() => customHistory.push("/manage/registration-events")}

                                                >
                                                    Trở về
                                                </button>
                                                <button className="btn btn-next"
                                                        onClick={() => this.handleCreateRegistrationEvent(form)}
                                                        disabled={!canCreate}
                                                >
                                                    Tạo mới
                                                    {this.state.loading && (
                                                        <LoadingInline/>
                                                    )}
                                                </button>
                                            </>
                                        )
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </AuthenLayoutTitle>

            </PageTitle>
        );
    }
}

export default RegistrationEventNewRoute;