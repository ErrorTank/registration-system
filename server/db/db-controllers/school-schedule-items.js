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
            }),
        Shift.find().lean()
    ]).then(([subjects, classRooms, users, shifts]) => {
        const subjectMapping = subjects.reduce((result, current) => {
            result[current.subjectID] = ObjectId(current._id);
            return result;
        }, {});

        return Promise.all([
            Class.insertMany(classes.map(each => ({
                ...each,
                subject: subjectMapping[each.subject]
            }))),
            new EducateProgram({
                speciality: eduProgram.speciality._id,
                subjects: Object.values(subjectMapping)
            }).save()
        ]).then(([newClasses, newEduProgram]) => {
            const classMapping = newClasses.reduce((result, current) => {
                result[current.name] = ObjectId(current._id);
                return result;
            }, {});
            const classRoomMapping = classRooms.reduce((result, current) => {
                result[current.name] = ObjectId(current._id);
                return result;
            }, {});
            return SchoolScheduleItems.insertMany(schoolScheduleItems.map((each) => omit({...each,
                class: classMapping[each.class.name],
                classRoom: classRoomMapping[each.classRoom.name],
                from: shifts.find(e => e.name === each.from)._id,
                to:  shifts.find(e => e.name === each.to)._id,
                instructor: users.find(e => e.identityID === each.instructor.identityID)._id
            }, ["subjectID", "shift"])));

        })
    })
};


module.exports = {
    getAll,
    importData

}