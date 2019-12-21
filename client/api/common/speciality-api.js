
import {authenApi, offlineApi} from "../api";

export const specialityApi = {
    getAll() {
        return authenApi.get("/specialities");
    },

};
