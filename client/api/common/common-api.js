
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const commonApi = {
    getAppConfigInfo() {
        return authenApi.get("/app-config");
    },
    getBriefStudents(){
        return authenApi.get("/student/brief")
    },
    getDivisions(){
        return authenApi.get("/division/all")
    },
    getAllInstructors(config){
        let {filter} = config;
        let {keyword, division} = filter || {};
        const params = {
            keyword: keyword || null,
            division: division.value === "" ? null : division.value
        };
        return authenApi.get(`/instructors/all${urlUtils.buildParams(params)}`)
    },


};
