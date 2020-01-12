const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {getStudentSchedule, toggleRegisterLesson} = require("../db/db-controllers/schedule")
const {getSubjectsForRegistration} = require("../db/db-controllers/registration-event")
const {transformResults} = require("../utils/result");
const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = (db, namespacesIO) => {

    router.put("/schedule/student/:studentID/semester/:semester/year/:year/toggle-register", authMiddleware ,(req, res, next) => {

        return toggleRegisterLesson(req.params, req.body).then((data) => {
            namespacesIO.registrationTracker.emit("update-subject-list", req.params);
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/schedule/student/:studentID/semester/:semester/year/:year", authMiddleware ,(req, res, next) => {

        return getStudentSchedule(req.params).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });


    return router;
};