import React from "react";
import {Sidebar} from "./side-bar/side-bar";
import {Navbar} from "./nav-bar/nav-bar";
import {Breadcrumbs} from "../../common/breadcrumbs/breadcrumbs";


export class AuthenLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div className="authen-layout">
                <Navbar/>
                <Sidebar/>
                <div className="main-content">

                    <Breadcrumbs>
                        <div className="main-content__header">
                            <p className="authen-route-title">{this.props.title}</p>
                        </div>
                        <div className="main-content__body">
                            {this.props.children}
                        </div>

                    </Breadcrumbs>
                </div>
            </div>
        );
    }
}