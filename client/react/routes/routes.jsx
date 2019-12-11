import React, {lazy, Suspense} from "react";
import {Route, Switch, Router, Redirect} from "react-router-dom"
import {createBrowserHistory} from 'history';
import {ModalsRegistry} from "../common/modal/modals";

export const customHistory = createBrowserHistory();
import {WithLocationRoute} from "./route-types/with-location-route";
import {AuthenRoute, GuestRoute} from "./route-types/authen-route";
import {OverlayLoading} from "../common/overlay-loading";
import {delayLoad} from "../../common/utils/common";

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

                        </Switch>
                    </Suspense>
                </Router>

            </div>
        );
    }
}