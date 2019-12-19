const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {regularLogin, getAuthUserInfo} = require("../db/db-controllers/user");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.post("/login", (req, res, next) => {
        return regularLogin({...req.body}).then((data) => {
            console.log(data)
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/auth", authMiddleware ,(req, res, next) => {
        return getAuthUserInfo(req.user._id).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};