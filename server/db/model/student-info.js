const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const studentInfoSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    englishLevel: {
        type: String,
        required: true,
        enum: ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2", "e1", "e2", "g1", "g2"]
    },
    schoolYear: {
        type: Number,
        required: true
    },
    speciality: {
        ref: "Speciality",
        type: ObjectId,
        required: true
    }


});


module.exports = (db) => db.model("StudentInfo", studentInfoSchema);