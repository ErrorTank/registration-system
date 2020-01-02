const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {transformData} = require("../utils/school-schedule");
const {importData, getSchoolScheduleItems, getInstructorSchedule} = require("../db/db-controllers/school-schedule-items")
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {

    router.post("/school-schedule/upload", authMiddleware ,(req, res, next) => {

        return transformData(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/school-schedule/import", authMiddleware ,(req, res, next) => {

        return importData(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/school-schedule/all", authMiddleware ,(req, res, next) => {

        return getSchoolScheduleItems({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/school-schedule/instructor-schedule/:instructorID", authMiddleware ,(req, res, next) => {

        return getInstructorSchedule(req.params.instructorID, {...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};