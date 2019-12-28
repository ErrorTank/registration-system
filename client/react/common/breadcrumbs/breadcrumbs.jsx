import React from "react";
import {customHistory} from "../../routes/routes";
import {initBreadcrumb} from "./breadcrumbs-structure";

export class Breadcrumbs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {location} = customHistory;
        const buildBreadcrumbsArray = initBreadcrumb(this.props.type);
        let arr = buildBreadcrumbsArray(location.pathname);

        return (
            <div className="breadcrumbs-container">
                {arr.length > 1 && (
                    <div className="breadcrumbs">
                        {arr.map((each) => (
                            <div className={"breadcrumbs__item"}
                                 key={each.url}
                                 onClick={() => customHistory.push(each.url || window.location.href.replace(document.location.origin, ""))}
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