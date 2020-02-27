
import {authenApi, offlineApi} from "../api";

export const studentApi = {
    getStudentsBySchoolScheduleItem(item) {
        return authenApi.get("/students/school-schedule-item/" + item._id);
    },
    getStudentByCredits(filter, semester, year){
        return authenApi.get(`/students/credit/${filter}/semester/${semester}/year/${year}`);
    }
};
