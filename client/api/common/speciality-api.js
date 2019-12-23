
import {authenApi, offlineApi} from "../api";
import {userInfo} from "../../common/states/common";

export const specialityApi = {
    getAll() {
        return authenApi.get("/specialities");
    },
    getStudentSpecs(){
        return authenApi.get(`/specialities/student/${userInfo.getState()._id}`)
    }
};
