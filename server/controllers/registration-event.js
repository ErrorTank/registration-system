const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {transformData} = require("../utils/school-schedule");
const {createRegistrationEvent, getAll} = require("../db/db-controllers/registration-event")
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {


    router.post("/registration-event/create", authMiddleware ,(req, res, next) => {

        return createRegistrationEvent(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/registration-event/all", authMiddleware ,(req, res, next) => {

        return getAll({...req.query}).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};