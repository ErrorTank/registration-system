const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const AppConfig = require("../model/app-config")(appDb);
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

    return AppConfig.find({}).lean().then((config) => {
        return action.then(data => {
            let currentDate = new Date().getTime();
            return data.map(each => omit({
                ...each,
                isActive: isActive(each, currentDate, config[0]),
                childEventsCount: each.childEvents.length
            }, ["childEvents"]));
        });
    })
};

const getRegisterEventById = (rID) => {
    return AppConfig.find({}).lean().then(config => {
        return RegistrationEvent.findOne({_id: ObjectId(rID)}).lean().then(data => {
            let currentDate = new Date().getTime();

            return {
                ...data,
                childEvents: data.childEvents.map(each => ({
                    ...each,
                    status: getEventStatus(each, currentDate, config[0], data),

                })),
                isActive: isActive(data, currentDate, config[0]),
            }
        })
    })
};
const updateRegisterEvent = (rID, {data, oldEvents}) => {
    const registrationCountdownService = require("../../utils/background-service/common/registration-countdown-service");
    console.log(registrationCountdownService)
    return AppConfig.find({}).lean().then(config => {
        let currentDate = new Date().getTime();
        // let isDataActive = isActive(data, currentDate, config[0]);
        console.log(registrationCountdownService)
        let existed = registrationCountdownService.getExistedEventsByIds(oldEvents.map(each => each._id.toString()));
        if(existed.length){
            for(let event of existed){
                registrationCountdownService.terminate(event.event._id)
            }

        }
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

                return {
                    ...data,
                    isActive: isActive(data, currentDate, config[0]),
                    childEvents: data.childEvents.map(each => ({
                        ...each,
                        status: getEventStatus(each, currentDate, config[0], data)
                    }))
                }
            });
        })
    })
};
const deleteRegisterEvent = (rID, {events}) => {
    const registrationCountdownService = require("../../utils/background-service/common/registration-countdown-service");
    console.log(registrationCountdownService)
    let existed = registrationCountdownService.getExistedEventsByIds(events.map(each =>  each._id.toString()));
    if(existed.length){
        for(let event of existed){
            registrationCountdownService.terminate(event.event._id)
        }

    }
    return RegistrationEvent.findOneAndDelete({_id: ObjectId(rID)})
};

const getActiveRegistrationEvent = () => {
    let currentDate = new Date();

    return AppConfig.find({}).lean().then((configs) => {
        let config = configs[0];
        let {currentSemester, currentYear} = config;
        return RegistrationEvent.aggregate([
            {
                $match: {
                    $and: [
                        {"year.from": Number(currentYear.from)},
                        {"year.to": Number(currentYear.to)},
                        {semester: Number(currentSemester)}
                    ],

                }
            },
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