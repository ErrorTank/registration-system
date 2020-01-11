const appDb = require("../../config/db").getDbs().appDb;
const Schedule = require("../model/schedule")(appDb);
const Class = require("../model/class")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const getStudentSchedule = ({studentID, semester, year}) => {
    let [from, to] = year.split("-");
    return Schedule.findOne({
        owner: ObjectId(studentID),
        "year.from": from,
        "year.to": to,
        semester
    }) .populate({
        path: 'list',
        populate: [
            {
                path: 'class',
                model: 'Class'
            },
            {
                path: 'from',
                model: 'Shift'
            },
            {
                path: 'to',
                model: 'Shift'
            },{
                path: 'classRoom',
                model: 'ClassRoom'
            },
        ]

    })

        .then((data) => {
        return data;
    })
};


const toggleRegisterLesson = ({studentID, semester, year}, lesson) => {
    let classIds = lesson.map(each => ObjectId(each._id));
    let classStringIds = lesson.map(each => each._id);
    console.log(classIds)
    console.log(classStringIds)
    let [from, to] = year.split("-");

    return Schedule.findOne({owner: ObjectId(studentID), "year.from": from, "year.to": to, semester: Number(semester)}).lean()
        .then(schedule => {
            console.log(schedule)
            if (!schedule) {
                return new Schedule({
                    owner: ObjectId(studentID),
                    year: {
                        from,
                        to
                    },
                    semester,
                    list: [classIds]
                }).save();
            }

            return Class.find({subject: ObjectId(lesson[0].subject._id)}).lean().then(all => {
                let updatedOperator = schedule.list.filter(each => classStringIds.includes(each._id.toString())).length === lesson.length ? {
                    $pull: {list: {$in: classStringIds}}
                } : {
                    $pull: {list: {$in: all.map(each => ObjectId(each._id))}},
                    $push: {list: {$each: classIds}},
                };
                console.log(updatedOperator)
                return Schedule.findOneAndUpdate({
                    owner: ObjectId(studentID),
                    "year.from": from,
                    "year.to": to
                }, updatedOperator, {new: true}).lean()
            })
        });
};

module.exports = {
    getStudentSchedule,
    toggleRegisterLesson
}