const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const resultSchema = new Schema({
    owner: {
        type: ObjectId,
        ref: "StudentInfo"
    },
    speciality: {
        type: ObjectId,
        ref: "Speciality",
        required: true
    },
    results: {
        type: [
            {
                subject: {
                    type: ObjectId,
                    ref: "Subject",
                    required: true
                },
                grade: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});


module.exports = (db) => db.model("Result", resultSchema);