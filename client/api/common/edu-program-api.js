import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";

export const eduProgramApi = {
    getAll(){
        return authenApi.get(`/edu-programs`)
    },
    getEduProgram(config) {
        let {filter} = config;
        let {eduProgram} = filter || {};
        const params = {

            speciality: eduProgram ? eduProgram.speciality._id : null
        };
        return authenApi.get(`/edu-program${urlUtils.buildParams(params)}`)
    }
};
