const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isNil = require("lodash/isNil");
const {isActive, getEventStatus} = require("../../utils/registration-event");

const createRegistrationEvent = (data) => {
    return RegistrationEvent.findOne({
        studentGroup: Number(data.studentGroup),
        semester: Number(data.semester),
        "year.from": Number(data.year.from),
        "year.to": Number(data.year.to),
    }).then(re => {
        if (re) {
            return Promise.reject(new ApplicationError("existed"));
        }
        return new RegistrationEvent({
            ...data
        }).save();
    });
};

const getAll = ({year, studentGroup, semester}) => {
    let pipeline = [];
    if (year) {
        let [from, to] = year.split("-");
        pipeline.push({
            $match: {
                $and: [
                    {"year.from": Number(from)},
                    {"year.to": Number(to)}
                ]
            }
        });
    }
    if (studentGroup) {
        pipeline.push({
            $match: {
                studentGroup: Number(studentGroup)
            }

        });
    }
    if (semester) {
        pipeline.push({
            $match: {
                semester: Number(semester)
            }

        });
    }

    let action = pipeline.length ? RegistrationEvent.aggregate(pipeline) : RegistrationEvent.find({}).lean();

    return action.then(data => {
        let currentDate = new Date().getTime();
        return data.map(each => omit({
            ...each,
            isActive: isActive(each, currentDate),
            childEventsCount: each.childEvents.length
        }, ["childEvents"]));
    });
};

const getRegisterEventById = (rID) => {
    return RegistrationEvent.findOne({_id: ObjectId(rID)}).lean().then(data => {
        let currentDate = new Date().getTime();
        return {
            ...data, childEvents: data.childEvents.map(each => ({
                ...each,
                status: getEventStatus(each, currentDate)
            }))
        }
    })
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
        if (re) {
            return Promise.reject(new ApplicationError("existed"));
        }
        return RegistrationEvent.findOneAndUpdate({_id: ObjectId(rID)}, {$set: {...data}}, {new: true}).lean().then(data => {
            let currentDate = new Date().getTime();
            return {
                ...data, childEvents: data.childEvents.map(each => ({
                    ...each,
                    status: getEventStatus(each, currentDate)
                }))
            }
        });
    })
};
const deleteRegisterEvent = (rID) => {
    return RegistrationEvent.findOneAndDelete({_id: ObjectId(rID)})
};

const getActiveRegistrationEvent = () => {
    let currentDate = new Date();
    currentDate.setMilliseconds(0);
    currentDate.setSeconds(0);

    return RegistrationEvent.aggregate([
        {
            $addFields: {
                activeChildEvent: {
                    $filter: {
                        input: "$childEvents",
                        as: "child",
                        cond: {
                            $and: [
                                {$gt: ["$$child.to", currentDate]},
                                {$lt: ["$$child.from", currentDate]},
                                {active: true}
                            ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                activeChildEvent: {
                    $arrayElemAt: ["$activeChildEvent", 0]
                }
            }
        }
    ]).then(data => {
        return data.filter(each => each.activeChildEvent).map(each => ({...each, difference: new Date(each.activeChildEvent.to).getTime() - currentDate.getTime()}));
    })
};

module.exports = {
    createRegistrationEvent,
    getAll,
    getRegisterEventById,
    updateRegisterEvent,
    deleteRegisterEvent,
    getActiveRegistrationEvent
};