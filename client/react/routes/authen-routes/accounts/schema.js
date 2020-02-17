import * as yup from "yup";

const schemas = {
   "account": {
       schema: yup.object().shape({
           username: yup.string().required("Tên đăng nhập không được để trống"),
           password: yup.string().min(4, "Mật khẩu phải nhiều hơn 3 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt"),
           role: yup.string().oneOf(["admin", "pdt", "bm", "gv", "sv"]),
           name: yup
               .string()
               .min(4, "Họ và tên phải lớn hơn 3 kí tự")
               .max(50, "Họ và tên phải nhỏ hơn 50 kí tự")
               .onlyWord("Họ và tên không được có kí tự đặc biệt")
               .notHaveNumber("Họ và tên không được có chữ số")
               .required("Họ tên không được để trống"),
           phone: yup.string().required("SĐT không được để trống").isPhone("SĐT không hợp lệ"),
           email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
       }),
       getInitData: () => {
            return {
                username: "",
                password: "",
                role: "admin",
                name: "",
                phone: "",
                email: ""
            }

       }
   }
};


export const getAccountFormStructure = (type) => {
    return schemas[type]
};