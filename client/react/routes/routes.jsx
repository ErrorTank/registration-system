import React, {lazy, Suspense} from "react";
import {Route, Switch, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {WithLocationRoute} from "./route-types/with-location-route";
import {AuthenRoute} from "./route-types/authen-route";
import {GuestRoute} from "./route-types/guest-route";
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils/common";

const LoginRoute = lazy(delayLoad(() => import("./guest-routes/login/login")));
const Dashboard = lazy(delayLoad(() => import("./authen-routes/dashboard/dashboard")));
const ImportRoute = lazy(delayLoad(() => import("./authen-routes/import-route/import-route")));
const ResultRoute = lazy(delayLoad(() => import("./authen-routes/result-route/result-route")));
const EduProgramRoute = lazy(delayLoad(() => import("./authen-routes/edu-program-route/edu-program-route")));
const SchoolScheduleRoute = lazy(delayLoad(() => import("./authen-routes/school-schedule-route/school-schedule-route")));

export class MainRoute extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div id="main-route">
                <ModalsRegistry/>
                <Router
                    history={customHistory}
                >
                    <Suspense fallback={<OverlayLoading/>}>
                        <Switch>

                            <AuthenRoute exact path="/" component={props => <Dashboard {...props}/>}/>
                            <AuthenRoute exact path="/import" component={props => <ImportRoute {...props} />} excludeRoles={["sv", "bm", "gv"]}/>
                            <AuthenRoute exact path="/chuong-trinh-dao-tao" component={props => <EduProgramRoute {...props} />} excludeRoles={["admin", "bm", "gv", "pdt"]}/>
                            <AuthenRoute exact path="/tkb-toan-truong" component={props => <SchoolScheduleRoute {...props} />} excludeRoles={["admin", "pdt"]}/>
                            <AuthenRoute exact path="/bang-diem" component={props => <ResultRoute {...props} />} excludeRoles={["admin", "bm", "gv", "pdt"]}/>
                            <GuestRoute exact path="/login" render={props => <LoginRoute {...props}/>}/>
                        </Switch>
                    </Suspense>
                </Router>

            </div>
        );
    }
}