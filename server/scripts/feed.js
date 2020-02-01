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
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;
    const SubjectLesson = require("../db/model/subject-lesson")(appDb);

    // SchoolScheduleItems.updateMany({studentGroup: 1}, {studentGroup: 2}).then(() => {
    //     console.log("cac")
    // })
    // StudentInfo.updateMany({}, {active: true}).then(() => {
    //     console.log("cac")
    // })

    // SchoolScheduleItems.updateMany({}, {disabled: false}).then(() => {
    //     console.log("cac")
    // })
    // SubjectLesson.deleteMany({}).then(() => console.log("cac"));
    // Class.deleteMany({}).then(() => console.log("cac"));
    // Classroom.deleteMany({}).then(() => console.log("cac"));
    // EducateProgram.deleteMany({}).then(() => console.log("cac"));
    // RegistrationEvent.deleteMany({}).then(() => console.log("cac"));
    // Result.deleteMany({}).then(() => console.log("cac"));
    // Schedule.deleteMany({}).then(() => console.log("cac"));
    // SchoolScheduleItems.deleteMany({}).then(() => console.log("cac"));
    // StudentInfo.deleteMany({}).then(() => console.log("cac"));
    // Subject.deleteMany({}).then(() => console.log("cac"));
    // User.deleteMany({role: {$ne: "admin"}}).then(() => console.log("cac"));
    // DptInsInfo.deleteMany({}).then(() => console.log("cac"));
    // Shift.deleteMany({}).then(() => console.log("cac"));
    // Division.deleteMany({}).then(() => console.log("cac"));
    // Subject.updateMany({}, {coefficient: 4}).then(() => console.log("cac"));
    // Subject.findOne({_id: ObjectId("5e22acfa5f7e8d122cf20ada")}).lean().then(data => {
    //     console.log(data)
    //     Class.find({subject: ObjectId(data._id)}).lean().then(ok => console.log(ok))
    //     SubjectLesson.findOne({subject: ObjectId(data._id)}).lean().then(ok => console.log(ok))
    // })
    // SubjectLesson.find({}).populate([
    //     {
    //         path: "subject"
    //     },
    //     {
    //         path: "lessons"
    //     }
    // ]).then((data) => {
    //     console.log(data.map(each => each.lessons))
    // })
    // Class.find({_id: ObjectId("5e22be5bc293fb09a8ef4636")}).then(data => console.log(data))

    // const shifts = [
    //     {
    //         name: 1,
    //         from: "7h05",
    //         to: "8h00"
    //     }, {
    //         name: 2,
    //         from: "8h05",
    //         to: "9h00"
    //     },
    //     {
    //         name: 3,
    //         from: "9h15",
    //         to: "10h10"
    //     }, {
    //         name: 4,
    //         from: "10h15",
    //         to: "11h10"
    //     },{
    //         name: 5,
    //         from: "11h15",
    //         to: "12h10"
    //     },{
    //         name: 6,
    //         from: "13h00",
    //         to: "13h55"
    //     },{
    //         name: 7,
    //         from: "14h00",
    //         to: "14h55"
    //     },{
    //         name: 8,
    //         from: "15h10",
    //         to: "16h05"
    //     },{
    //         name: 9,
    //         from: "16h10",
    //         to: "17h05"
    //     },{
    //         name: 10,
    //         from: "17h10",
    //         to: "18h05"
    //     },{
    //         name: 11,
    //         from: "17h10",
    //         to: "18h05"
    //     },{
    //         name: 12,
    //         from: "18h15",
    //         to: "19h10"
    //     },{
    //         name: 13,
    //         from: "19h15",
    //         to: "20h10"
    //     },{
    //         name: 14,
    //         from: "20h15",
    //         to: "21h10"
    //     },{
    //         name: 15,
    //         from: "21h15",
    //         to: "22h05"
    //     },
    // ];
    //
    // for(let i of shifts){
    //     new Shift(i).save()
    // }

    // new AppConfig({
    //     latestSchoolYear: 32
    // }).save().then((s) => {
    //     console.log("dsadasdsa")
    // });
    //
    // User.findOne({identityID: "CTI014"}).lean().then(data => {
    //     DptInsInfo.findOne({user: ObjectId(data._id)}).lean().then(info => console.log(info))
    // })
    // DptInsInfo.findOneAndUpdate({_id: ObjectId("5e22c27e0809a232645888aa")}, {canEditSchedule: true}).then(() => console.log("cac"))
    // new User({
    //     username: "pdt01",
    //     password: "test",
    //     role: "pdt",
    //     name: "Alo123",
    //     dob: new Date().getTime(),
    //     phone: "312312",
    //     email: "alo@gmail.com",
    //     identityID: "pdt001"
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