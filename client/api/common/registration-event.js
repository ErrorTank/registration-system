import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";

export const registrationEventApi = {
    create(data){
        return authenApi.post("/registration-event/create", data)
    },
    getStudentResult(config) {
        let {filter} = config;
        let {speciality} = filter || {};
        const params = {

            speciality: speciality ? speciality._id : null
        };
        return authenApi.get(`/result/student/${userInfo.getState()._id}${urlUtils.buildParams(params)}`)
    }
};
