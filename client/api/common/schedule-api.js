
import {authenApi, offlineApi} from "../api";

export const scheduleApi = {
    getStudentSchedule(studentID, year, semester, active = false) {
        return authenApi.get(`/schedule/student/${studentID}/semester/${semester}/year/${year}?active=${active}`);
    },
    toggleRegisterLesson(studentID, year, semester, data){
        return authenApi.put(`/schedule/student/${studentID}/semester/${semester}/year/${year}/toggle-register`, data)
    },

};
