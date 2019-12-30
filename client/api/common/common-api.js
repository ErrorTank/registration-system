
import {authenApi, offlineApi} from "../api";

export const commonApi = {
    getAppConfigInfo() {
        return authenApi.get("/app-config");
    },

};
