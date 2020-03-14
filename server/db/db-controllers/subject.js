const appDb = require("../../config/db").getDbs().appDb;
const Class = require("../model/class")(appDb);
const Subject = require("../model/subject")(appDb);
const SchoolScheduleItems = require("../model/school-schedule-items")(appDb);
const EduProgram = require("../model/educate-program")(appDb);
const Result = require("../model/result")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const isEqual = require("lodash/isEqual");

const getAllSubjects = ({keyword, division, credit, coefficient}) => {

    let pipeline = [];
    let query = {};
    if (division) {
        query.division = ObjectId(division);
    }
    if (credit) {
        query.credits = Number(credit);
    }
    if (coefficient) {
        let [from, to] = coefficient.split("-");
        query.coefficient = {
            $gte: Number(from),
            $lt: Number(to)
        };

    }
    if (Object.keys(query).length) {
        pipeline.push({
            $match: query

        });
    }

    pipeline = pipeline.concat([
        {$lookup: {from: 'divisions', localField: 'division', foreignField: '_id', as: "division"}},
        {
            $addFields: {
                'division': {
                    $arrayElemAt: ["$division", 0]
                }
            }
        },
    ]);

    if (keyword) {
        pipeline.push({
            $match: {
                $or: [
                    {"subjectID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                ]
            }
        });
    }

    return (pipeline.length > 2 ? Subject.aggregate(pipeline) : Subject.find({}).populate([
        {
            path: "division",
            model: "Division"
        },
    ]))
};

const getSubjectDetail = subjectID => {
    return Promise.all([
        Subject.findOne({_id: ObjectId(subjectID)}, "-__v"),
        Class.find({subject: ObjectId(subjectID)}, "-unique -__v").lean()
    ]).then(([subject, classes]) => {
        return {
            ...subject.toObject(),
            classes
        }
    })
};

const getSubjectsBriefByDivision = divisionID => {
    return Subject.find({division: ObjectId(divisionID)}, "_id name subjectID").lean()
};

const deleteSubject = subjectID => {
    return Promise.all([
        Subject.findOne({_id: ObjectId(subjectID)}, "-__v"),
        Class.find({subject: ObjectId(subjectID)}, "-unique -__v").lean()
    ])
        .then(([subject, classes]) => {
            let newSubject = subject.toObject();
            let classesIDs = classes.map(each => ObjectId(each._id));
            return Promise.all([
                SchoolScheduleItems.find({class: {$in: classesIDs}}).populate([
                    {
                        path: "class",
                        model: "Class"
                    }, {
                        path: "classRoom",
                        model: "ClassRoom"
                    }, {
                        path: "instructor",
                        model: "DptInsInfo",
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    }, {
                        path: "from",
                        model: "Shift"
                    }, {
                        path: "to",
                        model: "Shift"
                    }
                ]),
                EduProgram.find({subject: ObjectId(subjectID)}).populate("speciality"),
                Result.find({"results.subject": ObjectId(subjectID)}).populate([
                    {
                        path: "owner",
                        model: "StudentInfo",
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    }, {
                        path: "speciality",
                        model: "Speciality"
                    }
                ])
            ]).then(([items, programs, results]) => {

                if (!items.length && !programs.length && !results.length) {
                    return Promise.all([
                        Subject.findOneAndDelete({_id: ObjectId(subjectID)}).lean(),
                        Subject.updateMany({subjectsRequired: newSubject.subjectID}, {
                            $pull: {
                                subjectsRequired: newSubject.subjectID
                            }
                        })
                    ]).then(() => newSubject);
                }
                return Promise.reject(new ApplicationError("delete_subject_error", {
                    items,
                    programs,
                    results
                }))
            })
        })

};

const updateSubject = (sID, data) => {

    return Subject.findOne({_id: {$ne: ObjectId(sID)}, subjectID: data.subjectID}).lean()
        .then((subject) => {
            if (subject) {
                return Promise.reject(new ApplicationError("duplicate_subjectID", subject));
            }
            return Promise.all([Class.find({subject: ObjectId(sID)}).lean(), Subject.findOne({_id: ObjectId(sID)}).lean()]);
        })
        .then(([classes, subject]) => {

            let deletedClasses = classes.filter(each => !data.classes.find(old => old._id && old._id.toString() === each._id.toString()));
            let deletedIds = deletedClasses.map(each => ObjectId(each._id));
            console.log(deletedClasses)
            return SchoolScheduleItems.find({class: {$in: deletedIds}}).populate([
                {
                    path: "class",
                    model: "Class"
                }, {
                    path: "classRoom",
                    model: "ClassRoom"
                }, {
                    path: "instructor",
                    model: "DptInsInfo",
                    populate: {
                        path: "user",
                        model: "User"
                    }
                }, {
                    path: "from",
                    model: "Shift"
                }, {
                    path: "to",
                    model: "Shift"
                }
            ]).then(items => {

                if (items.length) {
                    return Promise.reject(new ApplicationError("un_deletable_classes", items));
                }
                let newClasses = data.classes.filter(each => !each._id);
                let updatedClasses = data.classes.filter(each => {
                    if (each._id) {
                        let raw = pick(classes.find(cl => cl._id.toString() === each._id.toString()), ["_id", "capacity", "name"]);
                        return !isEqual(raw, pick(each, ["_id", "capacity", "name"]))
                    }
                    return false;

                });
                console.log(newClasses.length)
                console.log(updatedClasses.length)

                let promises = [
                    Class.deleteMany({_id: {$in: deletedIds}}),
                    Subject.findOneAndUpdate({_id: ObjectId(sID)}, {$set: omit(data, ["classes"])}),
                    Class.insertMany(newClasses.map(each => ({...each, subject: ObjectId(sID)}))),
                    ...updatedClasses.map(each => Class.findOneAndUpdate({_id: ObjectId(each._id)}, {$set: pick(each, ["capacity", "name"])}))
                ];
                if (data.subjectID !== subject.subjectID) {
                    promises.push(Subject.updateMany({subjectsRequired: subject.subjectID}, {
                        $push: {
                            subjectsRequired: data.subjectID
                        },

                    }).then(() => {
                        return Subject.updateMany({subjectsRequired: subject.subjectID}, {
                            $pull: {
                                subjectsRequired: subject.subjectID
                            },

                        })
                    }))
                }
                return Promise.all(promises)
                    .then(() => {
                        return Promise.all([
                            Subject.findOne({_id: ObjectId(sID)}, "-__v"),
                            Class.find({subject: ObjectId(sID)}, "-unique -__v").lean()
                        ]).then(([subject, classes]) => {
                            return {
                                ...subject.toObject(),
                                classes
                            }
                        })
                    })
            })
        })


};

const createSubject = data => {
    return Subject.findOne({subjectID: data.subjectID}).lean()
        .then((subject) => {
            if (subject) {
                return Promise.reject(new ApplicationError("duplicate_subjectID", subject));
            }
            return new Subject({
                ...omit(data, "classes")
            }).save().then(sub => Class.insertMany(data.classes.map(each => ({
                ...each,
                subject: sub.toObject()._id
            })))
                .then(classes => {
                    return {
                        ...sub.toObject(),
                        classes
                    }
                }))
        })
};

module.exports = {
    getSubjectDetail,
    getAllSubjects,
    getSubjectsBriefByDivision,
    deleteSubject,
    updateSubject,
    createSubject
};