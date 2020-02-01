const appDb = require("../../config/db").getDbs().appDb;
const Subject = require("../model/subject")(appDb);
const ClassRoom = require("../model/class-room")(appDb);
const Schedule = require("../model/schedule")(appDb);
const AppConfig = require("../model/app-config")(appDb);
const DptInsInfo = require("../model/dpt-ins-info")(appDb);
const SubjectLesson = require("../model/subject-lesson")(appDb);
const EducateProgram = require("../model/educate-program")(appDb);
const User = require("../model/user")(appDb);
const Class = require("../model/class")(appDb);
const Shift = require("../model/shift")(appDb);
const SchoolScheduleItems = require("../model/school-schedule-items")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isNil = require("lodash/isNil");
const {transformSubjectLesson} = require("../../utils/registration-event");

const getSchoolScheduleItems = ({keyword, year, studentGroup, semester, state, status}) => {
    let pipeline = [];
    if (year) {
        let [from, to] = year.split("-");
        pipeline.push({
            $match: {
                "year.from": Number(from),
                "year.to": Number(to)
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
    if (status) {
        pipeline.push({
            $match: {
                disabled: !!Number(status)
            }

        });
    }
    pipeline = pipeline.concat([

        {$lookup: {from: 'shifts', localField: 'from', foreignField: '_id', as: "from"}},
        {$lookup: {from: 'shifts', localField: 'to', foreignField: '_id', as: "to"}},
        {$lookup: {from: 'classes', localField: 'class', foreignField: '_id', as: "class"}},
        {$lookup: {from: 'classrooms', localField: 'classRoom', foreignField: '_id', as: "classRoom"}},
        {
            $addFields: {
                'from': {
                    $arrayElemAt: ["$from", 0]
                },
                'to': {
                    $arrayElemAt: ["$to", 0]
                },
                'class': {
                    $arrayElemAt: ["$class", 0]
                },
                'classRoom': {
                    $arrayElemAt: ["$classRoom", 0]
                }
            }
        },
        {$lookup: {from: 'subjects', localField: 'class.subject', foreignField: '_id', as: "class.subject"}},
        {
            $addFields: {
                'class.subject': {
                    $arrayElemAt: ["$class.subject", 0]
                }
            }
        },
        {$lookup: {from: 'dptinsinfos', localField: 'instructor', foreignField: '_id', as: "instructor"}},

        {
            $addFields: {
                'instructor': {
                    $arrayElemAt: ["$instructor", 0]
                }
            }
        },
        {$lookup: {from: 'users', localField: 'instructor.user', foreignField: '_id', as: "instructor.user"}},
        {
            $addFields: {
                'instructor.user': {
                    $arrayElemAt: ["$instructor.user", 0]
                }
            }
        },
    ]);

    if (keyword) {
        pipeline.push({
            $match: {
                $or: [
                    {"class.name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"class.subject.name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"class.subject.subjectID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"instructor.user.identityID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                ]
            }

        });
    }
    return SchoolScheduleItems.aggregate(pipeline).then(data => {
        return AppConfig.find({}).lean()
            .then(configs => {
                let {currentSemester, currentYear} = configs[0];
                return Schedule.find({
                    "year.from": Number(currentYear.from),
                    "year.to": Number(currentYear.to),
                    semester: Number(currentSemester)
                }).lean().then(schedules => {
                    let returned = data.map(each => {
                        return {
                            ...each,
                            state: schedules.filter(sc => sc.list.find(ssc => ssc.toString() === each._id.toString())).length
                        }
                    });
                    if (state) {
                        let matcher = {
                            "0": (item) => item.state < Number(item.class.capacity.min),
                            "1": (item) => item.state >= Number(item.class.capacity.min) && item.state < Number(item.class.capacity.max),
                            "2": (item) => item.state >= Number(item.class.capacity.max),
                        };

                        return returned.filter(matcher[state]);
                    }
                    return returned;
                })
            });
    });
};

const importData = ({subjects, eduProgram, schoolScheduleItems, classes, classRooms, instructors}) => {
    // schoolScheduleItems.forEach((sub, i) => {
    //
    //     if(sub.from > 10 || sub.to > 10)
    //         console.log("loz")
    // });
    return Promise.all([
        Subject.insertMany(subjects.map(each => {
            if (!each.division)
                return omit(each, "division");
            return {...each, division: ObjectId(each.division)}
        })),
        ClassRoom.insertMany(classRooms),
        User.insertMany(instructors.map((each, i) => ({
            ...each,
            email: `gv${i}@gmail.com`,
            phone: i,
            role: "gv",
            dob: new Date().getTime(),
            password: "test",
            username: each.identityID
        }))),
        Shift.find({}).lean()
    ])
        .then(([subjects, classRooms, users, shifts]) => {
            const subjectMapping = subjects.reduce((result, current) => {
                result[current.subjectID] = ObjectId(current._id);
                return result;
            }, {});

            return Promise.all([
                DptInsInfo.insertMany(users.map(each => ({user: each._id}))),
                Class.insertMany(classes.map(each => ({
                    ...each,
                    subject: subjectMapping[each.subject]
                }))),
                new EducateProgram({
                    speciality: eduProgram.speciality._id,
                    subjects: Object.values(subjectMapping)
                }).save()
            ]).then(([dptInfo, newClasses, newEduProgram]) => {
                newClasses = newClasses.map(each => each.toObject());
                const classMapping = newClasses.reduce((result, current) => {
                    result[current.unique] = ObjectId(current._id);
                    return result;
                }, {});

                const classRoomMapping = classRooms.reduce((result, current) => {
                    result[current.name] = ObjectId(current._id);
                    return result;
                }, {});
                const userMapping = users.reduce((result, current) => {
                    result[current.identityID] = dptInfo.find(e => e.user === current._id)._id;
                    return result;
                }, {});
                // console.log(classMapping)
                // console.log(subjects)


                return SchoolScheduleItems.insertMany(schoolScheduleItems.map((each) => {
                    console.log(classMapping[each.class.name + each.shift + each.classRoom.name + each.dayOfWeek])
                    return omit({
                        ...each,
                        class: classMapping[each.class.name + each.shift + each.classRoom.name + each.dayOfWeek],
                        classRoom: classRoomMapping[each.classRoom.name],
                        from: shifts.find(e => {
                            return e.name === each.from
                        })._id,
                        to: shifts.find(e => e.name === each.to)._id,
                        instructor: userMapping[each.instructor.identityID]
                    }, ["subjectID", "shift"])
                })).then(items => {
                    let itemsMapping = items.map(each => each.toObject()).reduce((result, current) => {
                        console.log(result.hasOwnProperty(current.class.toString()))
                        result[current.class.toString()] = current._id.toString();
                        return result;
                    }, {});
                    let subLessons = subjects.map(each => {
                        let classes = newClasses.filter(cl => cl.subject.toString() === each._id.toString());
                        // if(each.subjectID === "FN334"){
                        //     console.log(classes.length)
                        // }
                        if (classes.length !== 0) {
                            console.log(each.name + " " + each.subjectID)
                        }

                        let lessons = transformSubjectLesson({
                            lessons: classes
                        }).lessons.map(le => {
                            return le.map(cl => ObjectId(itemsMapping[cl._id]))
                        });
                        return {
                            subject: ObjectId(each._id),
                            lessons
                        }
                    });
                    return SubjectLesson.insertMany(subLessons)
                });

            })
        })
};

const getInstructorSchedule = (instructorID, {semester, year}) => {
    let [from, to] = year.split("-");
    return SchoolScheduleItems.aggregate([
        {
            $match: {
                instructor: ObjectId(instructorID),
                semester: Number(semester),
                "year.from": Number(from),
                "year.to": Number(to),
                disabled: false
            }
        },
        {$lookup: {from: 'shifts', localField: 'from', foreignField: '_id', as: "from"}},
        {$lookup: {from: 'shifts', localField: 'to', foreignField: '_id', as: "to"}},
        {$lookup: {from: 'classes', localField: 'class', foreignField: '_id', as: "class"}},
        {$lookup: {from: 'classrooms', localField: 'classRoom', foreignField: '_id', as: "classRoom"}},
        {
            $addFields: {
                'from': {
                    $arrayElemAt: ["$from", 0]
                },
                'to': {
                    $arrayElemAt: ["$to", 0]
                },
                'class': {
                    $arrayElemAt: ["$class", 0]
                },
                'classRoom': {
                    $arrayElemAt: ["$classRoom", 0]
                }
            }
        },
        {$lookup: {from: 'subjects', localField: 'class.subject', foreignField: '_id', as: "class.subject"}},
        {
            $addFields: {
                'class.subject': {
                    $arrayElemAt: ["$class.subject", 0]
                }
            }
        },
    ]).then(data => {
        return data;
    });
};

const getShiftsOverview = () => {
    return Shift.aggregate([
        {
            $match: {
                name: {
                    $lte: 10
                }
            }
        }, {$sort: {name: 1}},
    ])
};

const getLessonsByItems = classes => {
    let objectiveClasses = classes.map(each => ObjectId(each));
    return SubjectLesson.aggregate([
        {
            $unwind: "$lessons"
        },
        {
            $match: {
                "lessons": {
                    "$in": objectiveClasses
                }
            }
        },
        {$lookup: {from: 'schoolscheduleitems', localField: 'lessons', foreignField: '_id', as: "lessons"}},
        {$lookup: {from: 'subjects', localField: 'subject', foreignField: '_id', as: "subject"}},
        {
            $addFields: {
                'subject': {
                    $arrayElemAt: ["$subject", 0]
                },
                "classIds": {
                    "$reduce": {
                        "input": "$lessons",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", ["$$this.class"]]}
                    }
                },
                "fromIds": {
                    "$reduce": {
                        "input": "$lessons",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", ["$$this.from"]]}
                    }
                },
                "toIds": {
                    "$reduce": {
                        "input": "$lessons",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", ["$$this.to"]]}
                    }
                },
                "clRoomIds": {
                    "$reduce": {
                        "input": "$lessons",
                        "initialValue": [],
                        "in": {"$concatArrays": ["$$value", ["$$this.classRoom"]]}
                    }
                },
            }
        },
        {$lookup: {from: 'shifts', localField: 'fromIds', foreignField: '_id', as: "fromInfo"}},
        {$lookup: {from: 'shifts', localField: 'toIds', foreignField: '_id', as: "toInfo"}},
        {$lookup: {from: 'classes', localField: 'classIds', foreignField: '_id', as: "classInfo"}},
        {$lookup: {from: 'classrooms', localField: 'clRoomIds', foreignField: '_id', as: "classRoomInfo"}},
        {
            $addFields: {
                "lessons": {
                    "$map": {
                        "input": "$lessons",
                        "in": {
                            "$mergeObjects": [
                                "$$this",
                                {
                                    "from": {
                                        "$arrayElemAt": [
                                            "$fromInfo",
                                            {"$indexOfArray": ["$fromIds", "$$this.from"]}
                                        ]
                                    },
                                    "to": {
                                        "$arrayElemAt": [
                                            "$toInfo",
                                            {"$indexOfArray": ["$toIds", "$$this.to"]}
                                        ]
                                    },
                                    "class": {
                                        "$arrayElemAt": [
                                            "$classInfo",
                                            {"$indexOfArray": ["$classIds", "$$this.class"]}
                                        ]
                                    },
                                    "classRoom": {
                                        "$arrayElemAt": [
                                            "$classRoomInfo",
                                            {"$indexOfArray": ["$clRoomIds", "$$this.classRoom"]}
                                        ]
                                    },
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "fromIds": 0,
                "toIds": 0,
                "classIds": 0,
                "clRoomIds": 0,
                "fromInfo": 0,
                "toInfo": 0,
                "classInfo": 0,
                "classRoomInfo": 0
            }
        }

    ]).then((data) => {
        return AppConfig.find({}).lean()
            .then(configs => {
                let {currentSemester, currentYear} = configs[0];
                return Schedule.find({
                    "year.from": Number(currentYear.from),
                    "year.to": Number(currentYear.to),
                    semester: Number(currentSemester)
                }).lean().then(schedules => {
                    return data.map(each => {
                        return {
                            ...each,
                            lessons: each.lessons.map(l => {
                                return {
                                    ...l,
                                    state: schedules.filter(sc => sc.list.find(ssc => ssc.toString() === l._id.toString())).length
                                }
                            })

                        }
                    });
                })
            })

    })
};

const disabledSchoolScheduleItems = (ids) => {
    return Promise.all([SchoolScheduleItems.updateMany({
        _id: {
            "$in": ids.map(each => ObjectId(each))
        }
    }, {
        "$set": {
            "disabled": true
        }
    }, {new: true}), Schedule.updateMany({
        list: {
            "$in": ids.map(each => ObjectId(each))
        }
    }, {
        "$pull": {
            "list": {
                "$in": ids.map(each => ObjectId(each))
            }
        }
    }, {new: true})])
};

module.exports = {
    getSchoolScheduleItems,
    importData,
    getInstructorSchedule,
    getShiftsOverview,
    getLessonsByItems,
    disabledSchoolScheduleItems
};