import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";


export const schoolScheduleApi = {
    uploadScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/upload", data);
    },
    importScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/import", data);
    },
    getSchoolScheduleItems(config) {
        let {filter} = config;
        let {keyword, year, studentGroup, semester, state, status} = filter || {};
        const params = {
            keyword: keyword || null,
            year: year.value === "" ? null : year.value,
            studentGroup: studentGroup.value === "" ? null : studentGroup.value,
            semester: semester.value === "" ? null : semester.value,
            state: state ? state.value === "" ? null : state.value : null,
            status: status ? status.value === "" ? null : status.value : null,
        };
        return authenApi.get(`/school-schedule/all${urlUtils.buildParams(params)}`)
    },
    getSubjectLessonsByScheduleItems(items){
        return authenApi.post(`/school-schedule/lessons`, items)
    },
    getInstructorSchedule(config){
        let info = userInfo.getState();
        let {filter} = config;
        let {year, semester} = filter || {};
        const params = {

            year: year.value === "" ? null : year.value,

            semester: semester.value === "" ? null : semester.value,
        };
        return authenApi.get(`/school-schedule/instructor-schedule/${info.info._id}${urlUtils.buildParams(params)}`)
    },
    getShiftsOverview(){
        return authenApi.get(`/shift/overview`)
    },
    disabledSchoolScheduleItems(ids){
        return authenApi.put(`/school-schedule/disable-items`, ids)
    },

};
