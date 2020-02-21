const express = require('express');
const router = express.Router();
const {authorization, createAuthToken} = require("../authorization/auth");
const {regularLogin, getAuthUserInfo, getAllAccounts, getUserDetails, updateUser, deleteAccount} = require("../db/db-controllers/user");
const {getPublicKey, getPrivateKey} = require("../authorization/keys/keys");

const authMiddleware = authorization(getPublicKey(), {expiresIn: "1 day", algorithm: ["RS256"]});

module.exports = () => {
    router.post("/login", (req, res, next) => {
        console.log(req.body)

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
    router.get("/user/all", authMiddleware ,(req, res, next) => {
        return getAllAccounts(req.query).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.put("/user/:accountID", authMiddleware ,(req, res, next) => {
        return updateUser(req.params.accountID, req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/user/:accountID", authMiddleware ,(req, res, next) => {
        return getUserDetails(req.params.accountID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.delete("/account/:accountID", authMiddleware ,(req, res, next) => {
        return deleteAccount(req.params.accountID).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};