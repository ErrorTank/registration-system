
import {authenApi, offlineApi} from "../api";

export const resultApi = {
    uploadResult(data) {
        return authenApi.post("/result/upload", data);
    },
    importResult(data){
        return authenApi.post("/result/import", data);
    }
};
