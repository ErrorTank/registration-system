const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getStudentsBySchoolScheduleItem, getStudentsByCredit, getAllStudents} = require("../db/db-controllers/student");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.get("/students/school-schedule-item/:itemID", authMiddleware ,(req, res, next) => {
        return getStudentsBySchoolScheduleItem(req.params.itemID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/students/credit/:credit/semester/:semester/year/:year", authMiddleware ,(req, res, next) => {
        return getStudentsByCredit(req.params).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/students/all", authMiddleware ,(req, res, next) => {
        return getAllStudents(req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};