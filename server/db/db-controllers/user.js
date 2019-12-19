
const User = require("../model/user")(require("../../config/db").appDb);

const CommonUserInfo = require("../model/common-user-info")(require("../../config/db").appDb);
const DptInsInfo = require("../model/dpt-ins-info")(require("../../config/db").appDb);
const StudentInfo = require("../model/student-info")(require("../../config/db").appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");
const getUserEntity = role => {
    return ({
        "admin": CommonUserInfo, "pdt": CommonUserInfo, "bm": DptInsInfo, "gv": DptInsInfo, "sv": StudentInfo
    })[role]
};
const regularLogin = ({username, password}) => {
    return User.findOne( {username}).lean()
        .then(data => {
            console.log(data)
            if (!data) {

                return Promise.reject(new ApplicationError("not_existed"))
            }
            if (data.password !== password)
                return Promise.reject(new ApplicationError("password_wrong"));
            return data;

        })
        .then((data) =>
            Promise.all([createAuthToken(pick(data, ["_id", "username", "name", "role"]), getPrivateKey(), {
                expiresIn: "1d",
                algorithm: "RS256"
            }), getUserEntity(data.role).findOne({user: ObjectId(data._id)})])
                .then(([token, info]) => ({
                    token,
                    user: {...omit(data, ["password"]), info},
                }))
                .catch(err => Promise.reject(err))
        )
        .catch(err => {
            return Promise.reject(err)
        })
};
const getAuthUserInfo = userID => {

    return User.findOne({_id: mongoose.Types.ObjectId(userID)}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("not_existed"))
            }
            if (data.password !== data.password)
                return Promise.reject(new ApplicationError("password_wrong"));
            return data;

        })
        .then(data => {
            return getUserEntity(data.role).findOne({user: data._id}).then((info) => ({
                ...data, info
            }))
        })
        .then((user) =>
            ({
                user: omit(user, ["password"]),
            })
        )
        .catch(err => {

            return Promise.reject(err)
        })
};


module.exports = {
    regularLogin,
    getAuthUserInfo,

}