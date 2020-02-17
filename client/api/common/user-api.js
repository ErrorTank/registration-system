
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
        return authenApi.get(`/account/all${urlUtils.buildParams(params)}`)
    },
    getUserDetails(accountID){
        return authenApi.get(`/account/${accountID}/details`)
    }
};
