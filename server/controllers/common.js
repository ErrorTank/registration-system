const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const appDb = require("../config/db").getDbs().appDb;
const AppConfig = require("../db/model/app-config")(appDb);
const DptInsInfo = require("../db/model/dpt-ins-info")(appDb);
const User = require("../db/model/user")(appDb);
const Division = require("../db/model/division")(appDb);
const StudentInfo = require("../db/model/student-info")(appDb);
const {getAvaiableSpecs} = require("../db/db-controllers/result");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const pick = require("lodash/pick");
const omit = require("lodash/omit");
const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = () => {
    router.get("/app-config", authMiddleware, (req, res, next) => {

        return AppConfig.find({}).then((data) => {
            return res.status(200).json(data[0]);
        }).catch(err => next(err));

    });
    router.get("/instructors/all", authMiddleware, (req, res, next) => {
        // console.log("cac")
        let {division, keyword} = req.query;
        let pipeline = [];
        console.log(division);
        if (division) {
            pipeline.push({
                $match: {
                    division: ObjectId(division)
                }

            });
        }

        pipeline = pipeline.concat([
            {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: "user"}},
            {$lookup: {from: 'divisions', localField: 'division', foreignField: '_id', as: "division"}},
            {
                $addFields: {
                    'user': {
                        $arrayElemAt: ["$user", 0]
                    },
                    'division': {
                        $arrayElemAt: ["$division", 0]
                    }
                }
            },
        ]);

        if (keyword) {
            pipeline.push({
                $match: {
                    $or: [
                        {"user.identityID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.email": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.phone": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    ]
                }
            });
        }

        return (pipeline.length > 3 ? DptInsInfo.aggregate(pipeline) : DptInsInfo.find({}).populate([
            {
                path: "user",
                model: "User"
            },{
                path: "division",
                model: "Division"
            },
        ])).then((data) => {


            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/instructors/all", authMiddleware, (req, res, next) => {
        // console.log("cac")
        let {division, keyword} = req.query;
        let pipeline = [];
        console.log(division);
        if (division) {
            pipeline.push({
                $match: {
                    division: ObjectId(division)
                }

            });
        }

        pipeline = pipeline.concat([
            {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: "user"}},
            {$lookup: {from: 'divisions', localField: 'division', foreignField: '_id', as: "division"}},
            {
                $addFields: {
                    'user': {
                        $arrayElemAt: ["$user", 0]
                    },
                    'division': {
                        $arrayElemAt: ["$division", 0]
                    }
                }
            },
        ]);

        if (keyword) {
            pipeline.push({
                $match: {
                    $or: [
                        {"user.identityID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.email": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                        {"user.phone": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    ]
                }
            });
        }

        return (pipeline.length > 3 ? DptInsInfo.aggregate(pipeline) : DptInsInfo.find({}).populate([
            {
                path: "user",
                model: "User"
            },{
                path: "division",
                model: "Division"
            },
        ])).then((data) => {


            return res.status(200).json(data);
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
    router.get("/division/all", authMiddleware, (req, res, next) => {

        return Division.find({}).lean().then((data) => {

            return res.status(200).json(data);
        }).catch(err => next(err));


    });

    return router;
};