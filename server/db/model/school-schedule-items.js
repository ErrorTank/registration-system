const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const schoolScheduleItemsSchema = new Schema({
    year: {
        type: Number,
        default: new Date().getFullYear()
    },
    semester: {
        type: String,
        enum: ["ki1", "ki2", "ki3"],
        required: true
    },
    class: {
        type: ObjectId,
        ref: "Class",
        required: true
    },
    classRoom: {
        type: ObjectId,
        ref: "ClassRoom",
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ["t2", "t3", "t4", "t5", "t6", "t7", "cn"],
        required: true
    },
    instructor: {
        type: ObjectId,
        ref: "DptInsInfo",
        required: true
    },
    from: {
        type: ObjectId,
        ref: "Shift",
        required: true
    },
    to: {
        type: ObjectId,
        ref: "Shift",
        required: true
    },
});


module.exports = (db) => db.model("SchoolScheduleItems", schoolScheduleItemsSchema);