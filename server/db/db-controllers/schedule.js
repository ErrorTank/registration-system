const appDb = require("../../config/db").getDbs().appDb;
const Schedule = require("../model/schedule")(appDb);
const Class = require("../model/class")(appDb);
const SchoolScheduleItem = require("../model/school-schedule-items")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");


const getStudentSchedule = ({studentID, semester, year}, {active}) => {
    let [from, to] = year.split("-");
    let filter = {
        owner: ObjectId(studentID),
        "year.from": from,
        "year.to": to,
        semester,
    };
    console.log("active: ")
    console.log(active)
    if(active === "true"){
        filter.active = true;
    }
    return Schedule.findOne(filter).populate({
        path: 'list',
        populate: [
            {
                path: 'class',
                model: 'Class',
                populate: {
                    "path": "subject",
                    "model": "Subject"
                }
            },
            {
                path: 'from',
                model: 'Shift'
            },
            {
                path: 'to',
                model: 'Shift'
            }, {
                path: 'classRoom',
                model: 'ClassRoom'
            },
        ]

    })

        .then((data) => {
            return data;
        })
};


const toggleRegisterLesson = ({studentID, semester, year}, {lesson}) => {
    let classIds = lesson.map(each => ObjectId(each._id));
    let classStringIds = lesson.map(each => each._id);
    console.log(classIds)
    console.log(classStringIds)
    let [from, to] = year.split("-");

    return Schedule.aggregate([
        {
            $match: {
                $and: [
                    {"year.from": Number(from)},
                    {"year.to": Number(to)},
                    {semester: Number(semester)}
                ]
            }
        },
        {$lookup: {from: 'schoolscheduleitems', localField: 'list', foreignField: '_id', as: "list"}},


    ]).then(schedules => {
        return Schedule.findOne({
            owner: ObjectId(studentID),
            "year.from": Number(from),
            "year.to": Number(to),
            semester: Number(semester)
        }).populate({
            path: 'list',
            populate: [
                {
                    path: 'class',
                    model: 'Class',
                    populate: {
                        "path": "subject",
                        "model": "Subject"
                    }
                },
                {
                    path: 'from',
                    model: 'Shift'
                },
                {
                    path: 'to',
                    model: 'Shift'
                }, {
                    path: 'classRoom',
                    model: 'ClassRoom'
                },
            ]

        })
            .then(schedule => {
                // let totalCredits = Object.values(schedule.list.reduce((result, cur) => ({...result, [cur.class.subject._id] : cur.class.subject.credits}),{})).reduce((total, cur) => total + cur,0);
                // if(totalCredits )
                console.log(schedule)
                if (!schedule) {
                    return new Schedule({
                        owner: ObjectId(studentID),
                        year: {
                            from: Number(from),
                            to: Number(to)
                        },
                        semester,
                        list: classIds
                    }).save();
                }
                let filter = {
                    owner: ObjectId(studentID),
                    "year.from": Number(from),
                    "year.to": Number(to),
                    semester: Number(semester)
                };
                // subject: ObjectId(lesson[0].subject._id)
                return SchoolScheduleItem.aggregate([
                    {$lookup: {from: 'classes', localField: 'class', foreignField: '_id', as: "class"}},
                    {
                        $addFields: {
                            'class': {
                                $arrayElemAt: ["$class", 0]
                            },
                        }
                    },
                    {
                        $match: {
                            "class.subject": ObjectId(lesson[0].subject._id)
                        }
                    }
                ]).then(all => {
                    let overSlot = lesson.find(e => {
                        let count = schedules.filter(sc => sc.list.find(item => item._id.toString() === e._id.toString())).length;
                        return e.capacity.max === count

                    });
                    return schedule.list.filter(each => classStringIds.includes(each._id.toString())).length === lesson.length ?
                        Schedule.findOneAndUpdate(filter, {$pull: {list: {$in: classStringIds}}}, {new: true}).lean() :
                        overSlot ? Promise.reject(new ApplicationError("full", overSlot)) :
                        Schedule.findOneAndUpdate(filter, {$pull: {list: {$in: all.map(each => ObjectId(each._id))}},}, {new: true}).then(() =>
                            Schedule.findOneAndUpdate(filter, {$push: {list: {$each: classIds}},}, {new: true}).lean());
                })
            });
    })
};

module.exports = {
    getStudentSchedule,
    toggleRegisterLesson
}