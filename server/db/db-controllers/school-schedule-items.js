const appDb = require("../../config/db").getDbs().appDb;
const Subject = require("../model/subject")(appDb);
const ClassRoom = require("../model/class-room")(appDb);
const DptInsInfo = require("../model/dpt-ins-info")(appDb);
const Speciality = require("../model/speciality")(appDb);
const User = require("../model/user")(appDb);
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

const importData = ({subjects, eduProgram, schoolScheduleItems, classes, classRooms, instructors}) => {
    return Promise.all([
        Subject.insertMany(subjects),
        ClassRoom.insertMany(classRooms),
        User.insertMany(instructors)
            .then(docs => {
                let ObjectIDs = docs.map(each => ({user: each._id}));
                return DptInsInfo.insertMany(ObjectIDs)
            })
    ]).then(() => {

    })
};


module.exports = {
    getAll,
    importData

}