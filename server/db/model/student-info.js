const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const studentInfoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    englishLevel: {
        type: ObjectId,
        ref: "EnglishLevel",
        required: true
    },
    identityID: {
        type: String
    },
    schoolYear: {
        type: Number,
        required: true
    }
});


module.exports = (db) => db.model("StudentInfo", studentInfoSchema);