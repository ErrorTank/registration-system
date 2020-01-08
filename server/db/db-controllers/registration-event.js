const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const AppConfig = require("../model/app-config")(appDb);
const SchoolScheduleItems = require("../model/school-schedule-items")(appDb);
const Result = require("../model/result")(appDb);
const EducateProgram = require("../model/educate-program")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isNil = require("lodash/isNil");
const {isActive, getEventStatus, getStudentGroup} = require("../../utils/registration-event");


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
        if (existed.length) {
            for (let event of existed) {
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
    let existed = registrationCountdownService.getExistedEventsByIds(events.map(each => each._id.toString()));
    if (existed.length) {
        for (let event of existed) {
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
            return data.filter(each => each.activeChildEvent).map(each => ({
                ...each,
                difference: new Date(each.activeChildEvent.to).getTime() - currentDate.getTime()
            }));
        })
    })
};

const getSubjectsForRegistration = ({info}) => {
    let currentDate = new Date();

    return AppConfig.find({}).lean().then(configs => {
        let config = configs[0];
        let {currentSemester, currentYear, latestSchoolYear} = config;
        let studentGroup = getStudentGroup(info.schoolYear, info.speciality.department, latestSchoolYear);
        return RegistrationEvent.findOne({
            studentGroup,
            semester: Number(currentSemester),
            "year.from": Number(currentYear.from),
            "year.to": Number(currentYear.to),
        }).lean().then(event => {
            console.log(event)
            if (!event) {
                return Promise.reject(new ApplicationError("Bạn chưa thuộc đối tượng được đăng ký học kì này!"));
            }
            for (let e of event.childEvents) {
                let fromDate = new Date(e.from);
                let toDate = new Date(e.to);
                let differenceFrom = fromDate.getTime() - currentDate.getTime();
                let differenceTo = toDate.getTime() - currentDate.getTime();
                console.log(currentDate)
                console.log(fromDate)
                console.log(toDate)
                console.log(differenceFrom)
                console.log(differenceTo)
                if (fromDate - currentDate > 0 && fromDate - currentDate <= Number(e.delay)) {
                    return {delayEvent: {...event, activeChildEvent: e}};
                }
                if (getEventStatus(e, currentDate, config, event).value === 0) {
                    return [
                        EducateProgram.findOne({
                            speciality: ObjectId(info.speciality._id)
                        }).populate("subjects"),
                        Result.findOne({
                            speciality: ObjectId(info.speciality._id),
                            owner: ObjectId(info._id)
                        }).populate("results.subject")
                    ];

                }
            }

            return Promise.reject(new ApplicationError("Bạn chưa thuộc đối tượng được đăng ký học kì này!"));
        })
            .then(([program, result]) => {
                let subjects = program.subjects;
                let passedSubjects = result.results.filter(each => each.grade > -1);
                let passedSubjects2 = passedSubjects.filter(each => each.grade >= 5);
                console.log(typeof subjects)
                return SchoolScheduleItems.aggregate([
                    {
                        $match: {
                            $and: [
                                {"year.from": Number(currentYear.from)},
                                {"year.to": Number(currentYear.to)},
                                {semester: Number(currentSemester)},
                                {studentGroup}
                            ],
                        }
                    },
                    {$lookup: {from: 'classes', localField: 'class', foreignField: '_id', as: "class"}},
                    {
                        $addFields: {
                            'class': {
                                $arrayElemAt: ["$class", 0]
                            },

                        }
                    },

                    {
                        $match: {
                            $and: [
                                {
                                    "class.subject": {
                                        "$in": subjects.map(each => ObjectId(each._id))
                                    }
                                },{
                                    "class.subject": {
                                        "$nin": passedSubjects.map(each => ObjectId(each.subject._id))
                                    }
                                },
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'subjects',
                            localField: 'class.subject',
                            foreignField: '_id',
                            as: "class.subject"
                        }
                    },
                    {
                        $addFields: {
                            'class.subject': {
                                $arrayElemAt: ["$class.subject", 0]
                            }
                        }
                    },
                ])
            })
    })

};

module.exports = {
    createRegistrationEvent,
    getAll,
    getRegisterEventById,
    updateRegisterEvent,
    deleteRegisterEvent,
    getActiveRegistrationEvent,
    getSubjectsForRegistration
};