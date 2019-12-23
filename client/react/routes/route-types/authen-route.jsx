import React from "react";
import {userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";
import {authenCache} from "../../../common/cache/authen-cache";
import {AuthenLayout} from "../../layout/authen-layout/authen-layout";

export const AuthenRoute = ({component: Component, excludeRoles = null, ...rest}) => {
    let getComp = (props) => {
        let info = userInfo.getState();
        if (!authenCache.getAuthen()) {
            return (
                <Redirect to={{pathname: "/login"}}/>
            )
        }
        console.log(excludeRoles)
        if (info && excludeRoles && excludeRoles.length) {

            if (excludeRoles.includes(info.role)) {

                return (
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                )
            }
        }


        // return (
        //   <AuthenLayout location={props.location} match={props.match}>
        //     <Component {...props}/>
        //   </AuthenLayout>
        // )
        return (

                <AuthenLayout>
                    {({setTitle}) => (
                            <Component {...props} setTitle={setTitle}/>
                    )}
                </AuthenLayout>

        )
    };
    return (
        <Route
            {...rest}
            render={props => {
                console.log(props)
                return (
                    <TrackLocation
                        location={window.location.href.replace(document.location.origin, "")}
                        render={() => getComp(props)}
                    />


                )
            }}
        />
    );
};


