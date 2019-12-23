const appDb = require("../../config/db").getDbs().appDb;
const Speciality = require("../model/speciality")(appDb);
const EducateProgram = require("../model/educate-program")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const getAll = () => {
    return Speciality.find().lean().then((data) => {
        return data;
    })
};

const getEducateProgram = ({speciality}) => {
    return EducateProgram.findOne({
        speciality: ObjectId(speciality)
    }).populate("subjects");
};


module.exports = {
    getAll,
    getEducateProgram
}