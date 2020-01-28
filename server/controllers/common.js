const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const appDb = require("../config/db").getDbs().appDb;
const AppConfig = require("../db/model/app-config")(appDb);
const StudentInfo = require("../db/model/student-info")(appDb);
const {getAvaiableSpecs} = require("../db/db-controllers/result");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const pick = require("lodash/pick");
const omit = require("lodash/omit");
const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.get("/app-config", authMiddleware, (req, res, next) => {

        return AppConfig.find({}).then((data) => {
            return res.status(200).json(data[0]);
        }).catch(err => next(err));

    });

    router.get("/student/brief", authMiddleware, (req, res, next) => {

        return StudentInfo.find({active: true}).populate([
            {
                path: "user"
            },
            {
                path: "speciality"
            }
        ]).then((data) => {

            return res.status(200).json(data.map(each => {
                return {
                    ...omit(each.toObject().user, ["password"]),
                    info: omit(each.toObject(), "user")
                };
            }));
        }).catch(err => next(err));

    });


    return router;
};