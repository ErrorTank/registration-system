import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";

export const registrationEventApi = {
    create(data){
        return authenApi.post("/registration-event/create", data)
    },
    getAll(config) {
        let {filter} = config;
        let {year, studentGroup, semester} = filter || {};
        const params = {
            year: year.value === "" ? null : year.value,
            studentGroup: studentGroup.value === "" ? null : studentGroup.value,
            semester: semester.value === "" ? null : semester.value,
        };
        return authenApi.get(`/registration-event/all${urlUtils.buildParams(params)}`)
    },
    getRegistrationEventById(rID){
        return authenApi.get(`/registration-event/${rID}`)
    },
    deleteRegistrationEvent(rID){
        return authenApi.delete(`/registration-event/${rID}`)
    },
    updateRegistrationEvent(rID, data){
        return authenApi.put(`/registration-event/${rID}`, data)
    }
};
