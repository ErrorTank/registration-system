import {authenApi, offlineApi} from "../api";
import {urlUtils} from "../../common/utils/url-utils";
import {userInfo} from "../../common/states/common";

export const eduProgramApi = {

    getEduProgram(config) {
        let {filter} = config;
        let {speciality} = filter || {};
        const params = {

            speciality: speciality ? speciality._id : null
        };
        return authenApi.get(`/edu-program${urlUtils.buildParams(params)}`)
    }
};
