import React, {lazy, Suspense} from "react";
import {Route, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {AuthenRoute} from "./route-types/authen-route";
import {GuestRoute} from "./route-types/guest-route";
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils/common";
import {RoleFilterRoute} from "./route-types/role-filter-route";
import {CustomSwitch} from "./route-types/custom-switch";
import {userInfo} from "../../common/states/common";

const LoginRoute = lazy(delayLoad(() => import("./guest-routes/login/login")));
const Dashboard = lazy(delayLoad(() => import("./authen-routes/dashboard/dashboard")));
const AdminDashboard = lazy(delayLoad(() => import("./authen-routes/admin-dashboard/admin-dashboard")));
const ImportRoute = lazy(delayLoad(() => import("./authen-routes/import-route/import-route")));
const ResultRoute = lazy(delayLoad(() => import("./authen-routes/result-route/result-route")));
const EduProgramRoute = lazy(delayLoad(() => import("./authen-routes/edu-program-route/edu-program-route")));
const SchoolScheduleRoute = lazy(delayLoad(() => import("./authen-routes/school-schedule-route/school-schedule-route")));
const NewRegistrationEventRoute = lazy(delayLoad(() => import("./authen-routes/registration-event/new/new")));
const EditRegistrationEventRoute = lazy(delayLoad(() => import("./authen-routes/registration-event/edit/edit")));
const RegistrationEventsRoute = lazy(delayLoad(() => import("./authen-routes/registration-event/list/list")));
const InsScheduleRoute = lazy(delayLoad(() => import("./authen-routes/ins-schedule-route/ins-schedule-route")));
const InsDashboard = lazy(delayLoad(() => import("./authen-routes/ins-dashboard/ins-dashboard")));
const ForceRegisterRoute = lazy(delayLoad(() => import("./authen-routes/force-register-route/force-register-route")));
const RegistrationRoute = lazy(delayLoad(() => import("./authen-routes/registration-route/registration-route")));
const ScheduleRoute = lazy(delayLoad(() => import("./authen-routes/schedule-route/schedule-route")));
const DivisionClassRoute = lazy(delayLoad(() => import("./authen-routes/division-class/division-class")));

class App extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const {location} = this.props;
        const isError = !!(
            location.state &&
            location.state.error
        );

        return (
            <Suspense fallback={<OverlayLoading/>}>
                {isError ? <Redirect to={{pathname: "/"}}/> : (
                    <CustomSwitch>
                        <GuestRoute exact path="/login" render={props => <LoginRoute {...props}/>}/>
                        <AuthenRoute
                            path={"/"}
                            component={authenProps => (
                                <CustomSwitch>
                                    <Route
                                        path={"/manage"}
                                        render={props => (
                                            <CustomSwitch>
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path}
                                                    component={props => <AdminDashboard  {...authenProps} {...props}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/registration-event/new"}
                                                    component={props =>
                                                        <NewRegistrationEventRoute  {...authenProps} {...props}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/registration-event/:eventID/edit"}
                                                    component={props =>
                                                        <EditRegistrationEventRoute  {...authenProps} {...props}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/registration-events"}
                                                    component={props =>
                                                        <RegistrationEventsRoute  {...authenProps} {...props}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/import"}
                                                    component={props => <ImportRoute  {...authenProps} {...props}/>}
                                                    roles={["admin", "pdt"]}
                                                />

                                            </CustomSwitch>

                                        )}
                                    />
                                    <Route
                                        path={"/giao-vien"}
                                        render={props => (
                                            <CustomSwitch>
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path}
                                                    component={props => <InsDashboard  {...authenProps} {...props}/>}
                                                    roles={["gv"]}
                                                />

                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/lich-giang-day"}
                                                    component={props =>
                                                        <InsScheduleRoute  {...authenProps} {...props}/>}
                                                    roles={["gv"]}
                                                />
                                            </CustomSwitch>
                                        )}
                                    />
                                    <Route
                                        path={"/"}
                                        render={props => (
                                            <CustomSwitch>
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/"}
                                                    component={props => <Dashboard  {...authenProps} {...props}/>}
                                                    roles={["sv"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/ep-cung"}
                                                    component={props => <ForceRegisterRoute  {...authenProps} {...props}/>}
                                                    roles={["gv", "pdt"]}
                                                    condition={() => {
                                                        let info = userInfo.getState();
                                                        return info ? info.role === "gv" ? info.info.canEditSchedule : true : false;
                                                    }}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/lop-bo-mon"}
                                                    component={props => <DivisionClassRoute  {...authenProps} {...props}/>}
                                                    roles={["gv"]}
                                                    condition={() => {
                                                        let info = userInfo.getState();
                                                        return info.role === "gv" && info.info.canEditSchedule;
                                                    }}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/tkb"}
                                                    component={props => <ScheduleRoute  {...authenProps} {...props}/>}
                                                    roles={["sv"]}

                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/chuong-trinh-dao-tao"}
                                                    component={props => <EduProgramRoute  {...authenProps} {...props}/>}
                                                    roles={["sv", "gv"]}
                                                />

                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/tkb-toan-truong"}
                                                    component={props =>
                                                        <SchoolScheduleRoute  {...authenProps} {...props}/>}
                                                    roles={["sv", "gv", "bm", "admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/bang-diem"}
                                                    component={props => <ResultRoute  {...authenProps} {...props}/>}
                                                    roles={["sv"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/dang-ky-hoc"}
                                                    component={props =>
                                                        <RegistrationRoute  {...authenProps} {...props}/>}
                                                    roles={["sv"]}
                                                />
                                            </CustomSwitch>
                                        )}
                                    />

                                </CustomSwitch>
                            )}
                        />
                        {/*<AuthenRoute exact path="/" component={props => (*/}

                        {/*<Dashboard {...props}/>*/}
                        {/*)}/>*/}
                        {/*<AuthenRoute exact path="/import" component={props => <ImportRoute {...props} />} excludeRoles={["sv", "bm", "gv"]}/>*/}
                        {/*<AuthenRoute exact path="/chuong-trinh-dao-tao" component={props => <EduProgramRoute {...props} />} excludeRoles={["admin", "bm", "pdt"]}/>*/}
                        {/*<AuthenRoute exact path="/tkb-toan-truong" component={props => <SchoolScheduleRoute {...props} />} excludeRoles={["admin", "pdt"]}/>*/}
                        {/*<AuthenRoute exact path="/bang-diem" component={props => <ResultRoute {...props} />} excludeRoles={["admin", "bm", "gv", "pdt"]}/>*/}

                    </CustomSwitch>
                )}

            </Suspense>

        )
    };
}

export class MainRoute extends React.Component {
    constructor(props) {
        super(props);
    };


    render() {

        return (
            <div id="main-route">
                <Router
                    history={customHistory}
                >
                    <Route component={App}/>
                </Router>

                <ModalsRegistry/>
            </div>
        );
    }
}