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
            const RegistrationEvent = require("../db/model/registration-event")(appDb);
            const Result = require("../db/model/result")(appDb);
            const Schedule = require("../db/model/schedule")(appDb);
            const SchoolScheduleItems = require("../db/model/school-schedule-items")(appDb);
            const Shift = require("../db/model/shift")(appDb);
            const Speciality = require("../db/model/speciality")(appDb);
            const StudentInfo = require("../db/model/student-info")(appDb);
            const Subject = require("../db/model/subject")(appDb);
            const User = require("../db/model/user")(appDb);
            new User({
                username: "test",
                password: "admin",
                role: "admin",

            }).save().then(data => {
                new CommonUserInfo({
                    name: "dsa",
                    dob: new Date().getTime(),
                    phone: "3123",
                    email: "haha@gmail.com",
                    user: data.toObject()._id,
                    identityID: "A28998"
                })
            });
            new User({
                username: "test2",
                password: "admin",
                role: "bm",

            }).save().then(data => {
                new Department({
                    name: "test",
                    pricePerCredit: 20000

                }).save().then(data2 => {
                    new DptInsInfo({
                        name: "dsa",
                        dob: new Date().getTime(),
                        phone: "3123",
                        email: "haha@gmail.com",
                        user: data.toObject()._id,
                        identityID: "A28998",
                        department:data2.toObject()._id
                    }).save().then(he => {
                        new Shift({
                            name: 1,
                            from: "a",
                            to: "b"
                        }).save().then(data => {
                            new Shift({
                                name: 2,
                                from: "c",
                                to: "d"
                            }).save().then(data2 => {
                                new Classroom({
                                    name: "cac3"
                                }).save().then(data3 => {

                                    new Subject({
                                        subjectID: "test3",
                                        name: "dasd",
                                        credits: 3,
                                        capacity: 15,
                                        coefficient: 0.2,
                                    }).save().then(s => {
                                        new Class({
                                            name: "test2",
                                            subject: s.toObject()._id

                                        }).save().then(data4 => {
                                            new SchoolScheduleItems({
                                                semester: "k1",
                                                class: data4.toObject()._id,
                                                classRoom: data3.toObject()._id,
                                                dayOfWeek: "t2",
                                                instructor: he.toObject()._id,
                                                from: data.toObject()._id,
                                                to: data2.toObject()._id
                                            })
                                        })
                                    })
                                });
                            })
                        });
                    })
                })

            });
            new User({
                username: "test3",
                password: "admin",
                role: "sv",

            }).save().then(data => {
                new StudentInfo({
                    name: "dsa",
                    dob: new Date().getTime(),
                    phone: "3123",
                    email: "haha@gmail.com",
                    user: data.toObject()._id,
                    identityID: "A28998",
                    englishLevel: "a2",
                    schoolYear: 29
                }).save()

            });
            new RegistrationEvent({
                studentGroup: 1,
                from: new Date().getTime(),
                to: new Date().getTime()
            }).save().then(data => {

            });

            new AppConfig({
                latestSchoolYear: 29
            }).save();
            new Classroom({
                name: "cac"
            }).save();
            new Subject({
                subjectID: "test",
                name: "dasd",
                credits: 3,
                capacity: 15,
                coefficient: 0.2,

            }).save().then(data => {
                new Class({
                    name: "test",
                    subject: data.toObject()._id

                }).save();
            });
            new Department({
                name: "test",
                pricePerCredit: 20000

            }).save().then(data => {
                new Speciality({
                    name: "test",
                    shortName: "s",
                    department: data.toObject()._id

                }).save().then(data1 => {
                    new Subject({
                        subjectID: "test2",
                        name: "dasd",
                        credits: 3,
                        capacity: 15,
                        coefficient: 0.2,

                    }).save().then(data2=>{
                        new EducateProgram({
                            subjects: [data2.toObject()._id],
                            speciality: data1.toObject()._id

                        }).save()
                    })
                })
            });
        }).catch((err) => {
            console.log("Cannot connect to db");
            return Promise.reject(err);
        });
    },
    getDb: () => ({
        appDb
    })
};

