import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";
import isNil from "lodash/isNil";

export const registrationEventApi = {
    create(data){
        return authenApi.post("/registration-event/create", data)
    },
    getAll(config) {
        let {filter} = config;
        let {year, studentGroup, semester} = filter || {};
        const params = {
            year: isNil(year.value) ? null : year.value,
            studentGroup: isNil(studentGroup.value) ? null : studentGroup.value,
            semester: isNil(semester.value) ? null : semester.value,
        };
        return authenApi.get(`/registration-event/all${urlUtils.buildParams(params)}`)
    }
};
