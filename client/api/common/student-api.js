
import {authenApi, offlineApi} from "../api";

export const studentApi = {
    getStudentsBySchoolScheduleItem(item) {
        return authenApi.get("/students/school-schedule-item/" + item._id);
    },

};
