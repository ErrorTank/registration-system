const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const subjectSchema = new Schema({
    subjectID: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        default: 0
    },
    coefficient: {
        type: Number,
        required: true
    },
    subjectsRequired: {
        type: [
            {
                type: ObjectId,
                ref: "Subject",
                required: true
            }
        ],
        default: []
    },
    creditsRequired: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ["GDDC", "GDCN"],
        default: "GDDC"
    },
    includedClasses: {
        type: [
            {
                type: ObjectId,
                ref: "Class",
                required: true
            }
        ],
        required: true,
        validate: [function (val) {
            return val.length > 0;
        }, '{PATH} exceeds the limit of 10']
    }
});






module.exports = (db) => db.model("Subject", subjectSchema) ;