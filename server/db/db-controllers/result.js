const appDb = require("../../config/db").getDbs().appDb;
const Result = require("../model/result")(appDb);
const User = require("../model/user")(appDb);
const Subject = require("../model/subject")(appDb);
const StudentInfo = require("../model/student-info")(appDb);
const Speciality = require("../model/speciality")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");



const importData = ({result}) => {
    let {owner ,speciality, results} = result;
    // schoolScheduleItems.forEach((sub, i) => {
    //
    //     if(sub.from > 10 || sub.to > 10)
    //         console.log("loz")
    // });
    return User.findOne({identityID: owner.identityID}).lean()
        .then(r => {
            if(r){
                return r;
            }
            return new User({
                ...owner,
                email: `sv${owner.identityID}@gmail.com`,  role: "sv",dob: new Date().getTime(), password: "test", username: owner.identityID, phone: owner.identityID
            }).save().then(data => data.toObject()).then(data => new StudentInfo({
                user: ObjectId(data._id),
                englishLevel: "a1",
                schoolYear: 29,
                speciality: ObjectId(speciality._id)
            }).save().then(() => data));
        })
        .then(u => {
            return Result.findOne({"owner": ObjectId(u._id), "speciality": ObjectId(speciality._id)})

                .then(data => {
                    if(data){
                        return Promise.reject(new ApplicationError("result_existed"))
                    }else{
                        return Subject.find({subjectID: {$in: results.map(each => each.subject.subjectID)}}).lean()
                            .then(subjects => {
                                const subjectMapping = subjects.reduce((result, current) => {
                                    result[current.subjectID] = ObjectId(current._id);
                                    return result;
                                }, {});
                                return new Result({
                                    owner: u._id,
                                    speciality: ObjectId(speciality._id),
                                    results: results.map(each => ({
                                        subject: subjectMapping[each.subject.subjectID],
                                        grade: each.grade
                                    }))
                                }).save()
                            })
                    }
                })
        })

};

const getAvaiableSpecs = (studentID) => {
    return Result.find({owner: ObjectId(studentID)}).populate("speciality").then(data => {
        return data.map(each => each.speciality);
    })
};

const getResultByStudentId = (studentID, {speciality}) => {
    return Result.findOne({
        owner: ObjectId(studentID),
        speciality: ObjectId(speciality)
    }).populate("results.subject")
};

module.exports = {
    importData,
    getResultByStudentId,
    getAvaiableSpecs

}