const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getAllSubjects, getSubjectDetail} = require("../db/db-controllers/subject");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {

    router.get("/subjects/all", authMiddleware ,(req, res, next) => {
        return getAllSubjects(req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/subject/:subjectID", authMiddleware ,(req, res, next) => {
        return getSubjectDetail(req.params.subjectID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};