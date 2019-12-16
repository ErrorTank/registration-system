const mongoose = require("mongoose");
const appDbUrl = process.env.DB_HOST;
let resolve1 = null;

let promise1 = (() => new Promise((resolve) => {
    resolve1 = resolve;
}))();



let appDb = mongoose.createConnection(appDbUrl, {useNewUrlParser: true, useCreateIndex: true}, () => {

    console.log('\x1b[36m%s\x1b[32m', "Load all central instances successfully!");
    console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", appDbUrl);
    resolve1();
});


module.exports = {
    initDatabase: () => {
        return Promise.all([
            promise1
        ]).then(() => {
            const AppConfig = require("../db/model/app-config")(appDb);
            const Classroom = require("../db/model/class-room")(appDb);
            const Class = require("../db/model/class")(appDb);
            const CommonUserInfo = require("../db/model/common-user-info")(appDb);
            const Department = require("../db/model/department")(appDb);
            const DptInsInfo = require("../db/model/dpt-ins-info")(appDb);
            const EducateProgram = require("../db/model/educate-program")(appDb);
            const EnglishLevel = require("../db/model/english-level")(appDb);
            const RegistrationEvent = require("../db/model/registration-event")(appDb);
            const Result = require("../db/model/result")(appDb);
            const Schedule = require("../db/model/schedule")(appDb);
            const SchoolScheduleItems = require("../db/model/school-schedule-items")(appDb);
            const Shift = require("../db/model/shift")(appDb);
            const Speciality = require("../db/model/speciality")(appDb);
            const StudentInfo = require("../db/model/student-info")(appDb);
            const Subject = require("../db/model/subject")(appDb);
            const User = require("../db/model/user")(appDb);
        }).catch((err) => {
            console.log("Cannot connect to db");
            return Promise.reject(err);
        });
    },
    getDb: () => ({
        appDb
    })
};

