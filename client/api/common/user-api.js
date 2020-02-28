
import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";

export const userApi = {
    getInfo() {
        return authenApi.get("/auth");
    },
    login(info){
        return offlineApi.post("/login", info);
    },
    sendForgotPasswordEmail(identity){
        return offlineApi.post("/forgot-password", identity)
    },
    getAccounts(config){
        let {filter} = config;
        let {keyword, accountType} = filter || {};
        const params = {
            keyword: keyword || null,
            accountType: accountType.value === "" ? null : accountType.value,
        };
        return authenApi.get(`/user/all${urlUtils.buildParams(params)}`)
    },
    getUserDetails(accountID){
        return authenApi.get(`/user/${accountID}`)
    },
    updateUserInfo(accountID ,data){
        return authenApi.put(`/user/${accountID}`, data)
    },
    deleteAccount(accountID){
        return authenApi.delete(`/account/${accountID}`)
    },
    createNewUser(data){
        return authenApi.post(`/account/new`, data)
    }
};
