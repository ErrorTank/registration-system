const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {transformData} = require("../utils/school-schedule");
const {importData, getSchoolScheduleItems, getInstructorSchedule, getShiftsOverview, getLessonsByItems, disabledSchoolScheduleItems, getSchoolScheduleItemsByDivision} = require("../db/db-controllers/school-schedule-items")
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
    router.post("/school-schedule/lessons", authMiddleware ,(req, res, next) => {

        return getLessonsByItems(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/school-schedule/division/:divisionID", authMiddleware ,(req, res, next) => {

        return getSchoolScheduleItemsByDivision(req.params.divisionID, req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/school-schedule/disable-items", authMiddleware ,(req, res, next) => {

        return disabledSchoolScheduleItems(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/shift/overview", authMiddleware ,(req, res, next) => {

        return getShiftsOverview({...req.query}).then((data) => {
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