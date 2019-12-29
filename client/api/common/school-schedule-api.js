import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";


export const schoolScheduleApi = {
    uploadScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/upload", data);
    },
    importScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/import", data);
    },
    getSchoolScheduleItems(config) {
        let {filter} = config;
        let {keyword, year, studentGroup, semester} = filter || {};
        const params = {
            keyword: keyword || null,
            year: year.value === "" ? null : year.value,
            studentGroup: studentGroup.value === "" ? null : studentGroup.value,
            semester: semester.value === "" ? null : semester.value,
        };
        return authenApi.get(`/school-schedule/all${urlUtils.buildParams(params)}`)
    }

};
