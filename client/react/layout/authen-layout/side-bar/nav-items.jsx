import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import CreateIcon from '@material-ui/icons/Create';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DoneAllIcon from '@material-ui/icons/DoneAll';

export const navItems = [
    {
        label: "Trang chủ",
        url: "/",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "Trang chủ quản lý",
        url: "/manage",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["admin", "pdt"]
    },{
        label: "Trang chủ giảng viên",
        url: "/giao-vien",
        icon: <HomeIcon
            fontSize={"inherit"}
        />,
        roles: ["gv"]
    },{
        label: "Lịch giảng dạy",
        url: "/giao-vien/lich-giang-day",
        icon: <AccessTimeIcon
            fontSize={"inherit"}
        />,
        roles: ["gv"]
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
        label: "Đăng ký học",
        url: "/dang-ky-hoc",
        icon: <DoneAllIcon
            fontSize={"inherit"}
        />,
        roles: ["sv"]
    }, {
        label: "TKB toàn trường",
        url: "/tkb-toan-truong",
        icon: <FormatListNumberedRtlIcon
            fontSize={"inherit"}
        />,
        roles: ["bm", "sv", "gv", "admin"],
        // disabled: true
    }, {
        label: "Chương trình đào tạo",
        url: "/chuong-trinh-dao-tao",
        icon: <DeveloperBoardIcon
            fontSize={"inherit"}
        />,
        roles: ["sv", "gv"],
        // disabled: true
    },{
        label: "Quản lý đợt đăng ký",
        url: ["/manage/registration-events", "/manage/registration-event/new", /\/manage\/registration-event\/(\w+)\/edit/gi],
        icon: <CreateIcon
            fontSize={"inherit"}
        />,
        roles: ["admin", "pdt"],
        defaultUrl: "/manage/registration-events"
    }
];