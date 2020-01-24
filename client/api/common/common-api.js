
import {authenApi, offlineApi} from "../api";

export const commonApi = {
    getAppConfigInfo() {
        return authenApi.get("/app-config");
    },
    getBriefStudents(){
        return authenApi.get("/student/brief")
    }
};
