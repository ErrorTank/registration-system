import React from "react";
import {Route, Redirect} from "react-router-dom"
import {authenCache} from "../../../common/cache/authen-cache";
import {KComponent} from "../../common/k-component";


export class GuestRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {};
        // this.onUnmount(userInfo.onChange(() => {
        //   this.forceUpdate();
        // }));
    };

    render() {
        let {render, component: Component, ...rest} = this.props;

        return (
            <Route
                {...rest}
                render={props => !authenCache.getAuthen() ? render ? render(props) : (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                )}
            />
        );
    }
}
