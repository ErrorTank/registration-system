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
const RegistrationEventsRoute = lazy(delayLoad(() => import("./authen-routes/registration-event/list/list")));

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
                                                    component={props => <AdminDashboard {...props} {...authenProps}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/registration-event/new"}
                                                    component={props =>
                                                        <NewRegistrationEventRoute {...props} {...authenProps}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/registration-events"}
                                                    component={props =>
                                                        <RegistrationEventsRoute {...props} {...authenProps}/>}
                                                    roles={["admin", "pdt"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={props.match.path + "/import"}
                                                    component={props => <ImportRoute {...props} {...authenProps}/>}
                                                    roles={["admin", "pdt"]}
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
                                                    component={props => <Dashboard {...props} {...authenProps}/>}
                                                    roles={["gv", "sv", "bm"]}
                                                />

                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/chuong-trinh-dao-tao"}
                                                    component={props => <EduProgramRoute {...props} {...authenProps}/>}
                                                    roles={["sv", "gv"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/tkb-toan-truong"}
                                                    component={props =>
                                                        <SchoolScheduleRoute {...props} {...authenProps}/>}
                                                    roles={["sv", "gv", "bm"]}
                                                />
                                                <RoleFilterRoute
                                                    {...props}
                                                    exact
                                                    path={"/bang-diem"}
                                                    component={props => <ResultRoute {...props} {...authenProps}/>}
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