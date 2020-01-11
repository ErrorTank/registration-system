
import {authenApi, offlineApi} from "../api";

export const scheduleApi = {
    getStudentSchedule(studentID, year, semester) {
        return authenApi.get(`/schedule/student/${studentID}/semester/${semester}/year/${year}`);
    },
    toggleRegisterLesson(studentID, year, semester, lesson){
        return authenApi.put(`/schedule/student/${studentID}/semester/${semester}/year/${year}/toggle-register`, lesson)
    }
};
