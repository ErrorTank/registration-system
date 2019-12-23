import {createApiCache} from "./api-cache";
import {specialityApi} from "../../../api/common/speciality-api";


export const specialitiesCache = createApiCache(() => specialityApi.getAll().then((specialities) => {
  return specialities;
}));

