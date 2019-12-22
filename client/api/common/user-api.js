
import {authenApi, offlineApi} from "../api";

export const userApi = {
    getInfo() {
        return authenApi.get("/auth");
    },
    login(info){
        return offlineApi.post("/login", info);
    },
    sendForgotPasswordEmail(identity){
        return offlineApi.post("/forgot-password", identity)
    }
};
