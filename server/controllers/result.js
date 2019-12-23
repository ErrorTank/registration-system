const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");
const {importData, getResultByStudentId} = require("../db/db-controllers/result")
const {transformResults} = require("../utils/result");
const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {

    router.post("/result/upload", authMiddleware ,(req, res, next) => {

        return transformResults(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/result/import", authMiddleware ,(req, res, next) => {

        return importData(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/result/student/:studentID", authMiddleware ,(req, res, next) => {

        return getResultByStudentId(req.params.studentID, {...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });


    return router;
};