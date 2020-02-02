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


module.exports = {
    getStudentsBySchoolScheduleItem,

};