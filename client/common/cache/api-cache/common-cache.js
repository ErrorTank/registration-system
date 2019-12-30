import {createApiCache} from "./api-cache";
import {specialityApi} from "../../../api/common/speciality-api";
import {commonApi} from "../../../api/common/common-api";


export const specialitiesCache = createApiCache(() => specialityApi.getAll().then((specialities) => {
  return specialities;
}));

export const appConfigCache = createApiCache(() => commonApi.getAppConfigInfo().then((specialities) => {
  return specialities;
}));

