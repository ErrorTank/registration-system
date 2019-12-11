import React from "react";
import { userInfo} from "../../../common/states/common";
import {KComponent} from "../../common/k-component";
import {customHistory} from "../routes";

export class AuthenCheck extends KComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.onUnmount(userInfo.onChange((newState, oldState) => {
            if (!newState || !oldState) {
                customHistory.push("/");
            }


        }))
    };

    render() {
        return this.props.children
    }
}