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
                            <AuthenRoute exact path="/import" component={props => <ImportRoute {...props}/>}/>
                            <GuestRoute exact path="/login" render={props => <LoginRoute {...props}/>}/>
                        </Switch>
                    </Suspense>
                </Router>

            </div>
        );
    }
}