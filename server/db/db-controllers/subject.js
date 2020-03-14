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

module.exports = {
    getSubjectDetail,
    getAllSubjects,
    getSubjectsBriefByDivision,
    deleteSubject
};