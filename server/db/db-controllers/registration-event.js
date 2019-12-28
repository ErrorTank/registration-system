const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const createRegistrationEvent = (data) => {
    return RegistrationEvent.findOne({
        studentGroup: Number(data.studentGroup),
        semester: Number(data.semester),
        "year.from": Number(data.year.from),
        "year.to": Number(data.year.to),
    }).then(re => {
        if(re){
            return Promise.reject(new ApplicationError("existed"));
        }
        return new RegistrationEvent({
            ...data
        }).save();
    });
};

const getAll = () => {
    return RegistrationEvent.find({}).populate("speciality")
};


module.exports = {
    createRegistrationEvent,
    getAll
}