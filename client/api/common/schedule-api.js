
import {authenApi, offlineApi} from "../api";

export const scheduleApi = {
    getStudentSchedule(studentID, year, semester) {
        return authenApi.get(`/schedule/student/${studentID}/semester/${semester.value}/year/${year.value}`);
    },

};
