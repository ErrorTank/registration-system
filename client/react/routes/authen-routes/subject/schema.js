import * as yup from "yup";

export const subjectSchema = yup.object().shape({
    subjectID: yup.string().required("Mã môn không được để trống"),
    name: yup.string().required("Tên môn không được để trống"),
    credits: yup.number().required("Tín chỉ không được để trống"),
    coefficient: yup.number().min(1, "Hệ số ít nhất phải bằng 1").required("Hệ số không được để trống"),
    subjectsRequired: yup.array(),
    creditsRequired:  yup.number(),
    division: yup.string().required("Bộ môn là bắt buộc"),
    classes: yup.array().min(1, "Môn học phải có ít nhất 1 lớp").of(yup.object().shape({
        name: yup.string().required("Tên lớp là bắt buộc"),
        capacity: yup.object().shape({
            min: yup.number().min(1, "Giới hạn tối thiểu phải lớn hơn 1"),
            max: yup.number().max(120, "Giới hạn tối đa phải nhỏ hơn 120").maxGtMin("Giới hạn tối đa phải lớn hơn tối thiểu")
        }).required("Giới hạn số lượng sv là bắt buộc")
    }))
});