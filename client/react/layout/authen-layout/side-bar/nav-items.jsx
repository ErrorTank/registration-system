import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';

export const navItems = [
    {
        label: "Dashboard",
        url: "/",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["admin", "bm", "sv", "gv", "pdt"]
    }, {
        label: "Import dữ liệu",
        url: "/import",
        icon: <PublishIcon fontSize={"inherit"}/>,
        roles: ["admin", "pdt"]
    },
];