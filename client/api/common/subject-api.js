
import {authenApi, offlineApi} from "../api";
import {userInfo} from "../../common/states/common";
import {urlUtils} from "../../common/utils/url-utils";

export const subjectApi = {
    getAll() {
        return authenApi.get("/specialities");
    },
    getAllSubjects(config){
        let {filter} = config;
        let {keyword, division, credit, coefficient} = filter || {};
        const params = {
            keyword: keyword || null,
            division: division.value === "" ? null : division.value,
            credit: credit.value === "" ? null : credit.value,
            coefficient: coefficient.value === "" ? null : coefficient.value,
        };
        return authenApi.get(`/subjects/all${urlUtils.buildParams(params)}`)
    }
};
