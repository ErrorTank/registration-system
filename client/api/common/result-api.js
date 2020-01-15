import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";

export const resultApi = {
    uploadResult(data) {
        return authenApi.post("/result/upload", data);
    },
    importResult(data) {
        return authenApi.post("/result/import", data);
    },
    getStudentResult(config) {
        let {filter} = config;
        let {speciality} = filter || {};
        const params = {

            speciality: speciality ? speciality._id : null
        };
        return authenApi.get(`/result/student/${userInfo.getState().info._id}${urlUtils.buildParams(params)}`)
    }
};
