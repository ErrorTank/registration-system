const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {getAll} = require("../db/db-controllers/speciality");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {

    router.get("/specialities", authMiddleware ,(req, res, next) => {
        return getAll().then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });

    return router;
};