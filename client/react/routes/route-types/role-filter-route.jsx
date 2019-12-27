import React from "react";
import {userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";
import {authenCache} from "../../../common/cache/authen-cache";
import {AuthenLayout} from "../../layout/authen-layout/authen-layout";

const routesMap = {
    "user": "/manage",
    "manage": "/"
}

export const RoleFilterRoute = ({component: Component, roles = null, type, ...rest}) => {
    let getComp = (props) => {
        let info = userInfo.getState();

        if (info && roles && roles.length) {

            if (!roles.includes(info.role)) {

                return (
                    <Redirect
                        to={{
                            pathname: routesMap[type]
                        }}
                    />
                )
            }
        }

        return (

            <Component {...props}/>


        )
    };
    return (
        <Route
            {...rest}
            render={props => getComp(props)}
        />
    );
};


