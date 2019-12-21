const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//TODO department -> division

const schoolScheduleItemsSchema = new Schema({
    year: {
        from: {
            type: Number,
            required: true,
        },
        to: {
            type: Number,
            required: true
        },
    },
    semester: {
        type: Number,
        enum: [0, 1, 2],
        required: true
    },
    studentGroup: {
        type: Number,
        enum: [1, 2, 3],
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
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
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