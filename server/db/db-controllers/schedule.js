const appDb = require("../../config/db").getDbs().appDb;
const Schedule = require("../model/schedule")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const getStudentSchedule = ({studentID, semester, year}) => {
    let [from, to] = year.split("-");
    return Schedule.findOne({owner: ObjectId(studentID), "year.from": from, "year.to": to, semester}).lean().then((data) => {
        return data;
    })
};


const toggleRegisterLesson = ({studentID, semester, year}, lesson) => {
    return null;
};

module.exports = {
    getStudentSchedule,
    toggleRegisterLesson
}