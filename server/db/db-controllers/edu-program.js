const appDb = require("../../config/db").getDbs().appDb;
const Speciality = require("../model/speciality")(appDb);
const EducateProgram = require("../model/educate-program")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const getEducateProgram = ({speciality}) => {
    return EducateProgram.findOne({
        speciality: ObjectId(speciality)
    }).populate("subjects").then(data => data.subjects);
};

const getAll = () => {
    return EducateProgram.find({}).populate("speciality")
};


module.exports = {
    getEducateProgram,
    getAll
}