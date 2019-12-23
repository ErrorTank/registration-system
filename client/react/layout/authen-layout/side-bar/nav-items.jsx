import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';

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
    }, {
        label: "Bảng điểm",
        url: "/bang-diem",
        icon: <AssignmentIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "TKB toàn trường",
        url: "/tkb-toan-truong",
        icon: <FormatListNumberedRtlIcon
            fontSize={"inherit"}
        />,
        roles: ["bm", "sv", "gv"]
    }, {
        label: "Chương trình học",
        url: "/chuong-trinh-hoc",
        icon: <DeveloperBoardIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }
];