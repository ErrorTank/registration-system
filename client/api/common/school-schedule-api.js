import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import isNil from "lodash/isNil"

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
            year: year || null,
            studentGroup: isNil(studentGroup) ? null : studentGroup.value,
            semester: isNil(semester) ? null : semester.value,
        };
        return authenApi.get(`/school-schedule/items${urlUtils.buildParams(params)}`)
    }

};
