
import {authenApi, offlineApi} from "../api";

export const schoolScheduleApi = {
    uploadScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/upload", data);
    },
    importScheduleAndEduProgram(data) {
        return authenApi.post("/school-schedule/import", data);
    }
};
