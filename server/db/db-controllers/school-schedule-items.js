const appDb = require("../../config/db").getDbs().appDb;
const Subject = require("../model/subject")(appDb);
const ClassRoom = require("../model/class-room")(appDb);
const DptInsInfo = require("../model/dpt-ins-info")(appDb);
const Speciality = require("../model/speciality")(appDb);
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

const getSchoolScheduleItems = ({keyword, year, studentGroup, semester}) => {
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

    if(keyword){
        pipeline.push({
            $match: {
                $or : [
                    {"class.subject.name": { $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i") }},
                    {"class.subject.subjectID": { $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i") }},
                    {"instructor.user.identityID": { $regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i") }},
                ]
            }

        });
    }
    return SchoolScheduleItems.aggregate(pipeline).then(data => {
        return data;
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
            if(!each.division)
                return omit(each, "division");
            return {...each, division: ObjectId(each.division)}
        })),
        ClassRoom.insertMany(classRooms),
        User.insertMany(instructors.map((each, i) => ({...each, email: `gv${i}@gmail.com`, phone: i, role: "gv",dob: new Date().getTime(), password: "test", username: each.identityID}))),
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
                const classMapping = newClasses.reduce((result, current) => {
                    result[current.name] = ObjectId(current._id);
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
                return SchoolScheduleItems.insertMany(schoolScheduleItems.map((each) => {
                    // console.log(classMapping[each.class.name])
                    return omit({...each,
                        class: classMapping[each.class.name],
                        classRoom: classRoomMapping[each.classRoom.name],
                        from: shifts.find(e => {
                            return e.name === each.from
                        })._id,
                        to:  shifts.find(e => e.name === each.to)._id,
                        instructor: userMapping[each.instructor.identityID]
                    }, ["subjectID", "shift"])
                }));

            })
        })
};

const getInstructorSchedule = (instructorID, {semester, year}) => {
    let [from, to] = year.split("-");
    return SchoolScheduleItems.aggregate([
        {$match: {
                instructor: ObjectId(instructorID),
                semester: Number(semester),
                "year.from": Number(from),
                "year.to": Number(to)
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

module.exports = {
    getSchoolScheduleItems,
    importData,
    getInstructorSchedule

}