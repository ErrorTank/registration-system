const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isNil = require("lodash/isNil");
const {isActive} = require("../../utils/registration-event");

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

const getAll = ({year, studentGroup, semester}) => {
    let pipeline = [];
    if(year){
        let [from, to] = year.split("-");
        pipeline.push({
            $match: {
                "year.from": Number(from),
                "year.to": Number(to)
            }
        });
    }
    if(studentGroup){
        pipeline.push({
            $match: {
                studentGroup: Number(studentGroup)
            }

        });
    }
    if(semester){
        pipeline.push({
            $match: {
                semester: Number(semester)
            }

        });
    }

    let action = pipeline.length ? RegistrationEvent.aggregate(pipeline) : RegistrationEvent.find({}).lean();

    return action.then(data => {
        return data.map(each => omit({...each, isActive: isActive(each), childEventsCount: each.childEvents.length}, ["childEvents"]));
    });
};

const getRegisterEventById = (rID) => {
    return RegistrationEvent.findOne({_id: ObjectId(rID)}).lean().then(data => ({...data, isActive: isActive(data)}))
};
const updateRegisterEvent = (rID, data) => {
    return RegistrationEvent.findOne({
        _id: {
            $ne: ObjectId(rID)
        },
        studentGroup: Number(data.studentGroup),
        semester: Number(data.semester),
        "year.from": Number(data.year.from),
        "year.to": Number(data.year.to),
    }).then((re) => {
        if(re){
            return Promise.reject(new ApplicationError("existed"));
        }
        return RegistrationEvent.findOneAndUpdate({_id: ObjectId(rID)}, {$set: {...data}}, {new: true}).lean();
    })
};
const deleteRegisterEvent = (rID) => {
    return RegistrationEvent.findOneAndDelete({_id: ObjectId(rID)})
};

module.exports = {
    createRegistrationEvent,
    getAll,
    getRegisterEventById,
    updateRegisterEvent,
    deleteRegisterEvent
};