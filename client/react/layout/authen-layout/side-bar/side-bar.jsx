import React from "react";
import {navItems} from "./nav-items";
import classnames from "classnames"
import {customHistory} from "../../../routes/routes";

export class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {location} = customHistory;

        return (
            <div className="side-bar">
                {navItems.map(item => (
                    <div className={classnames("side-bar-item", {active: item.url ? location.pathname.indexOf(item.url) > -1 : false})}
                         key={item.url}
                         onClick={() => customHistory.push(item.url)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        );
    }
}