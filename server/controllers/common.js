const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const appDb = require("../config/db").getDbs().appDb;
const AppConfig = require("../db/model/app-config")(appDb);
const {getAvaiableSpecs} = require("../db/db-controllers/result");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.get("/app-config", authMiddleware ,(req, res, next) => {

        return AppConfig.find({}).then((data) => {
            return res.status(200).json(data[0]);
        }).catch(err => next(err));

    });




    return router;
};