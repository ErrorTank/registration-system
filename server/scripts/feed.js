module.exports =  (appDb) => {
    const AppConfig = require("../db/model/app-config")(appDb);
    const Classroom = require("../db/model/class-room")(appDb);
    const Class = require("../db/model/class")(appDb);
    const CommonUserInfo = require("../db/model/common-user-info")(appDb);
    const Division = require("../db/model/division")(appDb);
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

    // new AppConfig({
    //     latestSchoolYear: 32
    // }).save().then((s) => {
    //     console.log("dsadasdsa")
    // });
    //
    // new User({
    //     username: "test",
    //     password: "admin",
    //     role: "admin",
    //     name: "dsa",
    //     dob: new Date().getTime(),
    //     phone: "3123",
    //     email: "haha@gmail.com",
    //     identityID: "A28998"
    // }).save().then(data => {
    //     new CommonUserInfo({
    //
    //         user: data.toObject()._id,
    //
    //     }).save()
    // });
    // new User({
    //     username: "test2",
    //     password: "admin",
    //     role: "bm",
    //     name: "dsa",
    //     dob: new Date().getTime(),
    //     phone: "3123",
    //     email: "haha@gmail.com",
    //     identityID: "A28998"
    // }).save().then(data => {
    //     new Division({
    //         name: "test"
    //
    //     }).save().then(data2 => {
    //         new DptInsInfo({
    //
    //             user: data.toObject()._id,
    //
    //             division: data2.toObject()._id
    //         }).save().then(he => {
    //             new Shift({
    //                 name: 1,
    //                 from: "a",
    //                 to: "b"
    //             }).save().then(data => {
    //                 new Shift({
    //                     name: 2,
    //                     from: "c",
    //                     to: "d"
    //                 }).save().then(data2 => {
    //                     new Classroom({
    //                         name: "cac3"
    //                     }).save().then(data3 => {
    //
    //                         new Subject({
    //                             subjectID: "test3",
    //                             name: "dasd",
    //                             credits: 3,
    //                             coefficient: 0.2,
    //                             division: data2.toObject()._id
    //                         }).save().then(s => {
    //                             new Class({
    //                                 name: "test2",
    //                                 subject: s.toObject()._id
    //
    //                             }).save().then(data4 => {
    //                                 new SchoolScheduleItems({
    //                                     year: {
    //                                         from: 2019,
    //                                         to: 2020
    //                                     },
    //                                     semester: 0,
    //                                     studentGroup:1,
    //
    //                                     class: data4.toObject()._id,
    //                                     classRoom: data3.toObject()._id,
    //                                     dayOfWeek: 0,
    //                                     instructor: he.toObject()._id,
    //                                     from: data.toObject()._id,
    //                                     to: data2.toObject()._id
    //                                 }).save().then((a) => {
    //                                     new Speciality({
    //                                         name: "test22",
    //                                         shortName: "s2",
    //                                         pricePerCredit: [
    //                                             {
    //                                                 schoolYear: 29,
    //                                                 price: 500000
    //                                             }
    //                                         ]
    //                                     }).save()
    //                                         .then((spec) => {
    //                                             new User({
    //                                                 username: "test5",
    //                                                 password: "admin",
    //                                                 role: "sv",
    //                                                 name: "dsa",
    //                                                 dob: new Date().getTime(),
    //                                                 phone: "31223",
    //                                                 email: "haha2@gmail.com",
    //                                                 identityID: "A282998",
    //                                             }).save().then(dta => {
    //                                                 new StudentInfo({
    //
    //                                                     user: dta.toObject()._id,
    //
    //                                                     englishLevel: "a2",
    //                                                     schoolYear: 29,
    //                                                     speciality: spec.toObject()._id
    //                                                 }).save().then(s => {
    //                                                     new Schedule({
    //                                                         items: [a.toObject()._id],
    //                                                         owner: s.toObject()._id,
    //                                                         year: {
    //                                                             from: 2019,
    //                                                             to: 2020
    //                                                         },
    //                                                         semester: 0,
    //
    //                                                     }).save()
    //                                                 })
    //
    //                                             });
    //                                         })
    //
    //                                 })
    //                             })
    //                         })
    //                     });
    //                 })
    //             });
    //         })
    //     })
    //
    // });
    //
    // new RegistrationEvent({
    //     studentGroup: 1,
    //     from: new Date().getTime(),
    //     to: new Date().getTime(),
    //     year: {
    //         from: 2019,
    //         to: 2020
    //     },
    //     semester: 0,
    // }).save().then(data => {
    //
    // });
    //
    // new Classroom({
    //     name: "cac"
    // }).save();
    //
    // new Division({
    //     name: "test",
    //     pricePerCredit: 20000
    //
    // }).save().then(data => {
    //     new Speciality({
    //         name: "test",
    //         shortName: "s",
    //         pricePerCredit: [
    //             {
    //                 schoolYear: 29,
    //                 price: 500000
    //             }
    //         ]
    //     }).save().then(data1 => {
    //         new Subject({
    //             subjectID: "test2",
    //             name: "dasd",
    //             credits: 3,
    //             capacity: 15,
    //             coefficient: 0.2,
    //             division: data.toObject()._id
    //         }).save().then(data2 => {
    //             new EducateProgram({
    //                 subjects: [data2.toObject()._id],
    //                 speciality: data1.toObject()._id
    //
    //             }).save()
    //             new User({
    //                 username: "test6",
    //                 password: "admin",
    //                 role: "sv",
    //                 name: "ds2a",
    //                 dob: new Date().getTime(),
    //                 phone: "3122223",
    //                 email: "hah2a2@gmail.com",
    //                 identityID: "A2282998",
    //             }).save().then(dta => {
    //                 new StudentInfo({
    //
    //                     user: dta.toObject()._id,
    //
    //                     englishLevel: "a2",
    //                     schoolYear: 29,
    //                     speciality: data1.toObject()._id
    //                 }).save().then((s) => {
    //                     new Result({
    //                         owner: s.toObject()._id,
    //                         speciality: data1.toObject()._id,
    //                         results: [
    //                             {
    //                                 subject: data2.toObject()._id,
    //                                 grade: 10
    //                             }
    //                         ]
    //                     }).save()
    //                 })
    //             })
    //         })
    //     })
    // });
}