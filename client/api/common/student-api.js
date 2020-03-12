
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const studentApi = {
    getStudentsBySchoolScheduleItem(item) {
        return authenApi.get("/students/school-schedule-item/" + item._id);
    },
    getStudentByCredits(filter, semester, year){
        return authenApi.get(`/students/credit/${filter}/semester/${semester}/year/${year.from}-${year.to}`);
    },
    getAllStudents(config){
        let {filter} = config;
        let {keyword, englishLevel, active, schoolYear, speciality,} = filter || {};
        const params = {
            keyword: keyword || null,
            englishLevel: englishLevel.value === "" ? null : englishLevel.value,
            schoolYear: schoolYear.value === "" ? null : schoolYear.value,
            speciality: speciality.value === "" ? null : speciality.value,
            active:  active.value === "" ? null : active.value,

        };
        return authenApi.get(`/students/all${urlUtils.buildParams(params)}`)
    }
};
