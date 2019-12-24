const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getEducateProgram, getAll} = require("../db/db-controllers/edu-program");
const {getAvaiableSpecs} = require("../db/db-controllers/result")
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.get("/edu-programs", authMiddleware ,(req, res, next) => {

        return getAll({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    router.get("/edu-program", authMiddleware ,(req, res, next) => {

        return getEducateProgram({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });


    return router;
};