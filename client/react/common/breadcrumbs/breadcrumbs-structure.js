import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import omit from "lodash/omit"
import reverse from "lodash/reverse"

const structures = {
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
            url: "/import",
            label: <span className="label">Import</span>
        }
    ]
};

const buildingRecursive = (structure ,pathname, result) => {

    if(pathname === structure.url){
        result.push(omit(structure, ["childrens"]));
        return result;
    }
    for(let str of structure.childrens){
        result = buildingRecursive(str, pathname, result);
        if(result.length){
            result.push(omit(structure, ["childrens"]));
            return result;
        }
    }


};

const createBreadcrumbBuilder = (initStructure) => (pathname, result = []) => {
    let final = buildingRecursive(initStructure, pathname, result);
    return reverse(final);
};

export const buildBreadcrumbsArray = createBreadcrumbBuilder(structures);