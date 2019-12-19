import React from "react";
import {customHistory} from "../../routes/routes";
import {buildBreadcrumbsArray} from "./breadcrumbs-structure";



export class Breadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {location} = customHistory;
        console.log(location)
        let arr = buildBreadcrumbsArray(location.pathname);
        console.log(arr)
        return (
            <div className="breadcrumbs-container">
                {arr.length > 1 && (
                    <div className="breadcrumbs">
                        {arr.map((each) => (
                            <div className={"breadcrumbs__item"}
                                 key={each.url}
                                 onClick={() => customHistory.push(each.url)}
                            >
                                {each.label}
                            </div>
                        ))}
                    </div>
                )}
                {this.props.children}
            </div>
        );
    }
}