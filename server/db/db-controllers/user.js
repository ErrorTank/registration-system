import {userInfo} from "../../../client/common/states/common";

const appDb = require("../../config/db").getDbs().appDb;
const User = require("../model/user")(appDb);

const CommonUserInfo = require("../model/common-user-info")(appDb);
const DptInsInfo = require("../model/dpt-ins-info")(appDb);
const StudentInfo = require("../model/student-info")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");
const getUserEntity = role => {
    return ({
        "admin": {
            findOne: filter => CommonUserInfo.findOne(filter).lean()
        }, "pdt": {
            findOne: filter => CommonUserInfo.findOne(filter).lean()
        }, "bm": {
            findOne: filter => DptInsInfo.findOne(filter).populate("division").lean()
        }, "gv": {
            findOne: filter => DptInsInfo.findOne(filter).populate("division").lean()
        }, "sv": {
            findOne: filter => StudentInfo.findOne(filter).populate("speciality", "_id name shortName department").lean()
        }
    })[role]
};
const regularLogin = ({username, password}) => {
    return User.findOne({username: {$regex: new RegExp("^" + username.toLowerCase(), "i")}}).lean()
        .then(data => {
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
                .then(([token, info]) => {
                    let user = {
                        ...omit(data, ["password"]),
                        info
                    };

                    return {
                        token,
                        user,
                    }
                })
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

const getAllAccounts = (config) => {
    let {keyword, accountType} = config;
    let pipeline = [];
    if (accountType) {
        pipeline.push({
            $match: {
                role: accountType
            }

        });
    }


    if(keyword){
        pipeline.push({
            $match: {
                $or: [
                    {"identityID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"email": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"phone": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                ]
            }
        });
    }
    return pipeline.length ? User.aggregate(pipeline) : User.find({}).lean();
};

const getUserDetails = (accountID) => {
    return User.findOne({_id: ObjectId(accountID)}).lean()
        .then(user => {
            let matcher = {
                "pdt": () => {
                    return CommonUserInfo.findOne({user: ObjectId(user._id)}).lean()

                },
                "admin": () => {
                    return CommonUserInfo.findOne({user: ObjectId(user._id)}).lean()

                },
                "gv": () => {
                    return DptInsInfo.findOne({user: ObjectId(user._id)})

                },
                "sv": () => {
                    return StudentInfo.findOne({user: ObjectId(user._id)})

                },
            };
            return matcher[user.role]().then(info => ({
                ...user,
                info
            }))
        })
};


module.exports = {
    regularLogin,
    getAuthUserInfo,
    getAllAccounts,
    getUserDetails
}