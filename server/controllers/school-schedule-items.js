const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {transformData} = require("../utils/school-schedule");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {

    router.post("/school-schedule/upload", authMiddleware ,(req, res, next) => {

        return transformData(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};