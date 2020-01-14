const appDb = require("../../config/db").getDbs().appDb;
const RegistrationEvent = require("../model/registration-event")(appDb);
const AppConfig = require("../model/app-config")(appDb);
const SchoolScheduleItems = require("../model/school-schedule-items")(appDb);
const Result = require("../model/result")(appDb);
const Schedule = require("../model/schedule")(appDb);
const EducateProgram = require("../model/educate-program")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isNil = require("lodash/isNil");
const {isActive, getEventStatus, getStudentGroup} = require("../../utils/registration-event");
const {calculateTotalCredits} = require("../../utils/result");
const {transformSubjectLesson} = require("../../utils/registration-event");

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

    return AppConfig.find({}).lean().then(config => {
        let currentDate = new Date().getTime();
        // let isDataActive = isActive(data, currentDate, config[0]);

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

const getSubjectsForRegistration = ({info, _id}) => {
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
                // console.log(currentDate)
                // console.log(fromDate)
                // console.log(toDate)
                // console.log(differenceFrom)
                // console.log(differenceTo)
                if (fromDate - currentDate > 0 && fromDate - currentDate <= Number(e.delay)) {
                    return {delayEvent: {...event, activeChildEvent: e}};
                }
                if (getEventStatus(e, currentDate, config, event).value === 0) {

                    return Promise.all(
                        [
                            EducateProgram.findOne({
                                speciality: ObjectId(info.speciality._id)
                            }).populate("subjects"),
                            Result.findOne({
                                speciality: ObjectId(info.speciality._id),
                                owner: ObjectId(_id)
                            }).populate("results.subject")
                        ]
                    ).then(([program, result]) => {
                        let subjects = program.subjects;

                        let passedSubjects = result.results.filter(each => each.grade > -1);
                        let passedSubjects2 = passedSubjects.filter(each => each.grade >= 5);

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
                                $lookup: {
                                    from: 'subjects',
                                    localField: 'class.subject',
                                    foreignField: '_id',
                                    as: "class.subject"
                                }
                            },
                            {$lookup: {from: 'shifts', localField: 'from', foreignField: '_id', as: "from"}},
                            {$lookup: {from: 'shifts', localField: 'to', foreignField: '_id', as: "to"}},
                            {
                                $lookup: {
                                    from: 'dptinsinfos',
                                    localField: 'instructor',
                                    foreignField: '_id',
                                    as: "instructor"
                                }
                            },
                            {
                                $addFields: {
                                    'instructor': {
                                        $arrayElemAt: ["$instructor", 0]
                                    },
                                    'class.subject': {
                                        $arrayElemAt: ["$class.subject", 0]
                                    },
                                    'from': {
                                        $arrayElemAt: ["$from", 0]
                                    },
                                    'to': {
                                        $arrayElemAt: ["$to", 0]
                                    },
                                }
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'instructor.user',
                                    foreignField: '_id',
                                    as: "instructor.user"
                                }
                            },
                            {
                                $addFields: {
                                    'instructor.user': {
                                        $arrayElemAt: ["$instructor.user", 0]
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    "shortSubjectID": {$substr: ["$class.subject.subjectID", 0, 5]}
                                }
                            },
                            {
                                $match: {
                                    $and: [
                                        {
                                            "class.subject._id": {
                                                "$in": subjects.map(each => ObjectId(each._id))
                                            }
                                        }, {
                                            "class.subject.subjectID": {
                                                "$nin": passedSubjects.map(each => each.subject.subjectID.slice(0, 5))
                                            }
                                        },

                                    ]
                                }
                            },

                            {
                                $unwind: {
                                    path: "$class.subject.subjectsRequired",
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $match: {
                                    $or: [
                                        {
                                            "class.subject.subjectRequired": null
                                        },
                                        {
                                            "class.subject.subjectRequired": {
                                                "$in": passedSubjects2.map(each => each.subject.subjectID.slice(0, 5))
                                            }
                                        },

                                    ]
                                }
                            },
                            {
                                $match: {
                                    "class.subject.creditsRequired": {
                                        $lte: calculateTotalCredits(result.results)
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: "$_id",
                                    year: {
                                        $first: "$year"
                                    },
                                    semester: {
                                        $first: "$semester"
                                    },
                                    studentGroup: {
                                        $first: "$studentGroup"
                                    },
                                    class: {
                                        $first: "$class"
                                    },
                                    dayOfWeek: {
                                        $first: "$dayOfWeek"
                                    },
                                    classRoom: {
                                        $first: "$classRoom"
                                    },
                                    from: {
                                        $first: "$from"
                                    },
                                    to: {
                                        $first: "$to"
                                    },
                                    instructor: {
                                        $first: "$instructor"
                                    },
                                    required: {
                                        $push: "$class.subject.subjectsRequired"
                                    }
                                }
                            },
                            {
                                $addFields: {
                                    "class._id": "$_id",
                                    "class.dayOfWeek": "$dayOfWeek",
                                    "class.classRoom": "$classRoom",
                                    "class.from": "$from",
                                    "class.to": "$to",
                                    "class.instructor": "$instructor",
                                }
                            },
                            {
                                $group: {
                                    _id: "$class.subject._id",
                                    coefficient: {
                                        $first: "$class.subject.coefficient"
                                    },
                                    creditsRequired: {
                                        $first: "$class.subject.creditsRequired"
                                    },
                                    subjectID: {
                                        $first: "$class.subject.subjectID"
                                    },
                                    name: {
                                        $first: "$class.subject.name"
                                    },
                                    credits: {
                                        $first: "$class.subject.credits"
                                    },
                                    subjectsRequired: {
                                        $addToSet: "$class.subject.subjectsRequired"
                                    },
                                    lessons: {
                                        $addToSet: "$class",

                                    },
                                },

                            },
                            {
                                $project: {
                                    "lessons": {
                                        subject: {
                                            subjectsRequired: 0
                                        }

                                    }
                                }
                            },

                        ]).then(result => {
                            // return result

                            let isGDTCPassed = passedSubjects.find(each => each.subject.subjectID === "PG100");
                            return {
                                subjectList: result.filter(each => {
                                    if (["PG122", "PG123", "PG124", "PG125", "PG121E", "PG121D"].includes(each.subjectID)) {
                                        return false;
                                    }
                                    if (isGDTCPassed && /GDTC:/gi.test(each.name)) {
                                        return false;
                                    }
                                    return true;
                                }).map(transformSubjectLesson).map(each => {
                                    return {
                                        ...each,
                                        lessons: each.lessons.map(lesson => lesson.sort((a, b) => a.dayOfWeek - b.dayOfWeek))
                                    }
                                })
                            }
                        }).then(result => {
                            let {subjectList} = result;
                            // let allClasses = subjectList.reduce((total, cur) => {
                            //     let {lessons} = cur;
                            //     return total.concat(lessons.reduce((total2, lesson) => {
                            //         return total2.concat(lesson)
                            //     }, []));
                            // } ,[]);
                            return Schedule.aggregate([
                                {
                                    $match: {
                                        $and: [
                                            {"year.from": Number(currentYear.from)},
                                            {"year.to": Number(currentYear.to)},
                                            {semester: Number(currentSemester)}
                                        ]
                                    }
                                },
                                {$lookup: {from: 'schoolscheduleitems', localField: 'list', foreignField: '_id', as: "list"}},
                                // {
                                //     $addFields: {
                                //         'list': {
                                //             $arrayElemAt: ["$list", 0]
                                //         },
                                //
                                //     }
                                // },

                            ]).then(schedules => {

                                return {
                                    event,
                                    subjectList: subjectList.map((each) => {
                                        let {lessons} = each;
                                        return {
                                            ...each, lessons: lessons.map(lesson => {
                                                return lesson.map(e => {
                                                    return {...e, count: schedules.filter(sc => sc.list.find(item => item._id.toString() === e._id.toString())).length}
                                                })
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    });

                }
            }

            return Promise.reject(new ApplicationError("Bạn chưa thuộc đối tượng được đăng ký học kì này!"));
        })

    })

};

const getSubjectInfo = ({semester, year}, lessons) => {
    let [from, to] = year.split("-");
    return Schedule.aggregate([
        {
            $match: {
                $and: [
                    {"year.from": Number(from)},
                    {"year.to": Number(to)},
                    {semester: Number(semester)}
                ]
            }
        },
        {$lookup: {from: 'schoolscheduleitems', localField: 'list', foreignField: '_id', as: "list"}},
        // {
        //     $addFields: {
        //         'list': {
        //             $arrayElemAt: ["$list", 0]
        //         },
        //
        //     }
        // },

    ]).then(schedules => {

        return lessons.map(lesson => {
            return lesson.map(e => {
                return {...e, count: schedules.filter(sc => sc.list.find(item => item._id.toString() === e._id.toString())).length}
            })
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
    getSubjectsForRegistration,
    getSubjectInfo
};