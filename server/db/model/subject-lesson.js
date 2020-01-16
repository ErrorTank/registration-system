const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const subjectLessonSchema = new Schema({
    lessons: {
        type: Mixed,
        default: [],
    },
    subject: {
        type: ObjectId,
        ref: "Subject",
        required: true
    },
});


module.exports = (db) => db.model("SubjectLesson", subjectLessonSchema);