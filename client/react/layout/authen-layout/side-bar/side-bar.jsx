import React from "react";
import {navItems} from "./nav-items";
import classnames from "classnames"
import {customHistory} from "../../../routes/routes";
import {userInfo} from "../../../../common/states/common";

export class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {location} = customHistory;

        return (
            <div className="side-bar">
                {navItems.map(item => {
                    return item.roles.includes(userInfo.getState().role) ? (
                        <div
                            className={classnames("side-bar-item", {active: item.url ? !Array.isArray(item.url) ? location.pathname === item.url : !!item.url.find(each => typeof each === "string" ? location.pathname === each : each.test(location.pathname)) : false, disabled: item.disabled})}
                            key={item.url}
                            onClick={() => customHistory.push(item.url)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ) : null
                })}
            </div>
        );
    }
}