import React from "react";
import {Sidebar} from "./side-bar/side-bar";
import {Navbar} from "./nav-bar/nav-bar";

export class AuthenLayout extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        return(
            <div className="authen-layout">
                <Navbar/>
                <Sidebar/>
                <div className="main-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}