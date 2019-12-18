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
    division: {
        type: ObjectId,
        ref: "Division",
        required: true
    },
    type: {
        type: String,
        enum: ["GDDC", "GDCN"],
        default: "GDDC"
    },
});






module.exports = (db) => db.model("Subject", subjectSchema) ;