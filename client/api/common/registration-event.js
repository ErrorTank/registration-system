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
    deleteRegistrationEvent(rID, events){
        return authenApi.post(`/registration-event/${rID}/delete`, events)
    },
    updateRegistrationEvent(rID, data){
        return authenApi.put(`/registration-event/${rID}`, data)
    },
    getSubjectListForRegistration(){
        return authenApi.post(`/registration-event/subjects`, userInfo.getState())
    },
    getSubjectListForForceRegistration(student){
        return authenApi.post(`/registration-event/force-registration/subjects`, {student, forcer: userInfo.getState()})
    },
    getSubjectInfo(subjectID, year, semester){
        return authenApi.post(`/registration-event/semester/${semester}/year/${year}/subject-info`, subjectID)
    },
    getEventOverview(config){
        let {studentGroup} = config || {};
        const params = {
            studentGroup: studentGroup.value === "" ? null : studentGroup.value,

        };
        return authenApi.get(`/registration-event/overview${urlUtils.buildParams(params)}`)
    },
    getRegistrationEventFullOverview({semester, year}){
        return authenApi.get(`/registration-event/full-overview/semester/${semester}/year/${year.from}-${year.to}`)
    }
};
