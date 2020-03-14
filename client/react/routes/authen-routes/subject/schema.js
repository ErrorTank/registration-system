import * as yup from "yup";

export const subjectSchema = yup.object().shape({
    subjectID: yup.string().required("Mã môn không được để trống"),
    name: yup.string().required("Tên môn không được để trống"),
    credits: yup.number().required("Tín chỉ không được để trống"),
    coefficient: yup.number().min(1, "Hệ số ít nhất phải bằng 1").required("Hệ số không được để trống"),
    subjectsRequired: yup.array(),
    creditsRequired:  yup.number(),
    division: yup.string().required("Bộ môn là bắt buộc"),
    classes: yup.array()
});