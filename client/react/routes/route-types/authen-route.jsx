import React from "react";
import { userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";
import {authenCache} from "../../../common/cache/authen-cache";
import {AuthenCheck} from "./authen-check";

export const AuthenRoute = ({component: Component, excludeRoles = null, ...rest}) => {
  let getComp = (props) => {
    let info = userInfo.getState();
    if (!authenCache.getAuthen()) {

      return (
        <Redirect to={{pathname: "/"}}/>
      )
    }
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
      <AuthenCheck {...props}>
        <Component {...props}/>
      </AuthenCheck>
    )
  };
  return (
    <Route
      {...rest}
      render={props => {
        return (
          <TrackLocation
            location={props.match.url}
            render={() => getComp(props)}
          />


        )
      }}
    />
  );
};


