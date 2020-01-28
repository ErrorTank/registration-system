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
            if(req.body.socketID){
                console.log("to room ", req.body.eventID)
                namespacesIO.registrationTracker.to(req.body.eventID).emit("update-subject-list", {eventID: req.body.eventID, socketID: req.body.socketID, subject: req.body.subject});
            }

            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/schedule/student/:studentID/semester/:semester/year/:year", authMiddleware ,(req, res, next) => {

        return getStudentSchedule(req.params, req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });


    return router;
};