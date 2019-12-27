import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';

export const navItems = [
    {
        label: "Trang chủ",
        url: "/",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["bm", "sv", "gv"]
    }, {
        label: "Trang chủ quản lý",
        url: "/manage",
        icon: <PublishIcon fontSize={"inherit"}/>,
        roles: ["admin", "pdt"]
    },{
        label: "Import dữ liệu",
        url: "/manage/import",
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
        roles: ["bm", "sv", "gv"],
        // disabled: true
    }, {
        label: "Chương trình đào tạo",
        url: "/chuong-trinh-dao-tao",
        icon: <DeveloperBoardIcon
            fontSize={"inherit"}
        />,
        roles: ["sv", "gv"],
        // disabled: true
    }
];