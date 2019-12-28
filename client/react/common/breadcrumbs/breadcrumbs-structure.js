import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import omit from "lodash/omit"
import reverse from "lodash/reverse"

const structures = {
    "/": {
        url: "/",
        label: (
            <span>
            <HomeIcon
                fontSize={"inherit"}
            />
            <span className="label">Trang chủ</span>
        </span>
        ),
        childrens: [
           {
                url: "/bang-diem",
                label: <span className="label">Bảng điểm</span>
           },{
                url: "/chuong-trinh-dao-tao",
                label: <span className="label">CT đào tạo</span>
            },{
                url: "/tkb-toan-truong",
                label: <span className="label">TKB toàn trường</span>
            },
        ]
    },
    "/manage": {
        url: "/manage",
        label: (
            <span>
            <HomeIcon
                fontSize={"inherit"}
            />
            <span className="label">Trang chủ</span>
        </span>
        ),
        childrens: [
            {
                url: "/manage/import",
                label: <span className="label">Import</span>
            },
            {
                url: "/manage/registration-events",
                label: <span className="label">Đợt đăng ký học</span>,
                childrens: [
                    {
                        url: "/manage/registration-event/new",
                        label: <span className="label">Tạo mới</span>,
                    },{
                        regex: /\/manage\/registration-event\/(\w+)\/edit/gi,
                        label: <span className="label">Cập nhật</span>,
                    },

                ]
            },
        ]
    }
};

const buildingRecursive = (structure ,pathname, result) => {

    if(structure.regex && structure.regex.test(pathname)){
        result.push(omit(structure, ["childrens"]));
        return result;
    }
    else if(pathname === structure.url){
        result.push(omit(structure, ["childrens"]));
        return result;
    }
    if(structure.childrens){
        for(const str of structure.childrens){

            result = buildingRecursive(str, pathname, result);
            if(result.length){
                result.push(omit(structure, ["childrens"]));
                return result;
            }
        }
    }
    return result;


};

const createBreadcrumbBuilder = (initStructure) => (pathname, result = []) => {
    let final = buildingRecursive(initStructure, pathname, result);
    return reverse(final);
};

export const initBreadcrumb = i => createBreadcrumbBuilder(structures[i]);