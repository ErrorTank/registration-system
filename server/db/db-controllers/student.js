const appDb = require("../../config/db").getDbs().appDb;
const User = require("../model/user")(appDb);
const Schedule = require("../model/schedule")(appDb);
const StudentInfo = require("../model/student-info")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");

const getStudentsBySchoolScheduleItem = (itemID) => {
    return Schedule.find({
        list: ObjectId(itemID)
    }).populate({
        path: "owner",
        populate: [
            {
                path: "user",
                model: "User"
            },
            {
                path: "speciality",
                model: "Speciality"
            }
        ]
    }).then(data => {
        return data.map(each => ({...pick(each, "owner").owner.toObject()}))
    })
};

const getStudentsByCredit = ({credit, semester, year}) => {
    let [from, to] = year.split("-");
    return Schedule.find({
        "year.from": Number(from),
        "year.to": Number(to),
        active: true,
        semester: Number(semester)
    }).populate({
        path: "list",
        populate: [
            {
                path: "class",
                model: "Class",
                populate: {
                    path: "subject",
                    model: "Subject"
                }
            },
            {
                path: "owner",
                model: "StudentInfo",
                populate: {
                    path: "user",
                    model: "User",
                    select: "-password"
                }
            }
        ]
    }).then(schedules => {
        console.log(schedules.length)
        let newSchedules = schedules.map(each => {
            // console.log(each)
            return {
                credits: each.list.reduce((total, cur) => total + cur.class.subject.credits, 0)
            }
        });
        let matcher = {
            0: each => each.credits >= 15,
            1: each => each.credits >= 12 && each.credits < 15,
            2: each => each.credits >= 10 && each.credits < 12,
            3: each => each.credits < 10
        };
        return newSchedules.filter(matcher[credit]).map(each => each.owner)
    })
};

module.exports = {
    getStudentsBySchoolScheduleItem,
    getStudentsByCredit
};