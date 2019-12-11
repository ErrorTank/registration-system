const jwt = require("jsonwebtoken");
import {errors} from "../utils/error/error-types";

const {JWTError, AuthorizationError} = errors;

const decodeAuthRequest = (req, secret, config) => {
  return new Promise((resolve, reject) => {
    let authHeader = req.headers.authorization;

    if (!authHeader || authHeader.replace(/^Bearer /, '') === 'null'){

      reject();
    }else{
      let token = authHeader.replace(/^Bearer /, '');
      verifyToken(token, secret, config).then((user) => {
        resolve(user);
      }).catch(err => {
        reject(err);
      })
    }
  })
};



const createAuthToken = (userInfo, secret, config) =>{
  return new Promise((resolve, reject) => {
    jwt.sign(userInfo, secret, config, (err, token) => {
      if(err){
        console.log(err);
        reject(new JWTError("Fail to generate token"));
      }else{
        resolve(token);
      }
    });
  })
};

const verifyToken = (token, secret, config) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, config,  (err, data) => {
      if(err){
        console.log(err);
        reject(err);
      }else{
        resolve(data);
      }
    })
  });
};

const authorization = (secret, config) => {
  return (req, res, next) => {

    decodeAuthRequest(req, secret, config)
      .then((user) => {

        if (!user) {
          next(new AuthorizationError("require_login"));
        } else {
          req.user = user;
          next();
        }
      }).catch(err => {

        next(new AuthorizationError("require_login"))
    })
  }
};

export const authServices = {
  authorization,
  decodeAuthRequest,
  verifyToken,
  createAuthToken
};
