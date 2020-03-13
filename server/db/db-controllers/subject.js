const appDb = require("../../config/db").getDbs().appDb;
const User = require("../model/user")(appDb);
const Schedule = require("../model/schedule")(appDb);
const Subject = require("../model/subject")(appDb);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");



const getAllSubjects = ({keyword, division, credit, coefficient}) => {

    let pipeline = [];
    let query = {};
    if(division){
        query.division = ObjectId(division);
    }
    if(credit){
        query.credit = Number(credit);
    }
    if (coefficient) {
        let [from, to] = coefficient.split("-");
        query.coefficient = {
            $gte: Number(from),
            $lt: Number(to)
        };

    }
    if(Object.keys(query).length){
        pipeline.push({
            $match: query

        });
    }

    pipeline = pipeline.concat([
        {$lookup: {from: 'divisions', localField: 'division', foreignField: '_id', as: "division"}},
        {
            $addFields: {
                'speciality': {
                    $arrayElemAt: ["$speciality", 0]
                }
            }
        },
    ]);

    if (keyword) {
        pipeline.push({
            $match: {
                $or: [
                    {"subjectID": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                    {"name": {$regex: new RegExp('.*' + keyword.toLowerCase() + '.*', "i")}},
                ]
            }
        });
    }

    return (pipeline.length > 3 ? Subject.aggregate(pipeline) : Subject.find({}).populate([
       {
            path: "division",
            model: "Division"
        },
    ]))
};

module.exports = {

    getAllSubjects
};